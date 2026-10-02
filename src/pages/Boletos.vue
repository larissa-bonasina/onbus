<template>
  <q-page class="page">
    <header>
      <h1 class="ob-title">Boletos</h1>
      <p class="ob-muted sub">Mensalidades da associação</p>
    </header>

    <template v-if="carregando">
      <q-skeleton height="190px" class="skel" />
      <q-skeleton height="64px" class="skel" />
      <q-skeleton height="64px" class="skel" />
    </template>

    <div v-else-if="erro" class="empty ob-card">
      <q-icon name="sym_r_cloud_off" size="40px" />
      <strong>Não foi possível carregar seus boletos</strong>
      <span class="ob-muted">Verifique sua conexão.</span>
      <q-btn unelevated no-caps color="primary" label="Tentar de novo" @click="carregar" />
    </div>

    <template v-else>
      <section v-if="proximo" class="due" :class="{ 'due--late': proximo.st === 'vencido' }">
        <span class="due__label">{{ proximo.st === 'vencido' ? 'Mensalidade vencida' : 'Próxima mensalidade' }}</span>
        <span class="due__amount">{{ reais(proximo.b.valor) }}</span>
        <span class="due__when">
          {{ mesReferencia(proximo.b) }} ·
          {{ proximo.st === 'vencido' ? 'venceu' : 'vence' }} em {{ proximo.venc ? dataPorExtenso(proximo.venc) : proximo.b.vencimento }}
        </span>
        <!-- O código salvo hoje não é um boleto bancário real; pagamento online entra na Fase 2. -->
        <span class="due__note">
          <q-icon name="sym_r_info" size="18px" />
          O pagamento é feito direto com a associação, que atualiza o status aqui.
        </span>
      </section>

      <section v-else-if="itens.length" class="allgood ob-card">
        <q-icon name="sym_r_verified" size="32px" />
        <div>
          <strong>Tudo em dia</strong>
          <span class="ob-muted">Nenhuma mensalidade em aberto.</span>
        </div>
      </section>

      <section v-if="historico.length">
        <div class="list-head">
          <h2>Histórico</h2>
          <span class="ob-muted">{{ historico.length }} {{ historico.length === 1 ? 'boleto' : 'boletos' }}</span>
        </div>
        <ul class="list ob-card">
          <li v-for="item in historico" :key="item.b.id" class="row">
            <span class="row__ico"><q-icon name="sym_r_receipt" size="20px" /></span>
            <span class="row__text">
              <strong>{{ mesReferencia(item.b) }}</strong>
              <span class="ob-muted">Vencimento {{ item.b.vencimento || '—' }}</span>
            </span>
            <span class="row__end">
              <strong>{{ reais(item.b.valor) }}</strong>
              <span class="ob-chip" :class="CHIP_STATUS[item.st]">{{ ROTULO_STATUS[item.st] }}</span>
            </span>
          </li>
        </ul>
      </section>

      <div v-if="!itens.length" class="empty ob-card">
        <q-icon name="sym_r_receipt_long" size="40px" />
        <strong>Nenhum boleto por aqui</strong>
        <span class="ob-muted">Quando a associação gerar sua mensalidade, ela aparece nesta tela.</span>
      </div>
    </template>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { api } from 'boot/axios';
import {
  Boleto, StatusBoleto, CHIP_STATUS, ROTULO_STATUS,
  dataPorExtenso, dataVencimento, mesReferencia, reais, statusEfetivo,
} from 'src/utils/boletos';

defineOptions({ name: 'BoletosAluno' });

interface Item { b: Boleto; st: StatusBoleto; venc: Date | null }

const boletos = ref<Boleto[]>([]);
const carregando = ref(true);
const erro = ref(false);

const itens = computed<Item[]>(() =>
  boletos.value
    .map((b) => ({ b, st: statusEfetivo(b), venc: dataVencimento(b) }))
    .sort((x, y) => (y.venc?.getTime() ?? 0) - (x.venc?.getTime() ?? 0))
);

// Destaque: primeiro o vencido mais antigo; senão, o próximo a vencer.
const proximo = computed<Item | null>(() => {
  const pendentes = itens.value.filter((i) => i.st !== 'pago');
  const ordem = (i: Item) => (i.st === 'vencido' ? 0 : 1);
  return [...pendentes].sort((a, b) => ordem(a) - ordem(b) || (a.venc?.getTime() ?? 0) - (b.venc?.getTime() ?? 0))[0] ?? null;
});

const historico = computed(() => itens.value.filter((i) => i !== proximo.value));

async function carregar() {
  const aluno = JSON.parse(localStorage.getItem('aluno') || 'null');
  carregando.value = true;
  erro.value = false;
  try {
    const { data } = await api.get(`/boletos/${aluno?.cpf}`);
    boletos.value = Array.isArray(data) ? data : [];
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
  padding: calc(24px + env(safe-area-inset-top, 0px)) 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.sub {
  margin: 2px 0 0;
  font-size: 14px;
}

.skel {
  border-radius: var(--ob-radius-lg);
}

.due {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 22px;
  border-radius: var(--ob-radius-lg);
  background: var(--ob-blue-500);
  color: #fff;
}

.due::after {
  content: '';
  position: absolute;
  right: -48px;
  top: -48px;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  border: 26px solid rgba(255, 255, 255, 0.09);
  pointer-events: none;
}

.due--late {
  background: #b3242a;
}

.due__label {
  font-size: 13px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.85);
}

.due__amount {
  margin-top: 2px;
  font-family: var(--ob-font-display);
  font-weight: 700;
  font-size: 2.4rem;
  line-height: 1.1;
  letter-spacing: -0.035em;
  font-variant-numeric: tabular-nums;
}

.due__when {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.88);
}

.due__note {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-top: 16px;
  padding: 10px 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.14);
  font-size: 13px;
  line-height: 1.4;
}

.due__note .q-icon {
  margin-top: 1px;
  flex-shrink: 0;
}

.allgood {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  color: var(--ob-ok);
}

.allgood div {
  display: grid;
}

.allgood strong {
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
  font-size: 13px;
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

.row__ico {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 12px;
  background: var(--ob-subtle);
  color: #565b7c;
  display: flex;
  align-items: center;
  justify-content: center;
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

.row__end {
  display: grid;
  justify-items: end;
  gap: 4px;
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
