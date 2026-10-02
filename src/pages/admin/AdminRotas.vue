<template>
  <q-page class="adm-page">
    <header class="adm-head">
      <div>
        <h1>Rotas</h1>
        <p>Trajeto, horários e dias de cada rota. O aluno vê no app a rota a que está vinculado.</p>
      </div>
    </header>

    <div class="cols">
      <q-form ref="form" class="adm-card compose" @submit.prevent="salvar">
        <div class="adm-card__head">
          <h2>{{ editando ? 'Editar rota' : 'Nova rota' }}</h2>
          <q-btn v-if="editando" flat dense no-caps color="grey-8" label="Cancelar" @click="limpar" />
        </div>
        <div class="compose__body">
          <q-input v-model="nome" outlined label="Nome da rota" placeholder="Ex.: Vera → Sinop" maxlength="80" :rules="[(v) => (v && v.trim().length >= 3) || 'Dê um nome à rota']" lazy-rules />

          <q-input
            v-for="campo in (['embarque', 'destino'] as const)"
            :key="campo"
            v-model="local[campo].texto"
            outlined
            :label="campo === 'embarque' ? 'Local de embarque' : 'Destino'"
            hint="Cidade ou endereço; confira o ponto no mapa"
            :loading="local[campo].buscando"
            :rules="[() => !!local[campo].ponto || 'Localize o ponto no mapa']"
            lazy-rules
            @update:model-value="local[campo].ponto = null"
            @keydown.enter.prevent="localizar(campo)"
            @blur="localizar(campo)"
          >
            <template #prepend>
              <q-icon :name="campo === 'embarque' ? 'sym_r_trip_origin' : 'sym_r_location_on'" />
            </template>
            <template #append>
              <q-icon v-if="local[campo].ponto" name="sym_r_check_circle" color="positive" />
            </template>
          </q-input>

          <div class="horarios">
            <q-input v-model="horarioIda" outlined type="time" label="Saída (ida)" stack-label :rules="[(v) => !!v || 'Informe o horário']" lazy-rules />
            <q-input v-model="horarioVolta" outlined type="time" label="Saída (volta)" stack-label clearable />
          </div>

          <div class="dias" role="group" aria-label="Dias da semana">
            <span class="dias__label">Dias</span>
            <q-btn
              v-for="(d, i) in DIAS_SEMANA"
              :key="d"
              round
              unelevated
              no-caps
              size="sm"
              :label="d.slice(0, 1)"
              :aria-label="d"
              :aria-pressed="dias.includes(i)"
              :color="dias.includes(i) ? 'primary' : 'grey-3'"
              :text-color="dias.includes(i) ? 'white' : 'grey-8'"
              @click="alternarDia(i)"
            />
          </div>

          <RouteMap v-if="local.embarque.ponto && local.destino.ponto" class="preview" :embarque="local.embarque.ponto" :destino="local.destino.ponto" />

          <q-btn unelevated no-caps type="submit" color="primary" :icon="editando ? 'sym_r_save' : 'sym_r_add_road'" :label="editando ? 'Salvar alterações' : 'Cadastrar rota'" :loading="enviando" class="compose__submit" />
        </div>
      </q-form>

      <section class="adm-card">
        <div class="adm-card__head">
          <h2>Cadastradas</h2>
          <span class="ob-muted count">{{ rotas.length }}</span>
        </div>
        <q-inner-loading :showing="carregando" />
        <div v-if="erro" class="adm-empty">
          <q-icon name="sym_r_cloud_off" size="32px" />
          <strong>Não foi possível carregar as rotas</strong>
          <q-btn unelevated no-caps color="primary" label="Tentar de novo" class="q-mt-sm" @click="carregar" />
        </div>
        <ul v-else-if="rotas.length" class="adm-list">
          <li v-for="r in rotas" :key="r.id" class="rota" :class="{ 'rota--on': editando === r.id }">
            <div class="rota__top">
              <strong>{{ r.nome }}</strong>
              <span>
                <q-btn flat round dense size="sm" color="grey-7" icon="sym_r_edit" :aria-label="`Editar rota ${r.nome}`" @click="editar(r)" />
                <q-btn flat round dense size="sm" color="grey-7" icon="sym_r_delete" :aria-label="`Remover rota ${r.nome}`" @click="remover(r)" />
              </span>
            </div>
            <p>{{ r.embarque.nome }} → {{ r.destino.nome }}</p>
            <p class="ob-muted">
              Ida {{ r.horarioIda }}<template v-if="r.horarioVolta"> · Volta {{ r.horarioVolta }}</template> · {{ resumoDias(r.dias) }}
            </p>
            <div class="rota__alerta">
              <span v-if="r.alerta" :class="`ob-chip ob-chip--${TIPOS_ALERTA[r.alerta.tipo].tom}`">
                <q-icon :name="TIPOS_ALERTA[r.alerta.tipo].icon" size="15px" />
                {{ tituloAlerta(r.alerta) }}
              </span>
              <q-btn
                flat
                dense
                no-caps
                size="sm"
                :color="r.alerta ? 'grey-8' : 'primary'"
                :icon="r.alerta ? 'sym_r_edit_notifications' : 'sym_r_campaign'"
                :label="r.alerta ? 'Editar alerta' : 'Avisar atraso ou desvio'"
                @click="abrirAlerta(r)"
              />
            </div>
          </li>
        </ul>
        <div v-else-if="!carregando" class="adm-empty">
          <q-icon name="sym_r_route" size="32px" />
          <span>Nenhuma rota cadastrada. Os alunos veem a rota no app assim que você criar a primeira.</span>
        </div>
      </section>
    </div>

    <AlertaRotaDialog v-model="dialogoAlerta" :rota="rotaAlerta" @atualizada="substituir" />
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { QForm, useQuasar } from 'quasar';
import { api } from 'boot/axios';
import RouteMap from 'components/RouteMap.vue';
import AlertaRotaDialog from 'components/AlertaRotaDialog.vue';
import { mensagemDeErro } from 'src/composables/useAdminData';
import { DIAS_SEMANA, TIPOS_ALERTA, geocodificar, resumoDias, tituloAlerta, type PontoRota, type Rota } from 'src/utils/rotas';

type Campo = 'embarque' | 'destino';
interface Local { texto: string; ponto: PontoRota | null; buscando: boolean }

const $q = useQuasar();
const rotas = ref<Rota[]>([]);
const carregando = ref(true);
const erro = ref(false);

const dialogoAlerta = ref(false);
const rotaAlerta = ref<Rota | null>(null);

function abrirAlerta(r: Rota) {
  rotaAlerta.value = r;
  dialogoAlerta.value = true;
}

const substituir = (nova: Rota) => (rotas.value = rotas.value.map((r) => (r.id === nova.id ? nova : r)));

const form = ref<QForm | null>(null);
const editando = ref<string | null>(null);
const nome = ref('');
const local = reactive<Record<Campo, Local>>({
  embarque: { texto: '', ponto: null, buscando: false },
  destino: { texto: '', ponto: null, buscando: false },
});
const horarioIda = ref('');
const horarioVolta = ref<string | null>('');
const dias = ref<number[]>([1, 2, 3, 4, 5]);
const enviando = ref(false);

async function carregar() {
  carregando.value = true;
  erro.value = false;
  try {
    rotas.value = (await api.get('/rotas')).data;
  } catch {
    erro.value = true;
  } finally {
    carregando.value = false;
  }
}

async function localizar(campo: Campo) {
  const l = local[campo];
  if (l.ponto || !l.texto?.trim() || l.buscando) return;
  l.buscando = true;
  try {
    l.ponto = await geocodificar(l.texto);
    if (!l.ponto) $q.notify({ type: 'warning', message: `Não encontramos "${l.texto.trim()}". Tente incluir a cidade e o estado.` });
  } catch {
    $q.notify({ type: 'negative', message: 'Não foi possível buscar o local agora.' });
  } finally {
    l.buscando = false;
  }
}

function alternarDia(i: number) {
  dias.value = dias.value.includes(i) ? dias.value.filter((d) => d !== i) : [...dias.value, i].sort();
}

function limpar() {
  editando.value = null;
  nome.value = '';
  for (const c of ['embarque', 'destino'] as const) Object.assign(local[c], { texto: '', ponto: null });
  horarioIda.value = '';
  horarioVolta.value = '';
  dias.value = [1, 2, 3, 4, 5];
  form.value?.resetValidation();
}

function editar(r: Rota) {
  editando.value = r.id;
  nome.value = r.nome;
  local.embarque.texto = r.embarque.nome;
  local.embarque.ponto = { ...r.embarque };
  local.destino.texto = r.destino.nome;
  local.destino.ponto = { ...r.destino };
  horarioIda.value = r.horarioIda;
  horarioVolta.value = r.horarioVolta ?? '';
  dias.value = [...r.dias];
}

async function salvar() {
  if (!dias.value.length) {
    $q.notify({ type: 'warning', message: 'Escolha ao menos um dia da semana.' });
    return;
  }
  const embarque = local.embarque.ponto;
  const destino = local.destino.ponto;
  if (!embarque || !destino) return;

  const dados = {
    nome: nome.value.trim(),
    embarque: { ...embarque, nome: local.embarque.texto.trim() },
    destino: { ...destino, nome: local.destino.texto.trim() },
    horarioIda: horarioIda.value,
    horarioVolta: horarioVolta.value || null,
    dias: dias.value,
  };

  enviando.value = true;
  try {
    if (editando.value) {
      const { data } = await api.put(`/rotas/${editando.value}`, dados);
      rotas.value = rotas.value.map((r) => (r.id === data.id ? data : r));
      $q.notify({ type: 'positive', icon: 'sym_r_save', message: 'Rota atualizada' });
    } else {
      const { data } = await api.post('/rotas', dados);
      rotas.value = [...rotas.value, data].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));
      $q.notify({ type: 'positive', icon: 'sym_r_route', message: 'Rota cadastrada' });
    }
    limpar();
  } catch (e) {
    $q.notify({ type: 'negative', message: mensagemDeErro(e, 'Não foi possível salvar a rota.') });
  } finally {
    enviando.value = false;
  }
}

function remover(r: Rota) {
  $q.dialog({
    title: 'Remover rota?',
    message: `"${r.nome}" deixa de existir. Só é possível remover rotas sem alunos vinculados.`,
    cancel: { label: 'Cancelar', flat: true, noCaps: true, color: 'grey-8' },
    ok: { label: 'Remover', unelevated: true, noCaps: true, color: 'negative' },
  }).onOk(async () => {
    try {
      await api.delete(`/rotas/${r.id}`);
      rotas.value = rotas.value.filter((x) => x.id !== r.id);
      if (editando.value === r.id) limpar();
      $q.notify({ message: 'Rota removida', icon: 'sym_r_delete' });
    } catch (e) {
      $q.notify({ type: 'negative', message: mensagemDeErro(e, 'Não foi possível remover a rota.') });
    }
  });
}

onMounted(carregar);
</script>

<style scoped>
.cols {
  display: grid;
  grid-template-columns: minmax(0, 6fr) minmax(0, 5fr);
  gap: 16px;
  align-items: start;
}

@media (max-width: 900px) {
  .cols { grid-template-columns: 1fr; }
}

.compose__body {
  display: grid;
  gap: 6px;
  padding: 18px 20px 20px;
}

.compose__submit {
  height: 48px;
  margin-top: 4px;
}

.horarios {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.dias {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  margin: 2px 0 10px;
}

.dias__label {
  font-size: 13px;
  color: var(--ob-muted);
  margin-right: 6px;
}

/* O RouteMap reserva 24px na base para o painel do app; aqui não há painel. */
.preview {
  height: 240px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 8px;
}

.preview :deep(.route-map__canvas) {
  inset: 0;
}

.count {
  font-weight: 600;
}

.rota {
  padding: 14px 20px;
  border-bottom: 1px solid var(--ob-subtle);
}

.rota:last-child {
  border-bottom: 0;
}

.rota--on {
  background: var(--ob-blue-50);
}

.rota__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.rota p {
  margin: 2px 0 0;
  font-size: 14px;
  color: var(--ob-ink-2);
}

.rota__alerta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.rota__alerta .ob-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.rota p.ob-muted {
  font-size: 13px;
  color: var(--ob-muted);
}
</style>
