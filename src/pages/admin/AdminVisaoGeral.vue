<template>
  <q-page class="adm-page">
    <header class="adm-head">
      <div>
        <h1>Visão geral</h1>
        <p>{{ hojeExtenso }}</p>
      </div>
      <div class="actions">
        <q-btn unelevated no-caps color="primary" icon="sym_r_campaign" label="Publicar aviso" to="/admin/avisos" />
        <q-btn outline no-caps color="primary" icon="sym_r_add" label="Gerar mensalidade" to="/admin/mensalidades" />
      </div>
    </header>

    <div v-if="erro" class="adm-card adm-empty">
      <q-icon name="sym_r_cloud_off" size="36px" />
      <strong>Não foi possível carregar os dados</strong>
      <q-btn unelevated no-caps color="primary" label="Tentar de novo" class="q-mt-sm" @click="recarregar" />
    </div>

    <template v-else>
      <section class="kpis">
        <article class="kpi adm-card">
          <span class="kpi__label"><q-icon name="sym_r_how_to_reg" size="18px" />Presentes hoje</span>
          <q-skeleton v-if="carregando" type="text" width="60%" height="44px" />
          <strong v-else class="kpi__value">{{ presentes.length }}<small>/{{ alunos.length }}</small></strong>
          <span class="kpi__foot">{{ carregando ? '' : `${pctPresenca}% dos alunos confirmaram` }}</span>
        </article>
        <article class="kpi adm-card">
          <span class="kpi__label"><q-icon name="sym_r_group" size="18px" />Alunos</span>
          <q-skeleton v-if="carregando" type="text" width="40%" height="44px" />
          <strong v-else class="kpi__value">{{ alunos.length }}</strong>
          <span class="kpi__foot">cadastrados no app</span>
        </article>
        <article class="kpi adm-card">
          <span class="kpi__label"><q-icon name="sym_r_schedule" size="18px" />Em aberto</span>
          <q-skeleton v-if="carregando" type="text" width="60%" height="44px" />
          <strong v-else class="kpi__value">{{ reais(totalAberto) }}</strong>
          <span class="kpi__foot">{{ abertos.length }} {{ abertos.length === 1 ? 'mensalidade' : 'mensalidades' }} a vencer</span>
        </article>
        <article class="kpi adm-card" :class="{ 'kpi--alert': vencidos.length }">
          <span class="kpi__label"><q-icon name="sym_r_warning" size="18px" />Vencidas</span>
          <q-skeleton v-if="carregando" type="text" width="60%" height="44px" />
          <strong v-else class="kpi__value">{{ reais(totalVencido) }}</strong>
          <span class="kpi__foot">{{ vencidos.length }} {{ vencidos.length === 1 ? 'mensalidade atrasada' : 'mensalidades atrasadas' }}</span>
        </article>
      </section>

      <div class="cols">
        <section class="adm-card">
          <div class="adm-card__head">
            <h2>Presença de hoje</h2>
            <router-link to="/admin/presenca" class="more">Ver todos</router-link>
          </div>
          <ul v-if="presentes.length" class="adm-list">
            <li v-for="p in presentes.slice(0, 6)" :key="p.aluno.cpf" class="adm-row">
              <span class="adm-avatar">{{ iniciais(p.aluno.nome) }}</span>
              <span class="adm-row__main"><strong>{{ p.aluno.nome }}</strong><span>{{ p.aluno.curso }}</span></span>
              <span class="ob-chip ob-chip--ok">{{ hora(p.em) }}</span>
            </li>
          </ul>
          <div v-else-if="!carregando" class="adm-empty">
            <q-icon name="sym_r_event_busy" size="32px" />
            <span>Ninguém confirmou presença hoje ainda.</span>
          </div>
        </section>

        <section class="adm-card">
          <div class="adm-card__head">
            <h2>Mensalidades vencidas</h2>
            <router-link to="/admin/mensalidades" class="more">Ver todas</router-link>
          </div>
          <ul v-if="vencidos.length" class="adm-list">
            <li v-for="b in vencidos.slice(0, 6)" :key="b.id" class="adm-row">
              <span class="adm-avatar">{{ iniciais(nomeDe(b.aluno)) }}</span>
              <span class="adm-row__main"><strong>{{ nomeDe(b.aluno) }}</strong><span>{{ mesReferencia(b) }} · venceu {{ b.vencimento }}</span></span>
              <span class="adm-num">{{ reais(b.valor) }}</span>
            </li>
          </ul>
          <div v-else-if="!carregando" class="adm-empty">
            <q-icon name="sym_r_verified" size="32px" />
            <span>Nenhuma mensalidade atrasada.</span>
          </div>
        </section>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAlunos, useBoletos, checkinDeHoje, hora } from 'src/composables/useAdminData';
import { mesReferencia, reais, statusEfetivo } from 'src/utils/boletos';
import { iniciais } from 'src/utils/format';

const { alunos, carregando: c1, erro: e1, carregar: carregarAlunos } = useAlunos();
const { boletos, carregando: c2, erro: e2, carregar: carregarBoletos } = useBoletos();
const carregando = computed(() => c1.value || c2.value);
const erro = computed(() => e1.value || e2.value);

const hojeExtenso = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^./, (c) => c.toUpperCase());

const presentes = computed(() =>
  alunos.value
    .map((aluno) => ({ aluno, em: checkinDeHoje(aluno) }))
    .filter((p): p is { aluno: typeof p.aluno; em: Date } => !!p.em)
    .sort((a, b) => b.em.getTime() - a.em.getTime())
);
const pctPresenca = computed(() => (alunos.value.length ? Math.round((presentes.value.length / alunos.value.length) * 100) : 0));

const vencidos = computed(() => boletos.value.filter((b) => statusEfetivo(b) === 'vencido'));
const abertos = computed(() => boletos.value.filter((b) => statusEfetivo(b) === 'aberto'));
const soma = (lista: typeof boletos.value) => lista.reduce((s, b) => s + Number(b.valor), 0);
const totalVencido = computed(() => soma(vencidos.value));
const totalAberto = computed(() => soma(abertos.value));

const nomes = computed(() => new Map(alunos.value.map((a) => [a.cpf, a.nome])));
const nomeDe = (cpf: string) => nomes.value.get(cpf) ?? 'Aluno removido';

function recarregar() {
  carregarAlunos();
  carregarBoletos();
}

onMounted(recarregar);
</script>

<style scoped>
.actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

@media (max-width: 1100px) {
  .kpis { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .kpis { gap: 10px; }
  .kpi { padding: 14px; }
  .kpi__value { font-size: 1.45rem; }
}

.kpi {
  display: grid;
  gap: 6px;
  padding: 18px 20px;
  align-content: start;
}

.kpi__label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--ob-muted);
}

.kpi__value {
  font-family: var(--ob-font-display);
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
}

.kpi__value small {
  font-size: 1.1rem;
  color: var(--ob-faint);
  font-weight: 600;
}

.kpi__foot {
  font-size: 13px;
  color: var(--ob-muted);
  min-height: 1.3em;
}

.kpi--alert {
  border-color: #f3c3c5;
  background: #fff8f8;
}

.kpi--alert .kpi__label,
.kpi--alert .kpi__value {
  color: var(--ob-bad);
}

.cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  align-items: start;
}

@media (max-width: 900px) {
  .cols { grid-template-columns: 1fr; }
}

.more {
  font-size: 13.5px;
  font-weight: 600;
  color: var(--ob-blue-600);
  text-decoration: none;
}
</style>
