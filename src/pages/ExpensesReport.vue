<template>
  <q-page class="page">
    <header class="head">
      <q-btn flat round dense icon="sym_r_arrow_back" aria-label="Voltar" @click="voltar" />
      <div>
        <h1 class="ob-title">Prestação de contas</h1>
        <p class="ob-muted sub">Como a associação usa o dinheiro das mensalidades</p>
      </div>
    </header>

    <template v-if="carregando">
      <q-skeleton height="110px" class="skel" />
      <q-skeleton height="180px" class="skel" />
    </template>

    <div v-else-if="erro" class="empty ob-card">
      <q-icon name="sym_r_cloud_off" size="40px" />
      <strong>Não foi possível carregar a prestação de contas</strong>
      <q-btn unelevated no-caps color="primary" label="Tentar de novo" @click="carregar" />
    </div>

    <div v-else-if="!despesas.length" class="empty ob-card">
      <q-icon name="sym_r_account_balance" size="40px" />
      <strong>Nenhuma despesa lançada ainda</strong>
      <span class="ob-muted">Quando a associação registrar os gastos, eles aparecem aqui.</span>
    </div>

    <template v-else>
      <section class="total ob-card">
        <span class="ob-muted">Total gasto em {{ anoAtual }}</span>
        <strong>{{ reais(totalAno) }}</strong>
        <span class="ob-muted">{{ despesasAno }} {{ despesasAno === 1 ? 'despesa' : 'despesas' }} lançadas</span>
      </section>

      <section v-for="grupo in grupos" :key="grupo.chave">
        <div class="list-head">
          <h2>{{ grupo.titulo }}</h2>
          <span>{{ reais(grupo.total) }}</span>
        </div>
        <ul class="list ob-card">
          <li v-for="d in grupo.itens" :key="d.id" class="row">
            <span class="row__text">
              <strong>{{ d.descricao }}</strong>
              <span class="ob-muted">{{ dataCurta(d.data) }}</span>
            </span>
            <strong class="row__val">{{ reais(d.valor) }}</strong>
          </li>
        </ul>
      </section>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'boot/axios';
import { reais } from 'src/utils/boletos';

interface Despesa { id: string; descricao: string; valor: number; data: string }

const router = useRouter();
const despesas = ref<Despesa[]>([]);
const carregando = ref(true);
const erro = ref(false);
const anoAtual = new Date().getFullYear();

const doAno = computed(() => despesas.value.filter((d) => d.data?.startsWith(String(anoAtual))));
const totalAno = computed(() => doAno.value.reduce((s, d) => s + d.valor, 0));
const despesasAno = computed(() => doAno.value.length);

// Datas chegam como "aaaa-mm-dd"; montar a Date por partes evita o deslocamento de fuso.
const paraData = (iso: string) => {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d);
};
const dataCurta = (iso: string) => paraData(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });

const grupos = computed(() => {
  const mapa = new Map<string, Despesa[]>();
  for (const d of despesas.value) {
    const chave = d.data.slice(0, 7);
    mapa.set(chave, [...(mapa.get(chave) ?? []), d]);
  }
  return [...mapa.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([chave, itens]) => {
      const nome = paraData(`${chave}-01`).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      return { chave, itens, titulo: nome.charAt(0).toUpperCase() + nome.slice(1), total: itens.reduce((s, d) => s + d.valor, 0) };
    });
});

function voltar() {
  if (window.history.length > 1) router.back();
  else router.push('/perfil');
}

async function carregar() {
  carregando.value = true;
  erro.value = false;
  try {
    const { data } = await api.get('/contas');
    despesas.value = data;
  } catch {
    erro.value = true;
  } finally {
    carregando.value = false;
  }
}

onMounted(carregar);
</script>

<style scoped>
.page {
  max-width: 560px;
  margin: 0 auto;
  padding: calc(16px + env(safe-area-inset-top, 0px)) 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.head {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-left: -6px;
}

.head .q-btn {
  margin-top: 2px;
}

.sub {
  margin: 2px 0 0;
  font-size: 14px;
}

.skel {
  border-radius: var(--ob-radius-lg);
}

.total {
  display: grid;
  gap: 2px;
  padding: 20px;
  font-size: 13px;
}

.total strong {
  font-family: var(--ob-font-display);
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: var(--ob-ink);
}

.list-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin: 4px 2px 10px;
}

.list-head h2 {
  font-size: 1.05rem;
}

.list-head span {
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

.list {
  list-style: none;
  margin: 0;
  padding: 2px 16px;
}

.row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid var(--ob-subtle);
}

.row:last-child {
  border-bottom: 0;
}

.row__text {
  flex: 1;
  min-width: 0;
  display: grid;
  font-size: 13px;
}

.row__text strong {
  font-size: 14.5px;
  font-weight: 600;
}

.row__val {
  font-variant-numeric: tabular-nums;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 36px 24px;
  text-align: center;
  color: var(--ob-faint);
}

.empty strong {
  color: var(--ob-ink);
  font-size: 1.05rem;
}

.empty .q-btn {
  margin-top: 8px;
}
</style>
