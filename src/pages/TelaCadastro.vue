<template>
  <AuthScreen
    :eyebrow="`Etapa ${etapa} de 2`"
    :title="etapa === 1 ? 'Criar conta' : 'Endereço e acesso'"
    :subtitle="etapa === 1 ? 'Seus dados para a associação identificar você.' : 'Quase lá. Defina como você vai entrar no app.'"
  >
    <div class="steps" aria-hidden="true">
      <span class="steps__bar steps__bar--on" />
      <span class="steps__bar" :class="{ 'steps__bar--on': etapa === 2 }" />
    </div>

    <q-form v-if="etapa === 1" class="form" @submit.prevent="avancar">
      <q-input v-model="dados.nome" outlined label="Nome completo" autocomplete="name" :rules="[obrigatorio]" lazy-rules />
      <q-input
        v-model="dados.cpf"
        outlined
        label="CPF"
        inputmode="numeric"
        mask="###.###.###-##"
        unmasked-value
        :rules="[obrigatorio, (v) => cpfValido(v) || 'CPF inválido. Confira os números.']"
        lazy-rules
      />
      <q-input
        v-model="dados.numero"
        outlined
        type="tel"
        label="Telefone (WhatsApp)"
        autocomplete="tel-national"
        mask="(##) #####-####"
        unmasked-value
        :rules="[obrigatorio, (v) => soDigitos(v).length >= 10 || 'Telefone incompleto']"
        lazy-rules
      />
      <q-input v-model="dados.curso" outlined label="Curso" :rules="[obrigatorio]" lazy-rules />
      <q-btn unelevated no-caps type="submit" color="primary" label="Continuar" class="form__submit" />
    </q-form>

    <q-form v-else class="form" @submit.prevent="cadastrar">
      <q-input v-model="dados.rua" outlined label="Endereço" hint="Rua e número" autocomplete="address-line1" :rules="[obrigatorio]" lazy-rules />
      <div class="row-2">
        <q-input v-model="dados.cidade" outlined label="Cidade" autocomplete="address-level2" :rules="[obrigatorio]" lazy-rules />
        <q-select v-model="dados.uf" outlined label="UF" :options="UFS" class="row-2__uf" />
      </div>
      <q-input v-model="dados.email" outlined type="email" label="E-mail" autocomplete="email" inputmode="email" :rules="[obrigatorio, emailValido]" lazy-rules />
      <q-input
        v-model="dados.senha"
        outlined
        :type="mostrarSenha ? 'text' : 'password'"
        label="Senha"
        hint="Pelo menos 6 caracteres"
        autocomplete="new-password"
        :rules="[(v) => (v && v.length >= 6) || 'Use pelo menos 6 caracteres']"
        lazy-rules
      >
        <template #append>
          <q-btn
            flat round dense
            :icon="mostrarSenha ? 'sym_r_visibility_off' : 'sym_r_visibility'"
            :aria-label="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'"
            @click="mostrarSenha = !mostrarSenha"
          />
        </template>
      </q-input>

      <div v-if="erro" class="form__error" role="alert"><q-icon name="sym_r_error" size="20px" />{{ erro }}</div>

      <div class="form__actions">
        <q-btn flat no-caps label="Voltar" color="grey-8" @click="etapa = 1" />
        <q-btn unelevated no-caps type="submit" color="primary" label="Criar conta" class="form__submit form__submit--grow" :loading="enviando" />
      </div>
    </q-form>

    <template #footer>
      Já tem conta? <router-link to="/login" class="link">Entrar</router-link>
    </template>
  </AuthScreen>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
import AuthScreen from 'components/AuthScreen.vue';
import { cpfValido, soDigitos } from 'src/utils/format';

const UFS = ['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'];

const $q = useQuasar();
const router = useRouter();
const etapa = ref<1 | 2>(1);
const mostrarSenha = ref(false);
const enviando = ref(false);
const erro = ref('');

const dados = reactive({
  nome: '', cpf: '', numero: '', curso: '',
  rua: '', cidade: '', uf: 'MT', email: '', senha: '',
});

const obrigatorio = (v: string) => !!(v && String(v).trim()) || 'Campo obrigatório';
const emailValido = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'E-mail inválido';

function avancar() {
  erro.value = '';
  etapa.value = 2;
}

async function cadastrar() {
  erro.value = '';
  enviando.value = true;
  try {
    await api.post('/alunos/cadastro', {
      nome: dados.nome.trim(),
      cpf: soDigitos(dados.cpf),
      numero: soDigitos(dados.numero),
      curso: dados.curso.trim(),
      endereco: `${dados.rua.trim()}, ${dados.cidade.trim()}, ${dados.uf}`,
      email: dados.email.trim(),
      senha: dados.senha,
    });
    $q.notify({ type: 'positive', icon: 'sym_r_check_circle', message: 'Conta criada', caption: 'Agora é só entrar.' });
    router.push('/login');
  } catch (e: unknown) {
    const res = (e as { response?: { data?: unknown } }).response;
    const data = res?.data as { message?: string; errors?: { msg: string }[] } | string | undefined;
    if (typeof data === 'string' && data) erro.value = data;
    else if (data && typeof data === 'object') erro.value = data.errors?.[0]?.msg || data.message || '';
    if (!erro.value) erro.value = res ? 'Não foi possível criar a conta. Confira os dados.' : 'Sem conexão. Tente de novo em instantes.';
    if (/CPF/i.test(erro.value)) etapa.value = 1;
  } finally {
    enviando.value = false;
  }
}
</script>

<style scoped>
.steps {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin: -12px 0 24px;
}

.steps__bar {
  height: 4px;
  border-radius: 4px;
  background: var(--ob-subtle);
  transition: background-color 0.25s;
}

.steps__bar--on {
  background: var(--ob-blue-500);
}

.form {
  display: grid;
  gap: 6px;
}

.row-2 {
  display: grid;
  grid-template-columns: 1fr 96px;
  gap: 10px;
}

.form__error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--ob-bad-bg);
  color: var(--ob-bad);
  font-size: 14px;
  font-weight: 500;
}

.form__submit {
  height: 54px;
  font-size: 16px;
  margin-top: 6px;
}

.form__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.form__submit--grow {
  flex: 1;
}

.link {
  color: var(--ob-blue-600);
  font-weight: 700;
  text-decoration: none;
}
</style>
