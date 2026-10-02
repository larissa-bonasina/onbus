<template>
  <q-dialog :model-value="modelValue" @update:model-value="emit('update:modelValue', $event)">
    <q-card class="dlg">
      <q-form @submit.prevent="enviar">
        <q-card-section class="dlg__head">
          <h2>Gerar mensalidade</h2>
          <q-btn flat round dense icon="sym_r_close" aria-label="Fechar" v-close-popup />
        </q-card-section>

        <q-card-section class="dlg__body">
          <q-select
            v-model="cpf"
            outlined
            label="Aluno"
            :options="opcoesFiltradas"
            emit-value
            map-options
            use-input
            input-debounce="0"
            :disable="!!alunoFixo"
            :rules="[(v) => !!v || 'Escolha o aluno']"
            @filter="filtrar"
          >
            <template #no-option><q-item><q-item-section class="text-grey">Nenhum aluno encontrado</q-item-section></q-item></template>
          </q-select>
          <q-input
            v-model.number="valor"
            outlined
            type="number"
            step="0.01"
            min="0"
            label="Valor"
            prefix="R$"
            :rules="[(v) => Number(v) > 0 || 'Informe um valor maior que zero']"
          />
          <q-input
            v-model="vencimento"
            outlined
            type="date"
            label="Vencimento"
            stack-label
            :rules="[(v) => !!v || 'Informe o vencimento']"
          />
          <div v-if="erro" class="dlg__error" role="alert"><q-icon name="sym_r_error" size="18px" />{{ erro }}</div>
        </q-card-section>

        <q-card-actions align="right" class="dlg__actions">
          <q-btn flat no-caps label="Cancelar" color="grey-8" v-close-popup />
          <q-btn unelevated no-caps type="submit" color="primary" label="Gerar" :loading="enviando" />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { AlunoAdmin, mensagemDeErro } from 'src/composables/useAdminData';

const props = defineProps<{ modelValue: boolean; alunos: AlunoAdmin[]; alunoFixo?: AlunoAdmin | null }>();
const emit = defineEmits<{ 'update:modelValue': [boolean]; gerado: [] }>();
const $q = useQuasar();

// Dia 10 do próximo mês como sugestão de vencimento
const sugestao = () => {
  const d = new Date();
  const proximo = new Date(d.getFullYear(), d.getMonth() + 1, 10);
  return `${proximo.getFullYear()}-${String(proximo.getMonth() + 1).padStart(2, '0')}-10`;
};

const cpf = ref<string | null>(null);
const valor = ref<number | null>(null);
const vencimento = ref(sugestao());
const enviando = ref(false);
const erro = ref('');
const busca = ref('');

const opcoes = computed(() => props.alunos.map((a) => ({ label: `${a.nome} · ${a.curso}`, value: a.cpf })));
const opcoesFiltradas = computed(() => {
  const q = busca.value.toLowerCase();
  return q ? opcoes.value.filter((o) => o.label.toLowerCase().includes(q)) : opcoes.value;
});

function filtrar(val: string, update: (fn: () => void) => void) {
  update(() => { busca.value = val; });
}

watch(() => props.modelValue, (aberto) => {
  if (!aberto) return;
  cpf.value = props.alunoFixo?.cpf ?? null;
  erro.value = '';
  vencimento.value = sugestao();
});

async function enviar() {
  erro.value = '';
  enviando.value = true;
  try {
    await api.post('/admin/gerar-boleto', { aluno: { cpf: cpf.value }, valor: Number(valor.value).toFixed(2), vencimento: vencimento.value });
    const nome = props.alunos.find((a) => a.cpf === cpf.value)?.nome ?? 'o aluno';
    $q.notify({ type: 'positive', icon: 'sym_r_check_circle', message: 'Mensalidade gerada', caption: `Para ${nome}` });
    emit('update:modelValue', false);
    emit('gerado');
  } catch (e) {
    erro.value = mensagemDeErro(e, 'Não foi possível gerar a mensalidade.');
  } finally {
    enviando.value = false;
  }
}
</script>

<style scoped>
.dlg {
  width: 440px;
  max-width: 92vw;
  border-radius: 20px;
}

.dlg__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0;
}

.dlg__head h2 {
  font-size: 1.2rem;
}

.dlg__body {
  display: grid;
  gap: 4px;
}

.dlg__error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  background: var(--ob-bad-bg);
  color: var(--ob-bad);
  font-size: 14px;
}

.dlg__actions {
  padding: 0 16px 16px;
}
</style>
