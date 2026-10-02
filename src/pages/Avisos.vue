<template>
  <q-page class="page">
    <header>
      <h1 class="ob-title">Avisos</h1>
      <p class="ob-muted sub">Recados da associação</p>
    </header>

    <template v-if="carregando">
      <q-skeleton v-for="n in 3" :key="n" height="104px" class="skel" />
    </template>

    <div v-else-if="erro" class="empty ob-card">
      <q-icon name="sym_r_cloud_off" size="40px" />
      <strong>Não foi possível carregar os avisos</strong>
      <span class="ob-muted">Verifique sua conexão.</span>
      <q-btn unelevated no-caps color="primary" label="Tentar de novo" @click="carregar" />
    </div>

    <div v-else-if="!avisos.length" class="empty ob-card">
      <q-icon name="sym_r_campaign" size="40px" />
      <strong>Nenhum aviso no momento</strong>
      <span class="ob-muted">Quando a associação publicar um recado, ele aparece aqui.</span>
    </div>

    <ul v-else class="list">
      <li v-for="(aviso, i) in avisos" :key="aviso.id" class="aviso ob-card">
        <div class="aviso__meta">
          <span v-if="i === 0 && recente(aviso.criadoEm)" class="ob-chip ob-chip--brand">Novo</span>
          <time class="ob-muted" :datetime="aviso.criadoEm || undefined">{{ quando(aviso.criadoEm) }}</time>
        </div>
        <h2 class="aviso__title">{{ aviso.titulo }}</h2>
        <p class="aviso__body">{{ aviso.mensagem }}</p>
      </li>
    </ul>

    <router-link to="/prestacao" class="cross ob-card">
      <q-icon name="sym_r_account_balance" size="22px" />
      <span>Ver a prestação de contas da associação</span>
      <q-icon name="sym_r_chevron_right" size="20px" />
    </router-link>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { api } from 'boot/axios';

defineOptions({ name: 'AvisosAluno' });

interface Aviso { id: string; titulo: string; mensagem: string; criadoEm: string | null }

const avisos = ref<Aviso[]>([]);
const carregando = ref(true);
const erro = ref(false);

const recente = (iso: string | null) => !!iso && Date.now() - new Date(iso).getTime() < 3 * 24 * 3600 * 1000;

function quando(iso: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  const dias = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (dias === 0) return `Hoje, ${d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
  if (dias === 1) return 'Ontem';
  return d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: d.getFullYear() === new Date().getFullYear() ? undefined : 'numeric' });
}

async function carregar() {
  carregando.value = true;
  erro.value = false;
  try {
    const { data } = await api.get('/avisos');
    avisos.value = data;
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
  gap: 14px;
}

.sub {
  margin: 2px 0 4px;
  font-size: 14px;
}

.skel {
  border-radius: var(--ob-radius-lg);
}

.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.aviso {
  padding: 18px;
}

.aviso__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.aviso__title {
  margin: 8px 0 6px;
  font-size: 1.1rem;
  font-weight: 700;
}

.aviso__body {
  margin: 0;
  color: var(--ob-ink-2);
  font-size: 15px;
  line-height: 1.55;
  white-space: pre-line;
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

.cross {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  color: var(--ob-ink);
  font-weight: 600;
  text-decoration: none;
}

.cross .q-icon {
  color: var(--ob-muted);
}

.cross span {
  flex: 1;
}
</style>
