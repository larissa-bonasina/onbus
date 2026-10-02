<template>
  <q-page class="adm-page">
    <header class="adm-head">
      <div>
        <h1>Prestação de contas</h1>
        <p>Os alunos veem estas despesas no app — transparência sobre o uso das mensalidades.</p>
      </div>
    </header>

    <div class="cols">
      <q-form ref="formRef" class="adm-card compose" @submit.prevent="lancar">
        <div class="adm-card__head"><h2>Lançar despesa</h2></div>
        <div class="compose__body">
          <q-input v-model="descricao" outlined label="Descrição" hint="Ex.: Combustível, manutenção do ônibus" maxlength="140" :rules="[(v) => (v && v.trim().length >= 2) || 'Descreva a despesa']" lazy-rules />
          <div class="row-2">
            <q-input v-model.number="valor" outlined type="number" step="0.01" min="0" label="Valor" prefix="R$" :rules="[(v) => Number(v) > 0 || 'Valor maior que zero']" lazy-rules />
            <q-input v-model="data" outlined type="date" label="Data" stack-label :rules="[(v) => !!v || 'Informe a data']" lazy-rules />
          </div>
          <q-btn unelevated no-caps type="submit" color="primary" icon="sym_r_add" label="Lançar despesa" :loading="enviando" class="compose__submit" />
        </div>
      </q-form>

      <section class="adm-card">
        <div class="adm-card__head">
          <h2>Lançadas em {{ ano }}</h2>
          <span class="adm-num">{{ reais(totalAno) }}</span>
        </div>
        <q-inner-loading :showing="carregando" />
        <div v-if="erro" class="adm-empty">
          <q-icon name="sym_r_cloud_off" size="32px" />
          <strong>Não foi possível carregar as despesas</strong>
        </div>
        <ul v-else-if="despesas.length" class="adm-list">
          <li v-for="d in despesas" :key="d.id" class="adm-row">
            <span class="adm-row__main"><strong>{{ d.descricao }}</strong><span>{{ dataCurta(d.data) }}</span></span>
            <span class="adm-num">{{ reais(d.valor) }}</span>
            <q-btn flat round dense size="sm" color="grey-7" icon="sym_r_delete" :aria-label="`Remover ${d.descricao}`" @click="remover(d)" />
          </li>
        </ul>
        <div v-else-if="!carregando" class="adm-empty">
          <q-icon name="sym_r_account_balance" size="32px" />
          <span>Nenhuma despesa lançada ainda.</span>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { QForm, useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { mensagemDeErro } from 'src/composables/useAdminData';
import { reais } from 'src/utils/boletos';

interface Despesa { id: string; descricao: string; valor: number; data: string }

const $q = useQuasar();
const hojeIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const formRef = ref<QForm | null>(null);
const despesas = ref<Despesa[]>([]);
const carregando = ref(true);
const erro = ref(false);
const enviando = ref(false);
const descricao = ref('');
const valor = ref<number | null>(null);
const data = ref(hojeIso());
const ano = new Date().getFullYear();

const totalAno = computed(() => despesas.value.filter((d) => d.data.startsWith(String(ano))).reduce((s, d) => s + d.valor, 0));
const dataCurta = (iso: string) => {
  const [a, m, d] = iso.split('-').map(Number);
  return new Date(a, m - 1, d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
};

async function carregar() {
  carregando.value = true;
  erro.value = false;
  try {
    despesas.value = (await api.get('/contas')).data;
  } catch {
    erro.value = true;
  } finally {
    carregando.value = false;
  }
}

async function lancar() {
  enviando.value = true;
  try {
    const { data: nova } = await api.post('/contas', { descricao: descricao.value.trim(), valor: Number(valor.value), data: data.value });
    despesas.value = [nova, ...despesas.value].sort((a, b) => b.data.localeCompare(a.data));
    descricao.value = '';
    valor.value = null;
    formRef.value?.resetValidation();
    $q.notify({ type: 'positive', icon: 'sym_r_check_circle', message: 'Despesa lançada', caption: 'Já aparece na prestação de contas dos alunos.' });
  } catch (e) {
    $q.notify({ type: 'negative', message: mensagemDeErro(e, 'Não foi possível lançar a despesa.') });
  } finally {
    enviando.value = false;
  }
}

function remover(d: Despesa) {
  $q.dialog({
    title: 'Remover despesa?',
    message: `"${d.descricao}" (${reais(d.valor)}) sai da prestação de contas.`,
    cancel: { label: 'Cancelar', flat: true, noCaps: true, color: 'grey-8' },
    ok: { label: 'Remover', unelevated: true, noCaps: true, color: 'negative' },
  }).onOk(async () => {
    try {
      await api.delete(`/contas/${d.id}`);
      despesas.value = despesas.value.filter((x) => x.id !== d.id);
      $q.notify({ message: 'Despesa removida', icon: 'sym_r_delete' });
    } catch (e) {
      $q.notify({ type: 'negative', message: mensagemDeErro(e, 'Não foi possível remover a despesa.') });
    }
  });
}

onMounted(carregar);
</script>

<style scoped>
.cols {
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
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

.row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.compose__submit {
  height: 48px;
  margin-top: 4px;
}
</style>
