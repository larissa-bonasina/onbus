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
        <!-- Iframe para exibir o Google Maps -->
        <iframe
          src="https://www.google.com.br/maps/@-12.284247,-55.3032913,14z?entry=ttu&g_ep=EgoyMDI0MTAyOS4wIKXMDSoASAFQAw%3D%3D"
          width="100%"
          height="500"
          style="border: 0"
          allowfullscreen=""
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
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
export default {
  name: 'IndexPage',
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
    async doCheckin() {
      try {
        const response = await axios.post('/api/auth/checkin', {
          cpf: '12345678900', // Substitua pelo CPF real
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
          checkinId: 'checkinId_aqui', // Substitua pelo ID real do check-in
        });
        console.log('Check-out realizado com sucesso:', response.data);
      } catch (error) {
        console.error('Erro ao realizar check-out:', error);
      }
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
