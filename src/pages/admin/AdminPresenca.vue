<template>
  <q-page class="adm-page">
    <header class="adm-head">
      <div>
        <h1>Presença</h1>
        <p>{{ hojeExtenso }} · {{ presentes }} de {{ alunos.length }} confirmaram</p>
      </div>
      <q-btn flat no-caps color="primary" icon="sym_r_refresh" label="Atualizar" :loading="carregando" @click="carregar" />
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
            <span>{{ item.aluno.curso }} · {{ formatarTelefone(item.aluno.numero) }}</span>
          </span>
          <span v-if="item.em" class="ob-chip ob-chip--ok">Presente · {{ hora(item.em) }}</span>
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
import { useAlunos, checkinDeHoje, hora } from 'src/composables/useAdminData';
import { formatarTelefone, iniciais } from 'src/utils/format';

const { alunos, carregando, erro, carregar } = useAlunos();
const busca = ref('');
const filtro = ref<'todos' | 'presentes' | 'ausentes'>('todos');
const hojeExtenso = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^./, (c) => c.toUpperCase());

const comStatus = computed(() => alunos.value.map((aluno) => ({ aluno, em: checkinDeHoje(aluno) })));
const presentes = computed(() => comStatus.value.filter((i) => i.em).length);

const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const lista = computed(() => {
  const q = normalizar(busca.value ?? '');
  return comStatus.value
    .filter((i) => (filtro.value === 'presentes' ? i.em : filtro.value === 'ausentes' ? !i.em : true))
    .filter((i) => !q || normalizar(`${i.aluno.nome} ${i.aluno.curso}`).includes(q))
    .sort((a, b) => Number(!!b.em) - Number(!!a.em) || a.aluno.nome.localeCompare(b.aluno.nome, 'pt-BR'));
});

onMounted(carregar);
</script>

<style scoped>
.search {
  flex: 1;
  min-width: 200px;
  max-width: 360px;
}
</style>
