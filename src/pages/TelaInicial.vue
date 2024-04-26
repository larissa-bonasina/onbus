<template>
  <div class="page-container">
    <div class="logo-container">
      <img src="assets/logo.png" alt="App Logo" />
    </div>

    <div class="content-container">
      <div class="blue-square">
        <p class="square-text">Welcome to our App!</p>
        <p class="square-text">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
      </div>

      <div class="button-container">
        <q-btn label="Login" @click="login" />
        <q-btn label="Signup" @click="signup" />
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
  background-color: #f5f5f5;
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

.square-text {
  margin: 0;
  font-size: 16px;
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
