<template>
  <q-page>
    <div class="page-container">
      <div class="back-button">
        <q-icon name="arrow_back" size="24px" @click="goBack" />
      </div>
      <div class="top-section">
        <div class="fingerprint">
          <img src="src/assets/Fingerprint-bro 2.png" alt="fingerprint" />
        </div>
      </div>
      <div class="input-container">
        <q-input
          filled
          v-model="email"
          label="Enter your e-mail..."
          class="email"
          rounded
        />
        <q-input
          filled
          v-model="password"
          label="Password"
          type="password"
          class="password"
          rounded
        />
      </div>
      <q-btn label="Login" class="entrar" @click="goToMainPage" />
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

    const goToMainPage = () => {
      // Adicione a lógica de autenticação aqui, se necessário
      router.push('/principal');
    };

    return {
      email,
      password,
      goToMainPage,
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
  justify-content: center;
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

.input-container {
  display: flex;
  flex-direction: column;
  width: 80%;
  max-width: 300px;
  margin-top: 20px;
  gap: 15px; /* Espaçamento entre os inputs */
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
  border-radius: 25px;
  height: 50px;
}

.entrar {
  background-color: #007bff;
  color: #ffffff;
  padding: 5px;
  width: 40%;
  max-width: 300px;
  margin-top: 30px;
  border-radius: 15px; /* Borda mais arredondada */
}

.back-button {
  position: absolute;
  top: 16px;
  left: 16px;
  cursor: pointer;
  z-index: 2;
}
</style>
