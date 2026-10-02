<template>
  <q-page class="page">
    <h1 class="ob-title">Perfil</h1>

    <section class="who ob-card">
      <span class="who__avatar">{{ iniciais(perfil.nome) }}</span>
      <div class="who__text">
        <strong>{{ perfil.nome || 'Estudante' }}</strong>
        <span class="ob-muted">{{ perfil.curso || perfil.email }}</span>
      </div>
    </section>

    <section v-if="!editando" class="ob-card info">
      <div class="info__head">
        <h2>Meus dados</h2>
        <q-btn flat dense no-caps color="primary" icon="sym_r_edit" label="Editar" @click="abrirEdicao" />
      </div>
      <dl>
        <div><dt>E-mail</dt><dd>{{ perfil.email || '—' }}</dd></div>
        <div><dt>Telefone</dt><dd>{{ formatarTelefone(perfil.numero) || '—' }}</dd></div>
        <div><dt>CPF</dt><dd>{{ formatarCpf(perfil.cpf) || '—' }}</dd></div>
        <div><dt>Curso</dt><dd>{{ perfil.curso || '—' }}</dd></div>
        <div><dt>Endereço</dt><dd>{{ perfil.endereco || '—' }}</dd></div>
      </dl>
    </section>

    <q-form v-else class="ob-card info form" @submit.prevent="salvar">
      <h2>Editar dados</h2>
      <q-input v-model="form.nome" outlined label="Nome completo" :rules="[obrigatorio]" lazy-rules />
      <q-input v-model="form.email" outlined type="email" label="E-mail" :rules="[obrigatorio, emailValido]" lazy-rules />
      <q-input
        v-model="form.numero"
        outlined
        type="tel"
        label="Telefone"
        mask="(##) #####-####"
        unmasked-value
        :rules="[obrigatorio]"
        lazy-rules
      />
      <q-input v-model="form.curso" outlined label="Curso" :rules="[obrigatorio]" lazy-rules />
      <q-input v-model="form.endereco" outlined label="Endereço" :rules="[obrigatorio]" lazy-rules />
      <p class="ob-muted form__note">O CPF não pode ser alterado.</p>
      <div class="form__actions">
        <q-btn flat no-caps label="Cancelar" color="grey-8" @click="editando = false" />
        <q-btn unelevated no-caps type="submit" color="primary" label="Salvar" :loading="salvando" />
      </div>
    </q-form>

    <nav class="ob-card links">
      <router-link to="/prestacao" class="link">
        <q-icon name="sym_r_account_balance" size="22px" />
        <span>Prestação de contas da associação</span>
        <q-icon name="sym_r_chevron_right" size="20px" class="link__go" />
      </router-link>
      <button type="button" class="link link--danger" @click="sair">
        <q-icon name="sym_r_logout" size="22px" />
        <span>Sair da conta</span>
      </button>
    </nav>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import { logout } from 'src/utils/auth';
import { formatarCpf, formatarTelefone, iniciais } from 'src/utils/format';

interface Perfil {
  nome: string;
  email: string;
  cpf: string;
  numero: string;
  curso: string;
  endereco: string;
}

const $q = useQuasar();
const router = useRouter();

const perfil = reactive<Perfil>({
  nome: '', email: '', cpf: '', numero: '', curso: '', endereco: '',
  ...JSON.parse(localStorage.getItem('aluno') || '{}'),
});
const form = reactive<Omit<Perfil, 'cpf'>>({ nome: '', email: '', numero: '', curso: '', endereco: '' });
const editando = ref(false);
const salvando = ref(false);

const obrigatorio = (v: string) => !!(v && v.trim()) || 'Campo obrigatório';
const emailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'E-mail inválido';

async function carregar() {
  if (!perfil.cpf) return;
  try {
    const { data } = await api.get(`/alunos/${perfil.cpf}`);
    Object.assign(perfil, {
      nome: data.nome ?? '', email: data.email ?? '', numero: data.numero ?? '',
      curso: data.curso ?? '', endereco: data.endereco ?? '',
    });
  } catch {
    // Fica com os dados do login; a tela continua utilizável.
  }
}

function abrirEdicao() {
  Object.assign(form, {
    nome: perfil.nome, email: perfil.email, numero: perfil.numero,
    curso: perfil.curso, endereco: perfil.endereco,
  });
  editando.value = true;
}

async function salvar() {
  salvando.value = true;
  try {
    await api.put(`/alunos/${perfil.cpf}`, { ...form });
    Object.assign(perfil, form);
    const salvo = JSON.parse(localStorage.getItem('aluno') || '{}');
    localStorage.setItem('aluno', JSON.stringify({ ...salvo, nome: form.nome, email: form.email, numero: form.numero }));
    editando.value = false;
    $q.notify({ type: 'positive', icon: 'sym_r_check_circle', message: 'Dados atualizados' });
  } catch (e: unknown) {
    const msg = (e as { response?: { data?: { message?: string } } }).response?.data?.message;
    $q.notify({ type: 'negative', message: msg || 'Não foi possível salvar agora. Tente de novo.' });
  } finally {
    salvando.value = false;
  }
}

function sair() {
  $q.dialog({
    title: 'Sair da conta?',
    message: 'Você vai precisar entrar de novo para confirmar presença.',
    cancel: { label: 'Cancelar', flat: true, noCaps: true, color: 'grey-8' },
    ok: { label: 'Sair', unelevated: true, noCaps: true, color: 'negative' },
  }).onOk(() => {
    logout();
    router.push('/login');
  });
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
  gap: 16px;
}

.who {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
}

.who__avatar {
  width: 56px;
  height: 56px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--ob-blue-500);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--ob-font-display);
  font-weight: 700;
  font-size: 20px;
}

.who__text {
  display: grid;
  min-width: 0;
}

.who__text strong {
  font-family: var(--ob-font-display);
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.info {
  padding: 18px 18px 8px;
}

.info h2 {
  font-size: 1.05rem;
  font-weight: 600;
}

.info__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

dl {
  margin: 0;
}

dl > div {
  display: grid;
  gap: 2px;
  padding: 12px 0;
  border-top: 1px solid var(--ob-subtle);
}

dt {
  font-size: 12px;
  font-weight: 600;
  color: var(--ob-muted);
}

dd {
  margin: 0;
  font-size: 15px;
  overflow-wrap: anywhere;
}

.form {
  display: grid;
  gap: 4px;
  padding-bottom: 18px;
}

.form h2 {
  margin-bottom: 12px;
}

.form__note {
  font-size: 13px;
  margin: 0 0 8px;
}

.form__actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.links {
  display: grid;
  padding: 6px;
}

.link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 12px;
  border: 0;
  border-radius: 14px;
  background: transparent;
  color: var(--ob-ink);
  font: inherit;
  font-weight: 600;
  font-size: 15px;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}

.link:hover {
  background: var(--ob-bg);
}

.link:focus-visible {
  outline: 2px solid var(--ob-blue-500);
}

.link .q-icon {
  color: var(--ob-muted);
}

.link span {
  flex: 1;
}

.link--danger,
.link--danger .q-icon {
  color: var(--ob-bad);
}
</style>
