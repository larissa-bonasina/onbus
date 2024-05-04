<template>
  <div class="page-container">
    <div class="content-container">
      <div class="logo-container">
        <img
          src="src/assets/logo.png"
          alt="App Logo"
          style="width: 250px; height: auto"
        />
        <img
          src="src/assets/freepik--Bus--inject-5.png"
          alt="onibus"
          style="width: 150px; height: auto"
        />
      </div>

      <div class="blue-square">
        <p class="square-text1">Bem vindo!</p>
        <p class="square-text2">
          OnBus, o aplicativo de controle para universitários intermuniscipais!
        </p>
        <div class="button-container">
          <q-btn label="Login" class="login-btn" @click="login" />
          <q-btn label="Signup" class="signup-btn" @click="signup" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      // Implemente aqui a lógica de signup
      console.log('Botão de signup clicado');
    },
    signup() {
      // Implemente aqui a lógica de signup
      console.log('Botão de signup clicado');
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
  background-color: #ffffff;
}

.logo-container {
  margin-top: 50px;
}

.logo-container img {
  width: 200px;
  height: auto;
}

.content-container {
  text-align: center;
}

.blue-square {
  width: 100%;
  height: 200%;
  background-color: #1b24ff;
  padding: 20px;
}

.square-text2 {
  margin: 0;
  font-size: 18px;
  line-height: 1.5;
  color: #ffffff;
  font-family: sans-serif;
  text-align: left;
  margin-left: 30px;
}

.square-text1 {
  margin: 0;
  font-size: 30px;
  line-height: 1.5;
  color: #ffffff;
  font-family: sans-serif;
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.login-btn {
  margin-right: 10px;
  background-color: #1d1a1a;
  color: #fff;
  border-radius: 25px;
  padding: 15px 30px;
}

.signup-btn {
  background-color: #ffffff;
  color: #1d1a1a;
  border-radius: 25px;
  padding: 15px 20px;
}
</style>
