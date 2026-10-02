<template>
  <q-page class="adm-page">
    <header class="adm-head">
      <div>
        <h1>Mensalidades</h1>
        <p>{{ resumo }}</p>
      </div>
      <q-btn unelevated no-caps color="primary" icon="sym_r_add" label="Gerar mensalidade" @click="dialogo = true" />
    </header>

    <section class="adm-card">
      <div class="adm-toolbar">
        <q-btn-toggle
          v-model="filtro"
          no-caps
          unelevated
          rounded
          toggle-color="primary"
          color="grey-2"
          text-color="grey-9"
          :options="[
            { label: `Pendentes (${contagem.pendentes})`, value: 'pendentes' },
            { label: `Vencidas (${contagem.vencido})`, value: 'vencido' },
            { label: `Pagas (${contagem.pago})`, value: 'pago' },
            { label: 'Todas', value: 'todas' },
          ]"
        />
      </div>

      <div v-if="erro" class="adm-empty">
        <q-icon name="sym_r_cloud_off" size="32px" />
        <strong>Não foi possível carregar as mensalidades</strong>
        <q-btn unelevated no-caps color="primary" label="Tentar de novo" class="q-mt-sm" @click="recarregar" />
      </div>
      <q-inner-loading :showing="carregando && !boletos.length" />

      <ul v-if="lista.length" class="adm-list">
        <li v-for="item in lista" :key="item.b.id" class="adm-row">
          <span class="adm-avatar">{{ iniciais(nomeDe(item.b.aluno)) }}</span>
          <span class="adm-row__main">
            <strong>{{ nomeDe(item.b.aluno) }}</strong>
            <span>{{ mesReferencia(item.b) }} · vencimento {{ item.b.vencimento || '—' }}</span>
          </span>
          <span class="adm-num">{{ reais(item.b.valor) }}</span>
          <span class="ob-chip status" :class="CHIP_STATUS[item.st]">{{ ROTULO_STATUS[item.st] }}</span>
          <q-btn
            v-if="item.st !== 'pago'"
            flat no-caps dense color="positive" icon="sym_r_check" label="Marcar pago"
            :loading="salvando === item.b.id"
            @click="marcarPago(item.b)"
          />
          <q-btn
            v-else
            flat round dense color="grey-7" icon="sym_r_undo"
            :loading="salvando === item.b.id"
            :aria-label="`Reabrir mensalidade de ${nomeDe(item.b.aluno)}`"
            @click="reabrir(item.b)"
          >
            <q-tooltip>Desfazer pagamento</q-tooltip>
          </q-btn>
        </li>
      </ul>
      <div v-else-if="!carregando && !erro" class="adm-empty">
        <q-icon name="sym_r_verified" size="32px" />
        <span>{{ filtro === 'todas' ? 'Nenhuma mensalidade gerada ainda.' : 'Nada por aqui neste filtro.' }}</span>
      </div>
    </section>

    <GerarMensalidadeDialog v-model="dialogo" :alunos="alunos" @gerado="carregarBoletos" />
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { useAlunos, useBoletos, mensagemDeErro } from 'src/composables/useAdminData';
import { Boleto, StatusBoleto, CHIP_STATUS, ROTULO_STATUS, dataVencimento, mesReferencia, reais, statusEfetivo } from 'src/utils/boletos';
import { iniciais } from 'src/utils/format';
import GerarMensalidadeDialog from 'components/GerarMensalidadeDialog.vue';

const $q = useQuasar();
const { alunos, carregar: carregarAlunos } = useAlunos();
const { boletos, carregando, erro, carregar: carregarBoletos } = useBoletos();
const filtro = ref<'pendentes' | StatusBoleto | 'todas'>('pendentes');
const dialogo = ref(false);
const salvando = ref<string | null>(null);

const nomes = computed(() => new Map(alunos.value.map((a) => [a.cpf, a.nome])));
const nomeDe = (cpf: string) => nomes.value.get(cpf) ?? 'Aluno removido';

const itens = computed(() =>
  boletos.value
    .map((b) => ({ b, st: statusEfetivo(b), venc: dataVencimento(b) }))
    .sort((x, y) => (x.venc?.getTime() ?? 0) - (y.venc?.getTime() ?? 0))
);

const contagem = computed(() => ({
  pendentes: itens.value.filter((i) => i.st !== 'pago').length,
  vencido: itens.value.filter((i) => i.st === 'vencido').length,
  pago: itens.value.filter((i) => i.st === 'pago').length,
}));

const lista = computed(() => {
  if (filtro.value === 'todas') return itens.value;
  if (filtro.value === 'pendentes') return itens.value.filter((i) => i.st !== 'pago');
  return itens.value.filter((i) => i.st === filtro.value);
});

const resumo = computed(() => {
  const pend = itens.value.filter((i) => i.st !== 'pago');
  const total = pend.reduce((s, i) => s + Number(i.b.valor), 0);
  return pend.length ? `${reais(total)} a receber em ${pend.length} ${pend.length === 1 ? 'mensalidade' : 'mensalidades'}` : 'Nenhuma mensalidade pendente';
});

async function atualizarStatus(b: Boleto, status: 'Pago' | 'Em aberto', msg: string) {
  salvando.value = b.id;
  try {
    await api.put(`/boletos/${b.id}/status`, { status });
    b.status = status;
    $q.notify({ type: status === 'Pago' ? 'positive' : undefined, icon: status === 'Pago' ? 'sym_r_check_circle' : 'sym_r_undo', message: msg, caption: `${nomeDe(b.aluno)} · ${mesReferencia(b)}` });
  } catch (e) {
    $q.notify({ type: 'negative', message: mensagemDeErro(e, 'Não foi possível atualizar a mensalidade.') });
  } finally {
    salvando.value = null;
  }
}

const marcarPago = (b: Boleto) => atualizarStatus(b, 'Pago', 'Pagamento registrado');
const reabrir = (b: Boleto) => atualizarStatus(b, 'Em aberto', 'Pagamento desfeito');

function recarregar() {
  carregarAlunos();
  carregarBoletos();
}

onMounted(recarregar);
</script>

<style scoped>
.status {
  min-width: 92px;
  justify-content: center;
}

@media (max-width: 640px) {
  .status {
    display: none;
  }
}
</style>
