<template>
  <q-page style="overflow-y: auto; max-height: 100vh">
    <div class="page-container">
      <div class="back-button">
        <q-icon name="arrow_back" size="24px" @click="goBack" />
      </div>
      <div class="top-section">
        <div class="fingerprint">
          <img src="src/assets/Fingerprint-bro 2.png" alt="fingerprint" />
        </div>
      </div>
      <div class="button-container">
        <q-btn label="Enter your e-mail..." class="email" />
        <q-btn label="Password" class="password" />
        <q-btn label="Password" class="password" />
        <q-btn label="Password" class="password" />
        <q-btn label="Password" class="password" />
        <q-btn label="Password" class="password" />
        <q-btn label="Password" class="password" />
        <q-btn label="Password" class="password" />
        <q-btn label="Password" class="password" />
        <q-btn label="Password" class="password" />
      </div>
      <q-btn label="Login" class="entrar" @click="goToLogin" />
    </div>
  </q-page>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();

    const goToLogin = () => {
      router.push('/login');
    };

    return {
      goToLogin,
    };
  },
  methods: {
    goBack() {
      // Lógica para voltar para a página anterior
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; /* Ajuste para centralizar os botões verticalmente */
  height: 100vh;
  background-color: rgba(230, 228, 245, 1);
  text-align: center;
}

.top-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.fingerprint {
  width: 50vw;
  max-width: 250px;
  height: auto;
  margin-bottom: 50px;
}

.button-container {
  display: flex;
  flex-direction: column;
  width: 80%; /* Ajuste para uma largura adequada */
  max-width: 300px; /* Ajuste para uma largura máxima */
  margin-top: 20px;
}

.q-btn {
  margin-bottom: 10px;
  width: 100%;
  border-radius: 30px;
}

.email,
.password {
  background-color: #ffffff;
  color: #1d1a1a;
}

.entrar {
  background-color: #007bff;
  color: #ffffff;
  padding: 5px;
  width: 40%; /* Ajuste para uma largura adequada */
  max-width: 300px;
  margin-top: 30px;
}

.back-button {
  position: absolute;
  top: 16px;
  left: 16px;
  cursor: pointer;
  z-index: 2;
}
</style>
