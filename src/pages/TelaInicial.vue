<template>
  <q-page>
    <div class="page-container">
      <!-- Logo e imagem do ônibus -->
      <div class="top-section">
        <div class="logo-container">
          <img src="src/assets/logo.png" alt="App Logo" />
        </div>
        <div class="bus-container">
          <img
            src="src/assets/freepik--Bus--inject-5.png"
            alt="Ônibus"
            style="object-fit: contain"
          />
        </div>
      </div>

      <!-- Seção azul com texto e botões -->
      <div class="blue-square">
        <div class="content-wrapper">
          <p class="square-text1">Bem-vindo!</p>
          <p class="square-text2">
            OnBus, o aplicativo de controle para universitários intermunicipais!
          </p>
        </div>

        <!-- Botões -->
        <div class="button-container">
          <div class="horizontal-buttons">
            <q-btn label="Login" class="login-btn" @click="goToLogin" />
            <q-btn label="Cadastro" class="signup-btn" @click="goToSignup" />
          </div>
          <q-btn
            label="Adm Associados"
            class="adm-btn"
            @click="goToValidaAdm"
          />
        </div>
      </div>
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

    const goToSignup = () => {
      router.push('/signup');
    };

    const goToValidaAdm = () => {
      router.push('/ValidaAdm');
    };

    return {
      goToLogin,
      goToSignup,
      goToValidaAdm,
    };
  },
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  background-color: #ffffff;
  padding: 5px 0;
}

.top-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2%;
}

.logo-container img {
  width: 30vw; 
  max-width: 150px;
  height: auto;
}

.bus-container img {
  width: 50vw;
  max-width: 250px;
  height: auto;
  margin-top: 10px;
}

.blue-square {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #1b24ff;
  padding: 10px 5%;
  height: auto;
  box-sizing: border-box;
  border-radius: 25px 25px 0 0;
  margin-top: 5px;
}

.content-wrapper {
  text-align: center;
  margin-bottom: 10px;
}

.square-text1 {
  font-size: clamp(1.3em, 2vw, 2em);
  color: #ffffff;
  margin: 5px 0;
}

.square-text2 {
  font-size: clamp(0.9em, 1.2vw, 1.1em);
  color: #f0f0f0;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 15px;
}

.horizontal-buttons {
  display: flex;
  gap: 10px;
  justify-content: center;
  width: 100%;
}

.login-btn,
.signup-btn,
.adm-btn {
  border-radius: 25px;
  padding: 12px 20px;
  font-size: clamp(1em, 1.2vw, 1.1em);
  max-width: 160px;
}

.login-btn {
  background-color: #1d1a1a;
  color: #fff;
}

.signup-btn {
  background-color: #ffffff;
  color: #1d1a1a;
  border: 2px solid #1d1a1a;
}

.adm-btn {
  background-color: #354aff;
  color: #ffffff;
  width: 80%;
  text-align: center;
}
</style>

