<template>
  <q-page class="flex flex-center">
    <q-card>
      <q-card-section>
        <div class="text-h6">Signup</div>
      </q-card-section>

      <q-card-section>
        <q-input v-model="username" label="Username" />
        <q-input v-model="password" type="password" label="Password" />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="Signup" color="primary" @click="handleSignup" />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: ''
    };
  },
  methods: {
    handleSignup() {
      if (this.username && this.password) {
        this.$router.push('/');
      } else {
        this.$q.notify({
          type: 'negative',
          message: 'Por favor, preencha todos os campos'
        });
      }
    }
  }
};
</script>
