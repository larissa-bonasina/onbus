<template>
  <div class="page-container">
    <div class="content-container">
      <div class="login-form">
        <h2>Login</h2>
        <q-input filled v-model="email" label="Email" />
        <q-input filled v-model="password" label="Password" type="password" />
        <q-btn label="Login" @click="login" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    login() {
      // Implemente aqui a lógica de login
      console.log('Botão de login clicado');
      console.log('Email:', this.email);
      console.log('Password:', this.password);
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

.content-container {
  text-align: center;
}

.login-form {
  width: 300px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
}
</style>
