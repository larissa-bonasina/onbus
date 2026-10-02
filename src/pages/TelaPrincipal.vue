<template>
  <q-page class="home" :style-fn="fullHeight">
    <RouteMap v-if="rota" class="home__map" :embarque="rota.embarque" :destino="rota.destino" />
    <div v-else class="home__map home__map--vazio">
      <q-spinner v-if="carregandoRota" color="primary" size="28px" />
      <q-icon v-else name="sym_r_wrong_location" size="40px" />
    </div>

    <header class="home__top">
      <router-link to="/perfil" class="greet" aria-label="Abrir perfil">
        <span class="greet__avatar">{{ iniciais }}</span>
        Olá, {{ primeiroNome }}
      </router-link>
      <router-link to="/avisos" class="round-btn" aria-label="Avisos da associação">
        <q-icon name="sym_r_notifications" size="22px" />
      </router-link>
    </header>

    <section class="sheet">
      <div class="sheet__handle" />

      <div class="sheet__status">
        <span v-if="confirmadoHoje" class="ob-chip ob-chip--ok">Presença confirmada</span>
        <span v-else class="ob-chip ob-chip--neutral">Presença não confirmada</span>
        <span class="ob-muted sheet__hint">
          {{ confirmadoHoje ? `hoje às ${horaCheckin}` : rota && !rodaHoje(rota) ? 'hoje não tem viagem nesta rota' : 'para a viagem de hoje' }}
        </span>
      </div>

      <template v-if="rota">
        <h1 class="sheet__title">{{ rota.nome }}</h1>
        <div class="sheet__meta">
          <span><q-icon name="sym_r_trip_origin" size="16px" />Embarque: {{ rota.embarque.nome }}</span>
          <span><q-icon name="sym_r_location_on" size="16px" />Destino: {{ rota.destino.nome }}</span>
          <span>
            <q-icon name="sym_r_schedule" size="16px" />
            Ida {{ rota.horarioIda }}<template v-if="rota.horarioVolta"> · Volta {{ rota.horarioVolta }}</template>
            · {{ resumoDias(rota.dias) }}
          </span>
        </div>
      </template>
      <template v-else-if="!carregandoRota">
        <h1 class="sheet__title">Sem rota definida</h1>
        <p class="sheet__meta">A associação ainda não vinculou você a uma rota.</p>
      </template>

      <div v-if="carregando" class="sheet__action">
        <q-skeleton type="QBtn" class="full-width" height="56px" style="border-radius: 999px" />
      </div>
      <div v-else-if="confirmadoHoje" class="sheet__action done">
        <q-icon name="sym_r_check_circle" size="26px" />
        <span>Você está na lista de hoje.</span>
        <q-btn flat dense no-caps label="Desfazer" color="primary" :loading="enviando" @click="desfazer" />
      </div>
      <div v-else class="sheet__action">
        <SlideToConfirm
          ref="slider"
          label="Deslize para confirmar presença"
          :loading="enviando"
          @confirm="confirmar"
        />
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import SlideToConfirm from 'components/SlideToConfirm.vue';
import RouteMap from 'components/RouteMap.vue';
import { resumoDias, rodaHoje, type Rota } from 'src/utils/rotas';
import { iniciais as calcIniciais } from 'src/utils/format';

interface Aluno {
  nome: string;
  cpf: string;
}

const $q = useQuasar();
const aluno: Aluno | null = JSON.parse(localStorage.getItem('aluno') || 'null');

const primeiroNome = computed(() => aluno?.nome?.split(' ')[0] ?? 'estudante');
const iniciais = computed(() => calcIniciais(aluno?.nome));

// ---------- Rota ----------
const rota = ref<Rota | null>(null);
const carregandoRota = ref(true);

async function carregarRota() {
  try {
    rota.value = (await api.get('/rotas/minha')).data;
  } catch {
    rota.value = null;
  } finally {
    carregandoRota.value = false;
  }
}

// ---------- Presença ----------
const carregando = ref(true);
const enviando = ref(false);
const checkinEm = ref<Date | null>(null);
const slider = ref<InstanceType<typeof SlideToConfirm> | null>(null);

// O backend guarda só o último check-in, então "confirmado" só vale se foi hoje.
const confirmadoHoje = computed(() => {
  if (!checkinEm.value) return false;
  return checkinEm.value.toDateString() === new Date().toDateString();
});
const horaCheckin = computed(() =>
  checkinEm.value
    ? checkinEm.value.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : ''
);

async function carregarPresenca() {
  if (!aluno?.cpf) {
    carregando.value = false;
    return;
  }
  try {
    const { data } = await api.get(`/alunos/${aluno.cpf}`);
    const ts = data.checkinTime?._seconds;
    checkinEm.value = data.checkedIn && ts ? new Date(ts * 1000) : null;
  } catch {
    // Sem o status, o aluno ainda consegue confirmar; não vale bloquear a tela.
    checkinEm.value = null;
  } finally {
    carregando.value = false;
  }
}

async function confirmar() {
  if (!aluno?.cpf) return;
  enviando.value = true;
  try {
    await api.post('/checkin/checkin', { cpf: aluno.cpf });
    checkinEm.value = new Date();
    $q.notify({
      type: 'positive',
      icon: 'sym_r_check_circle',
      message: 'Presença confirmada',
      caption: rota.value ? `${rota.value.nome} · ${horaCheckin.value}` : horaCheckin.value,
    });
  } catch {
    slider.value?.reset();
    $q.notify({
      type: 'negative',
      icon: 'sym_r_wifi_off',
      message: 'Não foi possível confirmar agora',
      caption: 'Verifique sua conexão e deslize de novo.',
    });
  } finally {
    enviando.value = false;
  }
}

async function desfazer() {
  if (!aluno?.cpf) return;
  enviando.value = true;
  try {
    await api.post('/checkin/checkout', { cpf: aluno.cpf });
    checkinEm.value = null;
    $q.notify({ message: 'Presença desfeita', icon: 'sym_r_undo' });
  } catch {
    $q.notify({ type: 'negative', message: 'Não foi possível desfazer agora. Tente de novo.' });
  } finally {
    enviando.value = false;
  }
}

function fullHeight(offset: number, height: number) {
  return { height: `${height - offset}px` };
}

onMounted(() => {
  carregarRota();
  carregarPresenca();
});
</script>

<style scoped>
.home {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: #e8ebf4;
}

.home__map {
  flex: 1;
  min-height: 220px;
  z-index: 0;
}

.home__map--vazio {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 24px;
  color: var(--ob-muted);
}

.home__top {
  position: absolute;
  top: calc(12px + env(safe-area-inset-top, 0px));
  left: 14px;
  right: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: 2;
}

.greet {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 5px 16px 5px 5px;
  border-radius: 999px;
  background: var(--ob-surface);
  color: var(--ob-ink);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(18, 20, 42, 0.12);
}

.greet__avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--ob-blue-100);
  color: var(--ob-blue-700);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--ob-font-display);
  font-weight: 700;
  font-size: 12px;
}

.round-btn {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: var(--ob-surface);
  color: var(--ob-ink);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 14px rgba(18, 20, 42, 0.12);
}

.greet:focus-visible,
.round-btn:focus-visible {
  outline: 3px solid var(--ob-blue-200);
  outline-offset: 2px;
}

.sheet {
  position: relative;
  z-index: 1;
  margin-top: -24px;
  background: var(--ob-surface);
  border-radius: 26px 26px 0 0;
  padding: 10px 20px 20px;
  box-shadow: 0 -8px 24px rgba(18, 20, 42, 0.08);
}

.sheet__handle {
  width: 36px;
  height: 4px;
  border-radius: 4px;
  background: var(--ob-border);
  margin: 0 auto 16px;
}

.sheet__status {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.sheet__hint {
  font-size: 13px;
}

.sheet__title {
  font-size: 1.35rem;
  font-weight: 700;
  margin: 12px 0 8px;
}

.sheet__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  font-size: 13px;
  color: var(--ob-ink-2);
}

.sheet__meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.sheet__meta .q-icon {
  color: var(--ob-muted);
}

.sheet__action {
  margin-top: 20px;
}

.sheet__action.done {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 56px;
  padding: 0 8px 0 16px;
  border-radius: 999px;
  background: var(--ob-ok-bg);
  color: var(--ob-ok);
  font-weight: 600;
}

.sheet__action.done span {
  flex: 1;
  color: var(--ob-ink);
}
</style>
