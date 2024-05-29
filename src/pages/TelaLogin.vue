<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section>
        <div class="text-h6">Login</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="username" label="Username" />
        <q-input v-model="password" type="password" label="Password" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Login" color="primary" @click="handleLogin" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    handleLogin() {
      if (this.username && this.password) {
        this.$router.push('/');
      } else {
        this.$q.notify({
          type: 'negative',
          message: 'Por favor, preencha todos os campos',
        });
      }
    },
  },
};
</script>
