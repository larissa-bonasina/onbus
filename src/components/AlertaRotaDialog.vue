<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)" @before-show="preencher">
    <q-card v-if="rota" class="alerta-card">
      <q-form @submit.prevent="publicar">
        <q-card-section>
          <h2 class="alerta-card__title">Alerta da rota</h2>
          <p class="ob-muted">{{ rota.nome }} · os alunos veem no topo da tela inicial até o fim do dia.</p>
        </q-card-section>

        <q-card-section class="alerta-card__body">
          <q-btn-toggle
            v-model="tipo"
            spread
            no-caps
            unelevated
            toggle-color="primary"
            color="grey-2"
            text-color="grey-9"
            :options="opcoes"
          />
          <q-input
            v-if="tipo === 'atraso'"
            v-model.number="atrasoMin"
            outlined
            type="number"
            min="1"
            max="600"
            label="Atraso estimado"
            suffix="min"
          />
          <q-input
            v-model="mensagem"
            outlined
            autogrow
            type="textarea"
            maxlength="500"
            counter
            :label="tipo === 'desvio' ? 'Por onde o ônibus vai passar?' : 'Mensagem para os alunos'"
            :placeholder="exemplo"
            :rules="[(v) => (v && v.trim().length >= 3) || 'Explique o que aconteceu']"
            lazy-rules
          />
        </q-card-section>

        <q-card-actions class="alerta-card__actions">
          <q-btn v-if="rota.alerta" flat no-caps color="negative" icon="sym_r_notifications_off" label="Encerrar alerta" :loading="encerrando" @click="encerrar" />
          <q-space />
          <q-btn flat no-caps color="grey-8" label="Cancelar" v-close-popup />
          <q-btn unelevated no-caps type="submit" color="primary" icon="sym_r_campaign" :label="rota.alerta ? 'Atualizar alerta' : 'Publicar alerta'" :loading="enviando" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { mensagemDeErro } from 'src/composables/useAdminData';
import { TIPOS_ALERTA, type Rota, type TipoAlerta } from 'src/utils/rotas';

const props = defineProps<{ modelValue: boolean; rota: Rota | null }>();
const emit = defineEmits<{ 'update:modelValue': [boolean]; atualizada: [Rota] }>();

const $q = useQuasar();
const tipo = ref<TipoAlerta>('atraso');
const atrasoMin = ref<number | null>(null);
const mensagem = ref('');
const enviando = ref(false);
const encerrando = ref(false);

const opcoes = (Object.keys(TIPOS_ALERTA) as TipoAlerta[]).map((t) => ({ value: t, label: TIPOS_ALERTA[t].label, icon: TIPOS_ALERTA[t].icon }));

const exemplo = computed(
  () =>
    ({
      atraso: 'Ex.: Trânsito parado na BR-163 perto do posto. Saída prevista para 17:10.',
      desvio: 'Ex.: Acidente na BR-163, km 790. Vamos pela MT-140; embarque no mesmo ponto.',
      cancelada: 'Ex.: Ônibus em manutenção. A viagem de hoje não vai acontecer.',
    })[tipo.value]
);

// Ao abrir, parte do alerta atual (para editar) ou de um formulário limpo.
function preencher() {
  const a = props.rota?.alerta;
  tipo.value = a?.tipo ?? 'atraso';
  atrasoMin.value = a?.atrasoMin ?? null;
  mensagem.value = a?.mensagem ?? '';
}

async function publicar() {
  if (!props.rota) return;
  enviando.value = true;
  try {
    const { data } = await api.put(`/rotas/${props.rota.id}/alerta`, {
      tipo: tipo.value,
      mensagem: mensagem.value.trim(),
      atrasoMin: tipo.value === 'atraso' ? atrasoMin.value : null,
    });
    emit('atualizada', data);
    emit('update:modelValue', false);
    $q.notify({ type: 'positive', icon: 'sym_r_campaign', message: 'Alerta publicado', caption: 'Os alunos da rota já veem no app.' });
  } catch (e) {
    $q.notify({ type: 'negative', message: mensagemDeErro(e, 'Não foi possível publicar o alerta.') });
  } finally {
    enviando.value = false;
  }
}

async function encerrar() {
  if (!props.rota) return;
  encerrando.value = true;
  try {
    const { data } = await api.delete(`/rotas/${props.rota.id}/alerta`);
    emit('atualizada', data);
    emit('update:modelValue', false);
    $q.notify({ message: 'Alerta encerrado', icon: 'sym_r_notifications_off' });
  } catch (e) {
    $q.notify({ type: 'negative', message: mensagemDeErro(e, 'Não foi possível encerrar o alerta.') });
  } finally {
    encerrando.value = false;
  }
}
</script>

<style scoped>
.alerta-card {
  width: 520px;
  max-width: 100%;
  border-radius: var(--ob-radius-lg);
}

.alerta-card__title {
  font-size: 1.2rem;
  font-weight: 700;
  margin: 0 0 4px;
}

.alerta-card__title + p {
  margin: 0;
  font-size: 13.5px;
}

.alerta-card__body {
  display: grid;
  gap: 12px;
  padding-top: 0;
}

.alerta-card__actions {
  padding: 8px 16px 16px;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
