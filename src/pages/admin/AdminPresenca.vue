<template>
  <q-page class="adm-page">
    <header class="adm-head">
      <div>
        <h1>Presença</h1>
        <p>{{ presentes }} de {{ alunos.length }} confirmaram</p>
      </div>
      <div class="dia" role="group" aria-label="Dia da lista">
        <q-btn flat round dense icon="sym_r_chevron_left" aria-label="Dia anterior" @click="mudarDia(-1)" />
        <span class="dia__label">{{ diaExtenso }}</span>
        <q-btn flat round dense icon="sym_r_chevron_right" aria-label="Próximo dia" :disable="ehHoje" @click="mudarDia(1)" />
        <q-btn v-if="!ehHoje" flat dense no-caps color="primary" label="Hoje" @click="irParaHoje" />
        <q-btn flat round dense color="primary" icon="sym_r_refresh" aria-label="Atualizar" :loading="carregando" @click="recarregar" />
      </div>
    </header>

    <section class="adm-card">
      <div class="adm-toolbar">
        <q-input v-model="busca" dense outlined clearable placeholder="Buscar aluno" class="search">
          <template #prepend><q-icon name="sym_r_search" /></template>
        </q-input>
        <q-btn-toggle
          v-model="filtro"
          no-caps
          unelevated
          rounded
          toggle-color="primary"
          color="grey-2"
          text-color="grey-9"
          :options="[
            { label: 'Todos', value: 'todos' },
            { label: 'Presentes', value: 'presentes' },
            { label: 'Ausentes', value: 'ausentes' },
          ]"
        />
      </div>

      <div v-if="erro" class="adm-empty">
        <q-icon name="sym_r_cloud_off" size="32px" />
        <strong>Não foi possível carregar a lista</strong>
      </div>
      <q-inner-loading :showing="carregando && !alunos.length" />

      <ul v-if="lista.length" class="adm-list">
        <li v-for="item in lista" :key="item.aluno.cpf" class="adm-row">
          <span class="adm-avatar">{{ iniciais(item.aluno.nome) }}</span>
          <span class="adm-row__main">
            <strong>{{ item.aluno.nome }}</strong>
            <span>{{ item.aluno.curso }} · {{ formatarTelefone(item.aluno.numero) }}<template v-if="item.p"> · {{ item.p.rotaNome }}</template></span>
          </span>
          <span v-if="item.p" class="ob-chip ob-chip--ok">Presente · {{ hora(item.p.em) }}</span>
          <span v-else class="ob-chip ob-chip--neutral">Ausente</span>
        </li>
      </ul>
      <div v-else-if="!carregando && !erro" class="adm-empty">
        <q-icon name="sym_r_search_off" size="32px" />
        <span>Nenhum aluno encontrado.</span>
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useAlunos, usePresencas, hora, isoDia } from 'src/composables/useAdminData';
import { formatarTelefone, iniciais } from 'src/utils/format';

const { alunos, carregando: c1, erro: e1, carregar: carregarAlunos } = useAlunos();
const { presencas, carregando: c2, erro: e2, carregar: carregarPresencas } = usePresencas();
const carregando = computed(() => c1.value || c2.value);
const erro = computed(() => e1.value || e2.value);
const busca = ref('');
const filtro = ref<'todos' | 'presentes' | 'ausentes'>('todos');

// ---------- Dia exibido ----------
const dia = ref(new Date());
const ehHoje = computed(() => isoDia(dia.value) === isoDia(new Date()));
const diaExtenso = computed(() =>
  ehHoje.value
    ? 'Hoje'
    : dia.value.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' }).replace(/^./, (c) => c.toUpperCase())
);

function mudarDia(delta: number) {
  const d = new Date(dia.value);
  d.setDate(d.getDate() + delta);
  dia.value = d;
  carregarPresencas(isoDia(d));
}

function irParaHoje() {
  dia.value = new Date();
  carregarPresencas();
}

function recarregar() {
  carregarAlunos();
  carregarPresencas(ehHoje.value ? undefined : isoDia(dia.value));
}

// ---------- Lista ----------
const comStatus = computed(() => alunos.value.map((aluno) => ({ aluno, p: presencas.value.get(aluno.cpf) ?? null })));
const presentes = computed(() => comStatus.value.filter((i) => i.p).length);

const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const lista = computed(() => {
  const q = normalizar(busca.value ?? '');
  return comStatus.value
    .filter((i) => (filtro.value === 'presentes' ? i.p : filtro.value === 'ausentes' ? !i.p : true))
    .filter((i) => !q || normalizar(`${i.aluno.nome} ${i.aluno.curso}`).includes(q))
    .sort((a, b) => Number(!!b.p) - Number(!!a.p) || a.aluno.nome.localeCompare(b.aluno.nome, 'pt-BR'));
});

onMounted(() => {
  carregarAlunos();
  carregarPresencas();
});
</script>

<style scoped>
.dia {
  display: flex;
  align-items: center;
  gap: 2px;
}

.dia__label {
  min-width: 96px;
  text-align: center;
  font-weight: 600;
}
.search {
  flex: 1;
  min-width: 200px;
  max-width: 360px;
}
</style>
