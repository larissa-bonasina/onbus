<template>
  <q-page class="adm-page">
    <header class="adm-head">
      <div>
        <h1>Avisos</h1>
        <p>O que você publicar aqui aparece na aba Avisos do app dos alunos.</p>
      </div>
    </header>

    <div class="cols">
      <q-form class="adm-card compose" @submit.prevent="publicar">
        <div class="adm-card__head"><h2>Novo aviso</h2></div>
        <div class="compose__body">
          <q-input v-model="titulo" outlined label="Título" maxlength="120" counter :rules="[(v) => (v && v.trim().length >= 3) || 'Escreva um título']" lazy-rules />
          <q-input v-model="mensagem" outlined type="textarea" autogrow label="Mensagem" maxlength="2000" counter input-style="min-height: 120px" :rules="[(v) => (v && v.trim().length >= 3) || 'Escreva a mensagem']" lazy-rules />
          <q-btn unelevated no-caps type="submit" color="primary" icon="sym_r_send" label="Publicar para os alunos" :loading="enviando" class="compose__submit" />
        </div>
      </q-form>

      <section class="adm-card">
        <div class="adm-card__head">
          <h2>Publicados</h2>
          <span class="ob-muted count">{{ avisos.length }}</span>
        </div>
        <q-inner-loading :showing="carregando" />
        <div v-if="erro" class="adm-empty">
          <q-icon name="sym_r_cloud_off" size="32px" />
          <strong>Não foi possível carregar os avisos</strong>
        </div>
        <ul v-else-if="avisos.length" class="adm-list">
          <li v-for="a in avisos" :key="a.id" class="aviso">
            <div class="aviso__top">
              <strong>{{ a.titulo }}</strong>
              <q-btn flat round dense size="sm" color="grey-7" icon="sym_r_delete" :aria-label="`Remover aviso ${a.titulo}`" @click="remover(a)" />
            </div>
            <p>{{ a.mensagem }}</p>
            <time class="ob-muted">{{ a.criadoEm ? new Date(a.criadoEm).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '' }}</time>
          </li>
        </ul>
        <div v-else-if="!carregando" class="adm-empty">
          <q-icon name="sym_r_campaign" size="32px" />
          <span>Nenhum aviso publicado ainda.</span>
        </div>
      </section>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { mensagemDeErro } from 'src/composables/useAdminData';

interface Aviso { id: string; titulo: string; mensagem: string; criadoEm: string | null }

const $q = useQuasar();
const avisos = ref<Aviso[]>([]);
const carregando = ref(true);
const erro = ref(false);
const titulo = ref('');
const mensagem = ref('');
const enviando = ref(false);

async function carregar() {
  carregando.value = true;
  erro.value = false;
  try {
    avisos.value = (await api.get('/avisos')).data;
  } catch {
    erro.value = true;
  } finally {
    carregando.value = false;
  }
}

async function publicar() {
  enviando.value = true;
  try {
    const { data } = await api.post('/avisos', { titulo: titulo.value.trim(), mensagem: mensagem.value.trim() });
    avisos.value.unshift(data);
    titulo.value = '';
    mensagem.value = '';
    $q.notify({ type: 'positive', icon: 'sym_r_campaign', message: 'Aviso publicado', caption: 'Os alunos já podem ver no app.' });
  } catch (e) {
    $q.notify({ type: 'negative', message: mensagemDeErro(e, 'Não foi possível publicar o aviso.') });
  } finally {
    enviando.value = false;
  }
}

function remover(a: Aviso) {
  $q.dialog({
    title: 'Remover aviso?',
    message: `"${a.titulo}" deixa de aparecer para os alunos.`,
    cancel: { label: 'Cancelar', flat: true, noCaps: true, color: 'grey-8' },
    ok: { label: 'Remover', unelevated: true, noCaps: true, color: 'negative' },
  }).onOk(async () => {
    try {
      await api.delete(`/avisos/${a.id}`);
      avisos.value = avisos.value.filter((x) => x.id !== a.id);
      $q.notify({ message: 'Aviso removido', icon: 'sym_r_delete' });
    } catch (e) {
      $q.notify({ type: 'negative', message: mensagemDeErro(e, 'Não foi possível remover o aviso.') });
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

.compose__submit {
  height: 48px;
  margin-top: 4px;
}

.count {
  font-weight: 600;
}

.aviso {
  padding: 16px 20px;
  border-bottom: 1px solid var(--ob-subtle);
}

.aviso:last-child {
  border-bottom: 0;
}

.aviso__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
}

.aviso p {
  margin: 4px 0 6px;
  color: var(--ob-ink-2);
  font-size: 14px;
  white-space: pre-line;
}

.aviso time {
  font-size: 12.5px;
}
</style>
