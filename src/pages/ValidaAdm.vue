<template>
  <q-page class="custom-page">
    <div class="page-container">
      <div class="back-button">
        <q-icon name="arrow_back" size="24px" @click="goBack" />
      </div>
      <div class="input-container">
        <div class="rectangle"></div>
        <q-input
          filled
          v-model="email"
          placeholder="E-mail"
          class="input-field"
          rounded
        />
        <q-input
          filled
          v-model="password"
          type="password"
          placeholder="Senha"
          class="input-field"
          rounded
        />
        <q-btn label="Login" class="entrar" @click="login" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');

    const goBack = () => {
      router.go(-1);
    };

    const login = async () => {
      try {
        const response = await fetch('http://localhost:3000/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email.value,  // Envia o email para o back-end
            password: password.value, // Envia a senha para o back-end
          }),
        });

        if (!response.ok) throw new Error('Login falhou');

        const { token } = await response.json();
        localStorage.setItem('adminToken', token); // Armazena o token localmente
        router.push({ path: '/TelaAdm' });
      } catch (error) {
        alert('Login falhou: ' + error.message);
      }
    };

    return {
      email,
      password,
      goBack,
      login,
    };
  },
};
</script>

<style scoped>
.custom-page {
  background-color: rgba(230, 228, 245, 1);
  min-height: 100vh;
}

.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 40px;
}

.input-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
}

.rectangle {
  margin-top: 0%;
  background-color: #354aff;
  width: 100%;
  height: 600px;
  border-radius: 48px;
  position: absolute;
  top: -30px;
  z-index: 0;
}

.input-field {
  background-color: #ffffff;
  color: #3a3a3a;
  border-radius: 25px;
  height: 50px;
  margin-bottom: 10px;
  width: 90%;
  max-width: 400px;
  z-index: 1;
}

.entrar {
  background-color: #354aff;
  color: #ffffff;
  padding: 12px 24px;
  margin-top: 20px;
  border-radius: 25px;
  width: 90%;
  max-width: 400px;
}

.back-button {
  position: absolute;
  top: 16px;
  left: 16px;
  cursor: pointer;
  z-index: 2;
}
</style>
