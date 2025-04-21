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
}

.top-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-top: 40px;
  padding-bottom: 20px;
  position: relative; /* Para permitir o posicionamento absoluto do ônibus */
}

.logo-container img {
  width: 50vw;
  max-width: 350px;
  height: auto;
  margin-top: 200px;
}

.bus-container {
  position: absolute;
  top: 515px; /* Ajusta a posição do ônibus acima */
  right: 5%;  /* Ajusta a posição do ônibus no lado direito */
  z-index: 1; /* Garante que o ônibus fique acima do container azul */
}

.bus-container img {
  width: 40vw;  /* Ajuste o tamanho do ônibus conforme necessário */
  max-width: 200px; /* Define um limite de tamanho máximo */
  height: auto;
}

.blue-square {
  background-color: #1b24ff;
  padding: 25px 5% 30px 5%;
  border-radius: 25px 25px 0 0;
  box-sizing: border-box;
  color: white;
  width: 100%;
}

.content-wrapper {
  text-align: center;
  margin-bottom: 15px;
}

.square-text1 {
  font-size: clamp(1.5em, 2.5vw, 2.2em);
  margin: 5px 0;
  color: #ffffff;
}

.square-text2 {
  font-size: clamp(1em, 1.5vw, 1.3em);
  color: #f0f0f0;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 15px;
  margin-top: 20px;
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
}

.adm-btn {
  background-color: #354aff;
  color: #ffffff;
  width: 80%;
  text-align: center;
}

</style>
