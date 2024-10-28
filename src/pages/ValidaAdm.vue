<template>
  <q-page class="custom-page">
    <div class="page-container">
      <div class="back-button">
        <q-icon name="arrow_back" size="24px" @click="goBack" />
      </div>
      <div class="input-container">
        <div class="rectangle"></div>
        <q-input
          filled
          v-model="email"
          placeholder="Enter your e-mail..."
          class="input-field"
          rounded
        />
        <q-input
          filled
          v-model="firstName"
          placeholder="First Name"
          class="input-field"
          rounded
        />
        <q-input
          filled
          v-model="lastName"
          placeholder="Last Name"
          class="input-field"
          rounded
        />
        <q-input
          filled
          v-model="phone"
          placeholder="Phone Number"
          class="input-field"
          rounded
        />
        <q-input
          filled
          v-model="address"
          placeholder="Address"
          class="input-field"
          rounded
        />
        <q-input
          filled
          v-model="city"
          placeholder="City"
          class="input-field"
          rounded
        />
        <q-input
          filled
          v-model="state"
          placeholder="State"
          class="input-field"
          rounded
        />
        <q-input
          filled
          v-model="zip"
          placeholder="Zip Code"
          class="input-field"
          rounded
        />
        <q-btn
          label="Validate Profile"
          class="entrar"
          @click="validateProfile"
        />
      </div>
    </div>
  </q-page>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const router = useRouter();
    const email = ref('');
    const firstName = ref('');
    const lastName = ref('');
    const phone = ref('');
    const address = ref('');
    const city = ref('');
    const state = ref('');
    const zip = ref('');
    const loading = ref(false);
    const generatedCode = ref('');

    const goBack = () => {
      router.go(-1);
    };

    const generateCode = () => {
      return Math.floor(1000 + Math.random() * 9000).toString();
    };

    const validateProfile = async () => {
      loading.value = true;
      generatedCode.value = generateCode();

      try {
        await axios.post('http://localhost:3000/send-code', {
          email: 'gab541341@gmail.com',
          code: generatedCode.value,
          studentEmail: email.value,
          firstName: firstName.value,
          lastName: lastName.value,
          phone: phone.value,
          address: address.value,
          city: city.value,
          state: state.value,
          zip: zip.value,
        });

        router.push('/ValidaTela');
      } catch (error) {
        console.error('Erro ao enviar o código:', error);
      } finally {
        loading.value = false;
      }
    };

    return {
      email,
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      zip,
      goBack,
      validateProfile,
      loading,
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
  max-width: 600px;
  margin-top: 20px;
}

.rectangle {
  margin-top: 0%;
  background-color: #354aff;
  width: 100%;
  height: 600px;
  border-radius: 48px;
  position: absolute;
  top: -30px;
  z-index: 0;
}

.input-field {
  background-color: #ffffff;
  color: #3a3a3a;
  border-radius: 25px;
  height: 50px;
  margin-bottom: 10px;
  width: 90%;
  max-width: 400px;
  z-index: 1;
}

.entrar {
  background-color: #354aff;
  color: #ffffff;
  padding: 12px 24px;
  margin-top: 20px;
  border-radius: 25px;
  width: 90%;
  max-width: 400px;
}

.back-button {
  position: absolute;
  top: 16px;
  left: 16px;
  cursor: pointer;
  z-index: 2;
}
</style>
