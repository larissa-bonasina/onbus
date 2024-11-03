<template>
  <q-page class="custom-page">
    <div class="page-container">
      <h2>Insira seu Código</h2>
      <div class="input-container">
        <div class="background-square"></div>
        <q-input
          filled
          v-model="code"
          placeholder="Código de validação"
          class="input-field"
          rounded
        />
        <q-btn label="Verificar" class="verify-btn" @click="goToAdmScreen" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const code = ref('');

    const goToAdmScreen = () => {
      router.push({ path: '/TelaAdm' });
    };

    return {
      code,
      goToAdmScreen,
    };
  },
};
</script>

<style scoped>
.custom-page {
  background-color: rgba(230, 228, 245, 1);
  min-height: 100vh;
}

.page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
  padding: 40px;
}

.input-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 400px;
  margin-top: 20px;
}

.background-square {
  position: absolute;
  background-color: white;
  width: 50%;
  height: 50px;
  border-radius: 15px;
  z-index: 0;
}

.input-field {
  margin-bottom: 20px;
  position: relative;
  z-index: 1;
}

.verify-btn {
  background-color: #354aff;
  color: #ffffff;
}
</style>
