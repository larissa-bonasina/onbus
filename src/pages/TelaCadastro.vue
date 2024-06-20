<template>
  <q-page class="custom-page">
    <div class="page-container">
      <div class="back-button">
        <q-icon name="arrow_back" size="24px" @click="goBack" />
      </div>
      <div class="top-section">
        <div class="fingerprint">
          <img src="src/assets/Fingerprint-bro 2.png" alt="fingerprint" />
        </div>
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
          v-model="password"
          placeholder="Password"
          type="password"
          class="input-field"
          rounded
        />
        <q-input
          filled
          v-model="confirmPassword"
          placeholder="Confirm Password"
          type="password"
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
        <q-btn label="Signup" class="entrar" @click="goToLogin" />
      </div>
    </div>
  </q-page>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
  setup() {
    const router = useRouter();
    const email = ref('');
    const password = ref('');
    const confirmPassword = ref('');
    const firstName = ref('');
    const lastName = ref('');
    const phone = ref('');
    const address = ref('');
    const city = ref('');
    const state = ref('');
    const zip = ref('');

    const goToLogin = () => {
      router.push('/login');
    };

    const goBack = () => {
      router.go(-1);
    };

    return {
      email,
      password,
      confirmPassword,
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      zip,
      goToLogin,
      goBack,
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
}

.top-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0;
  padding-top: 10px;
}

.fingerprint {
  width: 50vw;
  max-width: 250px;
  height: auto;
  margin-top: 20px;
  margin-bottom: 50px;
}

.input-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 360px;
  margin-top: 20px;
}

.rectangle {
  margin-top: 0%;
  background-color: #354aff;
  width: 85%;
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
  height: 40px;
  margin-bottom: 10px;
  width: 80%;
  max-width: 300px;
  z-index: 1;
}

.input-field .q-field__control {
  height: 40px;
  line-height: 40px;
}

.entrar {
  background-color: #354aff;
  color: #ffffff;
  padding: 10px 20px;
  margin-top: 20px;
  border-radius: 25px;
}

.back-button {
  position: absolute;
  top: 16px;
  left: 16px;
  cursor: pointer;
  z-index: 2;
}
</style>
