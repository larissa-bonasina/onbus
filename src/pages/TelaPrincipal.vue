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
      <div class="maps-container">
        <GoogleMap
          api-key="YOUR_GOOGLE_MAPS_API_KEY"
          style="width: 100%; height: 500px"
          :center="center"
          :zoom="15"
        >
          <CustomMarker :options="{ position: center }" />
        </GoogleMap>
      </div>

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
        ref="sliderContainer"
      >
        <q-btn
          class="slide-button"
          :style="buttonStyle"
          unelevated
          @click="onButtonClick"
          ref="button"
        >
          IN
        </q-btn>
      </div>
      <div class="status-buttons">
        <q-btn
          class="comparecer-button"
          unelevated
          @click="setAttendanceStatus('IREI COMPARECER')"
          >IREI COMPARECER</q-btn
        >
        <q-btn
          class="nao-comparecer-button"
          outlined
          @click="setAttendanceStatus('NÃO IREI COMPARECER')"
          >NÃO IREI COMPARECER</q-btn
        >
      </div>
      <a class="contact-link" href="https://wa.me/" target="_blank"
        >ENTRAR EM CONTATO COM A ASSOCIAÇÃO</a
      >
    </div>
  </div>
</template>

<script>
import { GoogleMap, CustomMarker } from 'vue3-google-map';

export default {
  name: 'IndexPage',
  components: {
    GoogleMap,
    CustomMarker,
  },

  data() {
    return {
      isNavOpen: false,
      navButtons: [
        { id: 1, label: 'Button 1' },
        { id: 2, label: 'Button 2' },
        { id: 3, label: 'Button 3' },
        { id: 4, label: 'Button 4' },
        { id: 5, label: 'Button 5' },
        { id: 6, label: 'Button 6' },
        { id: 7, label: 'Button 7' },
        { id: 8, label: 'Button 8' },
        { id: 9, label: 'Button 9' },
        { id: 10, label: 'Button 10' },
      ],
      attendanceStatus: 'INDEFINIDO',
      status: 'INDEFINIDO',
      isDragging: false,
      buttonWidth: 40,
      containerWidth: 200,
      offsetX: 0,
      center: { lat: 40.689247, lng: -74.044502 }, // Centro do mapa
    };
  },
  methods: {
    toggleNav() {
      this.isNavOpen = !this.isNavOpen;
    },
    setAttendanceStatus(status) {
      this.attendanceStatus = status;
    },
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
    startDrag() {
      this.isDragging = true;
    },
    drag(event) {
      if (this.isDragging) {
        const button = this.$refs.button;
        const rect = button.getBoundingClientRect();
        const buttonWidth = rect.width;
        const containerWidth = this.containerWidth;
        let newPosition = event.clientX - rect.left - buttonWidth / 2;

        newPosition = Math.max(0, newPosition);
        newPosition = Math.min(containerWidth - buttonWidth, newPosition);

        this.offsetX = newPosition;
      }
    },
    stopDrag() {
      this.isDragging = false;
    },
  },
  computed: {
    buttonStyle() {
      return {
        transform: `translateX(${this.offsetX}px)`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.maps-container {
  width: 100%;
  height: 400px;
  margin-bottom: 20px;
}

.index-page {
  background-color: #e6e4f5;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  position: relative;
  padding: 20px;
}

.header {
  color: black;
  text-align: left;
}

.nav-toggle {
  position: fixed;
  top: 20px;
  right: 20px;
  cursor: pointer;
  z-index: 9999;
}

.nav-bar {
  position: fixed;
  top: 0;
  right: 0;
  width: 250px;
  height: 100vh;
  background-color: #3139e9;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 9998;
}

.nav-bar-open {
  transform: translateX(0);
}

.nav-buttons {
  padding-top: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 9997;
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

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
}

.status-container {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.status-label,
.embarque-label {
  font-weight: normal;
  margin-right: 10px;
}

.status-text,
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
  overflow: hidden;
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
  z-index: 1;
}

.comparecer-button,
.nao-comparecer-button {
  transition: background-color 0.3s ease;
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
