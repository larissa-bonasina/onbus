<template>
  <div>
    <!-- Cabeçalho -->
    <header class="header">
      <q-icon name="account_circle" size="50px" class="profile-icon" />
      <a href="/perfil" class="username-link">Perfil do Estudante</a>
    </header>

    <!-- Barra de navegação -->
    <div class="nav-toggle" @click="toggleNav">
      <q-icon name="menu" size="24px" />
    </div>
    <div
      class="nav-backdrop"
      :class="{ 'nav-backdrop-open': isNavOpen }"
      @click="toggleNav"
    ></div>
    <nav class="nav-bar" :class="{ 'nav-bar-open': isNavOpen }">
      <div class="nav-buttons">
        <q-btn
          v-for="button in navButtons"
          :key="button.id"
          :label="button.label"
          class="nav-button"
          @click="navigateTo(button.route)"
          rounded
        />
      </div>
    </nav>

    <!-- Conteúdo Principal -->
    <section class="content-container">
      <!-- Google Maps -->
      <div class="maps-container">
        <iframe
          src="https://www.google.com.br/maps/@-12.284247,-55.3032913,14z?entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D"
          width="100%"
          height="400"
          style="border-radius: 10px"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      <!-- Status de presença -->
      <div class="status-container">
        <div class="status-label">STATUS:</div>
        <div class="status-text">{{ attendanceStatus }}</div>
      </div>
      <div class="embarque-container">
        <div class="embarque-label">EMBARQUE:</div>
        <div class="embarque-text">{{ status }}</div>
      </div>

      <!-- Slider -->
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
          {{ status }}
        </q-btn>
      </div>

      <!-- Botões de ação -->
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

      <!-- Link para contato -->
      <a class="contact-link" href="https://wa.me/" target="_blank">
        ENTRAR EM CONTATO COM A ASSOCIAÇÃO
      </a>

      <!-- Upload de boleto -->
      <div class="upload-container">
        <q-uploader
          url="/api/upload-boleto"
          :label="'Clique para enviar o boleto'"
          color="primary"
          no-thumbnails
          :max-files="1"
          :accept="['application/pdf', 'image/jpeg', 'image/png']"
          v-model="boletoFile"
          ref="uploader"
        />
        <div v-if="boletoFile">
          <span>Arquivo selecionado: {{ boletoFile.name }}</span>
        </div>

        <!-- Botão de envio -->
        <q-btn
          v-if="boletoFile"
          label="Enviar Boleto"
          color="primary"
          @click="handleFileUpload"
          unelevated
        />
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      isNavOpen: false,
      navButtons: [
        { id: 1, label: 'Button 1', route: '/route1' },
        { id: 2, label: 'Button 2', route: '/route2' },
        { id: 3, label: 'Button 3', route: '/route3' },
        { id: 4, label: 'Button 4', route: '/route4' },
        { id: 5, label: 'Button 5', route: '/route5' },
        { id: 6, label: 'Button 6', route: '/route6' },
        { id: 7, label: 'Button 7', route: '/route7' },
        { id: 8, label: 'Button 8', route: '/route8' },
        { id: 9, label: 'Button 9', route: '/route9' },
        { id: 10, label: 'Button 10', route: '/route10' },
      ],
      attendanceStatus: 'INDEFINIDO',
      status: 'INDEFINIDO',
      isDragging: false,
      buttonWidth: 40,
      containerWidth: 200,
      offsetX: 0,
      boletoFile: null,
    };
  },
  methods: {
    toggleNav() {
      this.isNavOpen = !this.isNavOpen;
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
        let newPosition = event.clientX - rect.left - this.buttonWidth / 2;

        newPosition = Math.max(0, newPosition);
        newPosition = Math.min(
          this.containerWidth - this.buttonWidth,
          newPosition
        );

        this.offsetX = newPosition;
      }
    },
    stopDrag() {
      this.isDragging = false;
      this.updateStatus();
    },
    updateStatus() {
      if (this.offsetX < this.containerWidth / 3) {
        this.status = 'CHECK OUT';
        this.offsetX = 0;
      } else if (this.offsetX < (this.containerWidth * 2) / 3) {
        this.status = 'INDEFINIDO';
        this.offsetX = this.containerWidth / 2 - this.buttonWidth / 2;
      } else {
        this.status = 'CHECK IN';
        this.offsetX = this.containerWidth - this.buttonWidth;
      }
    },
    async doCheckin() {
      try {
        const response = await axios.post('/api/auth/checkin', {
          cpf: '12345678900',
          status: 'CHECK IN',
        });
        console.log('Check-in realizado com sucesso:', response.data);
      } catch (error) {
        console.error('Erro ao realizar check-in:', error);
      }
    },
    async doCheckout() {
      try {
        const response = await axios.post('/api/auth/checkout', {
          checkinId: 'checkinId_aqui',
        });
        console.log('Check-out realizado com sucesso:', response.data);
      } catch (error) {
        console.error('Erro ao realizar check-out:', error);
      }
    },
    async handleFileUpload() {
      if (this.boletoFile) {
        try {
          const formData = new FormData();
          formData.append('boleto', this.boletoFile);

          const response = await axios.post('/api/upload-boleto', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          console.log('Boleto enviado com sucesso:', response.data);
        } catch (error) {
          console.error('Erro ao enviar o boleto:', error);
        }
      }
    },
    navigateTo(route) {
      this.$router.push(route);
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

<style scoped>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #354aff;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.profile-icon {
  color: #fff;
  margin-right: 10px;
}

.username-link {
  color: #fff;
  font-size: 18px;
  text-decoration: none;
}

.nav-toggle {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  position: absolute;
  top: 20px;
  right: 20px;
}

.nav-backdrop {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
}

.nav-backdrop-open {
  display: block;
}

.nav-bar {
  position: fixed;
  top: 0;
  right: -250px;
  width: 250px;
  height: 100%;
  background-color: #354aff;
  transition: right 0.3s ease-in-out;
  z-index: 1;
}

.nav-bar-open {
  right: 0;
}

.nav-buttons {
  padding: 20px;
}

.nav-button {
  margin-bottom: 10px;
  width: 100%;
}

.content-container {
  padding: 20px;
}

.maps-container {
  margin-bottom: 20px;
}

.status-container,
.embarque-container {
  margin-bottom: 20px;
}

.status-label,
.embarque-label {
  font-weight: bold;
  font-size: 18px;
}

.status-text,
.embarque-text {
  font-size: 16px;
  color: #333;
}

.slider-container {
  width: 200px;
  height: 40px;
  background-color: #ddd;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}

.slide-button {
  width: 40px;
  height: 40px;
  background-color: #354aff;
  color: #fff;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
}

.status-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
}

.comparecer-button,
.nao-comparecer-button {
  width: 48%;
}

.contact-link {
  display: block;
  text-align: center;
  margin-top: 20px;
  text-decoration: none;
  color: #354aff;
}
</style>
