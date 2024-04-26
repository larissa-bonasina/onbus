<template>
  <div class="page-container">
    <div class="logo-container">
      <img src="src/assets/logo.png" alt="App Logo" />
    </div>

    <div class="content-container">
      <div class="blue-square">
        <p class="square-text1">Bem vindo!</p>
        <p class="square-text2">
          OnBus, o aplicativo de controle para universitários intermuniscipais!
        </p>
        <div class="button-container">
          <q-btn label="Login" @click="login" />
          <q-btn label="Signup" @click="signup" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    login() {
      // Implement login logic here
      console.log('Login button clicked');
    },
    signup() {
      // Implement signup logic here
      console.log('Signup button clicked');
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
  margin-bottom: 40px;
}

.logo-container img {
  width: 200px;
  height: auto;
}

.content-container {
  text-align: center;
}

.blue-square {
  width: 300px;
  height: 150px;
  background-color: #007bff;
  padding: 20px;
  color: white;
  margin-bottom: 20px;
}

.square-text2 {
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
}

.square-text1 {
  margin: 0;
  font-size: 30px;
  line-height: 1.5;
}

.button-container {
  display: flex;
  justify-content: space-between;
  width: 300px;
  margin: 0 auto;
}

q-btn {
  margin: 0 10px;
}
</style>
