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
        <q-btn
          label="Verificar"
          class="verify-btn"
          @click="checkCode"
          :loading="loading"
        />
        <q-spinner v-if="loading" size="40px" color="primary" class="spinner" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const code = ref('');
    const loading = ref(false);

    const checkCode = async () => {
      loading.value = true;

      try {
        const response = await axios.post('http://localhost:3000/verify-code', {
          code: code.value,
        });

        if (response.data.valid) {
          alert('Código validado com sucesso!')
        } else {
          alert('Código inválido. Tente novamente.');
        }
      } catch (error) {
        console.error('Erro ao verificar o código:', error);
        alert('Erro ao verificar o código. Tente novamente mais tarde.');
      } finally {
        loading.value = false;
      }
    };

    return {
      code,
      loading,
      checkCode,
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
