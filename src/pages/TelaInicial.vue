<template>
  <q-page>
    <div class="page-container">
      <div class="top-section">
        <div class="logo-container">
          <img src="src/assets/logo.png" alt="App Logo" />
        </div>
        <div class="bus-container">
          <img
            src="src/assets/freepik--Bus--inject-5.png"
            alt="onibus"
            style="height: 90%; width: 100%; border-top: 10px"
          />
        </div>
      </div>
      <div class="blue-square">
        <div class="content-wrapper">
          <p class="square-text1">Bem vindo!</p>
          <p class="square-text2">
            OnBus, o aplicativo de controle para universitários intermunicipais!
          </p>
        </div>
        <div class="button-container">
          <q-btn label="Login" class="login-btn" @click="goToLogin" />
          <q-btn label="Signup" class="signup-btn" @click="goToSignup" />
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

    return {
      goToLogin,
      goToSignup,
    };
  },
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  height: 100vh;
  background-color: #ffffff;
  text-align: center;
}

.top-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.logo-container img {
  width: 50vw;
  max-width: 250px;
  height: auto;
}

.bus-container img {
  width: 30vw;
  max-width: 200px;
  height: auto;
  margin-top: 20px;
}

.blue-square {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 100%;
  background-color: #1b24ff;
  padding: 20px;
  height: 40vh;
  box-sizing: border-box;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.square-text1 {
  margin: 0;
  font-size: 2em;
  color: #ffffff;
  font-family: sans-serif;
}

.square-text2 {
  margin-top: 10px;
  font-size: 1.2em;
  color: #f0f0f0;
  font-family: sans-serif;
  text-align: left;
}

.button-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
}

.login-btn,
.signup-btn {
  margin: 0 10px;
  border-radius: 25px;
  padding: 15px 30px;
  font-size: 1em;
}

.login-btn {
  background-color: #1d1a1a;
  color: #fff;
}

.signup-btn {
  background-color: #ffffff;
  color: #1d1a1a;
}
</style>
