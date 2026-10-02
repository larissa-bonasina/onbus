<template>
  <AuthScreen title="Entrar" subtitle="Use o e-mail e a senha da sua conta OnBus." back-to="/">
    <q-form class="form" @submit.prevent="entrar">
      <q-input
        v-model="email"
        outlined
        type="email"
        label="E-mail"
        autocomplete="email"
        inputmode="email"
        :rules="[(v) => !!v || 'Informe seu e-mail']"
        lazy-rules
      />
      <q-input
        v-model="senha"
        outlined
        :type="mostrarSenha ? 'text' : 'password'"
        label="Senha"
        autocomplete="current-password"
        :rules="[(v) => !!v || 'Informe sua senha']"
        lazy-rules
      >
        <template #append>
          <q-btn
            flat
            round
            dense
            :icon="mostrarSenha ? 'sym_r_visibility_off' : 'sym_r_visibility'"
            :aria-label="mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'"
            @click="mostrarSenha = !mostrarSenha"
          />
        </template>
      </q-input>

      <div v-if="erro" class="form__error" role="alert">
        <q-icon name="sym_r_error" size="20px" />{{ erro }}
      </div>

      <q-btn unelevated no-caps type="submit" color="primary" label="Entrar" class="form__submit" :loading="enviando" />
    </q-form>

    <template #footer>
      Ainda não tem conta? <router-link to="/signup" class="link">Criar conta</router-link>
    </template>
  </AuthScreen>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from 'boot/axios';
import AuthScreen from 'components/AuthScreen.vue';

const router = useRouter();
const email = ref('');
const senha = ref('');
const mostrarSenha = ref(false);
const enviando = ref(false);
const erro = ref('');

async function entrar() {
  erro.value = '';
  enviando.value = true;
  try {
    const { data } = await api.post('/alunos/login', { email: email.value.trim(), senha: senha.value });
    localStorage.setItem('token', data.token);
    localStorage.setItem('aluno', JSON.stringify(data.aluno));
    router.push('/principal');
  } catch (e: unknown) {
    const status = (e as { response?: { status?: number } }).response?.status;
    if (status === 401 || status === 400) erro.value = 'E-mail ou senha incorretos.';
    else if (status === 429) erro.value = 'Muitas tentativas. Aguarde alguns minutos e tente de novo.';
    else erro.value = 'Não foi possível entrar agora. Verifique sua conexão.';
  } finally {
    enviando.value = false;
  }
}
</script>

<style scoped>
.form {
  display: grid;
  gap: 6px;
}

.form__error {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  margin-bottom: 6px;
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

.link {
  color: var(--ob-blue-600);
  font-weight: 700;
  text-decoration: none;
}
</style>
