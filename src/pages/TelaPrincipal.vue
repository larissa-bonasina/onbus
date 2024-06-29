<template>
  <div class="header">
    <q-icon name="account_circle" size="50px" class="profile-icon" />
    <a href="/perfil" class="username-link">Perfil do estudante</a>
  </div>
  <div class="index-page">
    <!-- Barra de navegação -->
    <div class="nav-toggle" @click="toggleNav">
      <q-icon name="menu" size="24px" />
    </div>
    <div
      class="nav-backdrop"
      :class="{ 'nav-backdrop-open': isNavOpen }"
      @click="toggleNav"
    ></div>
    <div class="nav-bar" :class="{ 'nav-bar-open': isNavOpen }">
      <div class="nav-buttons">
        <q-btn
          v-for="button in navButtons"
          :key="button.id"
          :label="button.label"
          class="nav-button"
        />
      </div>
    </div>

    <!-- Conteúdo principal -->
    <div class="content-container">
      <div class="status-container">
        <div class="status-label">STATUS:</div>
        <div class="status-text">{{ attendanceStatus }}</div>
      </div>
      <div class="embarque-container">
        <div class="embarque-label">EMBARQUE:</div>
        <div class="embarque-text">{{ status }}</div>
      </div>
      <div
        class="slider-container"
        @mousedown="startDrag"
        @mousemove="drag"
        @mouseup="stopDrag"
        @mouseleave="stopDrag"
      >
        <q-btn
          class="slide-button"
          :style="buttonStyle"
          unelevated
          @click="onButtonClick"
          ref="button"
        >
          {{ status }}
        </q-btn>
      </div>
      <div class="status-buttons">
        <q-btn
          v-if="status === 'INDEFINIDO' || status === 'CHECK OUT'"
          class="comparecer-button"
          unelevated
          @click="doCheckin"
        >
          IREI COMPARECER
        </q-btn>
        <q-btn
          v-if="status === 'INDEFINIDO' || status === 'CHECK IN'"
          class="nao-comparecer-button"
          outlined
          @click="doCheckout"
        >
          NÃO IREI COMPARECER
        </q-btn>
      </div>
      <a class="contact-link" href="https://wa.me/" target="_blank"
        >ENTRAR EM CONTATO COM A ASSOCIAÇÃO</a
      >
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Importar axios ou outro cliente HTTP que você esteja utilizando

export default {
  name: 'IndexPage',
  data() {
    return {
      isDragging: false,
      initialX: 0,
      offsetX: 0,
      buttonWidth: 40,
      containerWidth: 200,
      status: 'INDEFINIDO',
      attendanceStatus: 'INDEFINIDO',
      isNavOpen: false,
      navButtons: [
        { id: 1, label: 'Barra de funcionalidades' },
        { id: 2, label: 'Boletos e pagamentos' },
        { id: 3, label: 'Regras da associação' },
        { id: 4, label: 'Button 4' },
        { id: 5, label: 'Button 5' },
        { id: 6, label: 'Button 6' },
        { id: 7, label: 'Button 7' },
        { id: 8, label: 'Button 8' },
        { id: 9, label: 'Meu perfil' },
        { id: 10, label: 'Button 10' },
      ],
    };
  },
  methods: {
    onButtonClick() {
      if (this.status === 'CHECK IN') {
        this.status = 'CHECK OUT';
        this.offsetX = 0;
      } else if (this.status === 'CHECK OUT') {
        this.status = 'INDEFINIDO';
        this.offsetX = this.containerWidth / 2 - this.buttonWidth / 2;
      } else {
        this.status = 'CHECK IN';
        this.offsetX = this.containerWidth - this.buttonWidth;
      }
    },

    setAttendanceStatus(status) {
      this.attendanceStatus = status;
    },
    startDrag(event) {
      this.isDragging = true;
      this.initialX = event.clientX - this.offsetX;
    },
    stopDrag() {
      this.isDragging = false;
    },
    drag(event) {
      if (this.isDragging) {
        const newX = event.clientX;
        const newOffsetX = newX - this.initialX;
        if (
          newOffsetX >= 0 &&
          newOffsetX <= this.containerWidth - this.buttonWidth
        ) {
          this.offsetX = newOffsetX;
        }
      }
    },
    toggleNav() {
      this.isNavOpen = !this.isNavOpen;
    },
    async doCheckin() {
      try {
        const response = await axios.post('/api/auth/checkin', {
          cpf: '12345678900', // Substitua pelo CPF real
          status: 'CHECK IN',
        });
        console.log('Check-in realizado com sucesso:', response.data);
        // Atualizar interface ou qualquer outra lógica necessária após o check-in
      } catch (error) {
        console.error('Erro ao realizar check-in:', error);
        // Tratar erros ou feedback para o usuário
      }
    },
    async doCheckout() {
      try {
        const response = await axios.post('/api/auth/checkout', {
          checkinId: 'checkinId_aqui', // Substitua pelo ID real do check-in
        });
        console.log('Check-out realizado com sucesso:', response.data);
        // Atualizar interface ou qualquer outra lógica necessária após o check-out
      } catch (error) {
        console.error('Erro ao realizar check-out:', error);
        // Tratar erros ou feedback para o usuário
      }
    },
  },
  computed: {
    buttonStyle() {
      return {
        transform: `translateX(${this.offsetX}px)`,
        boxShadow: '0px 0px 0px 8px rgba(49, 57, 233, 0.1)',
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.index-page {
  background-color: #e6e4f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  padding-top: 20px;
}

.header {
  color: black;
}

.nav-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  cursor: pointer;
  z-index: 999;
}

.nav-bar {
  position: fixed;
  top: 0;
  right: 0;
  width: 250px;
  height: 100vh;
  background-color: rgba(49, 57, 233, 0.85);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.nav-bar-open {
  transform: translateX(0);
}

.nav-buttons {
  padding-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-button {
  margin-bottom: 10px;
  width: 200px;
  color: #ffffff;
  font-size: 15px;
  font-weight: normal;
  display: flex;
  justify-content: center;
  align-items: center;
}

.status-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.status-label {
  font-weight: normal;
  margin-right: 10px;
}

.status-text {
  font-weight: normal;
}

.embarque-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.embarque-label {
  font-weight: normal;
  margin-right: 10px;
}

.embarque-text {
  font-weight: normal;
}

.slider-container {
  position: relative;
  width: 200px;
  height: 40px;
  background-color: rgba(49, 57, 233, 0.1);
  border-radius: 30px;
  display: flex;
  align-items: center;
  padding: 0 10px;
  cursor: pointer;
  font-weight: normal;
  margin-bottom: 20px;
}

.slide-button {
  background-color: royalblue;
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  transition: transform 0.3s ease-in-out, background-color 0.3s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: normal;
}

.status-buttons {
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
}

.comparecer-button {
  background-color: rgba(53, 74, 255, 0.7);
  color: #ffffff;
  border: 1px solid #354aff;
  border-radius: 13px;
  width: 262px;
  height: 43px;
  margin-bottom: 10px;
  font-weight: normal;
}

.nao-comparecer-button {
  color: black;
  border-radius: 13px;
  font-weight: normal;
}

.contact-link {
  color: #555454;
  text-decoration: underline;
  margin-top: 20px;
  font-weight: normal;
  font-size: 10px;
  display: flex;
  justify-content: center;
}
</style>
