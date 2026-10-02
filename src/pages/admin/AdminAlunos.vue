<template>
  <q-page class="adm-page">
    <header class="adm-head">
      <div>
        <h1>Alunos</h1>
        <p>{{ alunos.length }} {{ alunos.length === 1 ? 'aluno cadastrado' : 'alunos cadastrados' }}</p>
      </div>
    </header>

    <section class="adm-card">
      <div class="adm-toolbar">
        <q-input v-model="busca" dense outlined clearable placeholder="Buscar por nome, curso ou e-mail" class="search">
          <template #prepend><q-icon name="sym_r_search" /></template>
        </q-input>
      </div>

      <div v-if="erro" class="adm-empty">
        <q-icon name="sym_r_cloud_off" size="32px" />
        <strong>Não foi possível carregar os alunos</strong>
        <q-btn unelevated no-caps color="primary" label="Tentar de novo" class="q-mt-sm" @click="carregar" />
      </div>
      <q-inner-loading :showing="carregando && !alunos.length" />

      <ul v-if="lista.length" class="adm-list">
        <li v-for="a in lista" :key="a.cpf" class="adm-row">
          <span class="adm-avatar">{{ iniciais(a.nome) }}</span>
          <span class="adm-row__main">
            <strong>{{ a.nome }}</strong>
            <span>{{ a.curso }} · {{ a.email }}</span>
          </span>
          <span class="col-info gt-sm">
            <span>{{ formatarCpf(a.cpf) }}</span>
            <span>{{ formatarTelefone(a.numero) }}</span>
          </span>
          <q-select
            v-if="rotas.length"
            :model-value="a.rotaId ?? null"
            :options="opcoesRota"
            emit-value
            map-options
            dense
            outlined
            options-dense
            :label="a.rotaId ? undefined : 'Sem rota'"
            :aria-label="`Rota de ${a.nome}`"
            :loading="vinculando === a.cpf"
            class="rota-select"
            @update:model-value="(v) => vincular(a, v)"
          />
          <q-btn flat no-caps dense color="primary" icon="sym_r_receipt_long" label="Mensalidade" @click="abrirGerar(a)">
            <q-tooltip>Gerar mensalidade para {{ a.nome.split(' ')[0] }}</q-tooltip>
          </q-btn>
        </li>
      </ul>
      <div v-else-if="!carregando && !erro" class="adm-empty">
        <q-icon :name="busca ? 'sym_r_search_off' : 'sym_r_group'" size="32px" />
        <span>{{ busca ? 'Nenhum aluno encontrado.' : 'Nenhum aluno cadastrado ainda.' }}</span>
      </div>
    </section>

    <GerarMensalidadeDialog v-model="dialogo" :alunos="alunos" :aluno-fixo="selecionado" />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { useAlunos, AlunoAdmin, mensagemDeErro } from 'src/composables/useAdminData';
import { formatarCpf, formatarTelefone, iniciais } from 'src/utils/format';
import type { Rota } from 'src/utils/rotas';
import GerarMensalidadeDialog from 'components/GerarMensalidadeDialog.vue';

const $q = useQuasar();
const { alunos, carregando, erro, carregar } = useAlunos();

// ---------- Rota de cada aluno ----------
const rotas = ref<Rota[]>([]);
const vinculando = ref<string | null>(null);
const opcoesRota = computed(() => [
  { label: 'Sem rota', value: null },
  ...rotas.value.map((r) => ({ label: r.nome, value: r.id })),
]);

async function carregarRotas() {
  try {
    rotas.value = (await api.get('/rotas')).data;
  } catch {
    rotas.value = []; // sem rotas, a coluna simplesmente não aparece
  }
}

async function vincular(a: AlunoAdmin, rotaId: string | null) {
  vinculando.value = a.cpf;
  try {
    await api.put(`/rotas/alunos/${a.cpf}`, { rotaId });
    a.rotaId = rotaId;
  } catch (e) {
    $q.notify({ type: 'negative', message: mensagemDeErro(e, 'Não foi possível mudar a rota do aluno.') });
  } finally {
    vinculando.value = null;
  }
}
const busca = ref('');
const dialogo = ref(false);
const selecionado = ref<AlunoAdmin | null>(null);

const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const lista = computed(() => {
  const q = normalizar(busca.value ?? '');
  return q ? alunos.value.filter((a) => normalizar(`${a.nome} ${a.curso} ${a.email}`).includes(q)) : alunos.value;
});

function abrirGerar(a: AlunoAdmin) {
  selecionado.value = a;
  dialogo.value = true;
}

onMounted(() => {
  carregar();
  carregarRotas();
});
</script>

<style scoped>
.rota-select {
  width: 170px;
  flex-shrink: 0;
}

.search {
  flex: 1;
  min-width: 220px;
  max-width: 420px;
}

.col-info {
  display: grid;
  justify-items: end;
  font-size: 13px;
  color: var(--ob-muted);
  font-variant-numeric: tabular-nums;
  margin-right: 8px;
}
</style>
