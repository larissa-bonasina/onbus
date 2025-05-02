<template>
  <div>
    <!-- Cabeçalho -->
    <header class="header">
      <q-avatar size="50px" class="profile-icon bg-white text-primary">
        <img src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png" alt="admin fofo" />
      </q-avatar>
      <a href="/perfil" class="username-link">Perfil do Estudante</a>
    </header>

    <!-- Botão de menu (mobile) -->
    <div class="nav-toggle" @click="toggleNav">
      <q-icon name="menu" size="24px" color="white" />
    </div>

    <!-- Fundo escuro ao abrir nav -->
    <div
      class="nav-backdrop"
      :class="{ 'nav-backdrop-open': isNavOpen }"
      @click="toggleNav"
    ></div>

    <!-- Menu lateral -->
    <nav class="nav-bar" :class="{ 'nav-bar-open': isNavOpen }">
      <div class="nav-buttons">
        <q-btn
          v-for="button in navButtons"
          :key="button.id"
          :label="button.label"
          class="nav-button"
          @click="navigateTo(button.route)"
          rounded
          unelevated
        />
      </div>
    </nav>

    <!-- Conteúdo principal -->
    <section class="content-container">
      <!-- Google Maps -->
      <div class="maps-container">
        <iframe
          src="https://www.google.com/maps?q=Vera,+MT&output=embed"
          width="100%"
          height="400"
          style="border-radius: 12px"
          allowfullscreen
          loading="lazy"
        ></iframe>
      </div>

      <!-- Status -->
      <div class="status-container">
        <p class="status-text">Status: {{ status }}</p>
      </div>

      <!-- Slider interativo -->
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

      <!-- Link contato -->
      <a class="contact-link" href="https://wa.me/" target="_blank">
        ENTRAR EM CONTATO COM A ASSOCIAÇÃO
      </a>
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
        { id: 1, label: 'Prestação de contas', route: '/route1' },
        { id: 2, label: 'Notificações', route: '/route2' },
        { id: 3, label: 'Boletos', route: '/route3' },
        { id: 4, label: 'Avisos da associação', route: '/route4' },
        { id: 5, label: 'Check-in', route: '/route5' },
      ],
      status: 'INDEFINIDO',
      isDragging: false,
      buttonWidth: 40,
      containerWidth: 200,
      offsetX: 0,
    };
  },
  computed: {
    buttonStyle() {
      return {
        transform: `translateX(${this.offsetX}px)`,
        transition: this.isDragging ? 'none' : 'transform 0.3s ease',
      };
    },
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
        const container = this.$refs.sliderContainer.getBoundingClientRect();
        let newPosition = event.clientX - container.left - this.buttonWidth / 2;

        newPosition = Math.max(0, newPosition);
        newPosition = Math.min(this.containerWidth - this.buttonWidth, newPosition);

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
    navigateTo(route) {
      this.$router.push(route);
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
  padding: 16px;
  margin-bottom: 20px;
}

.profile-icon {
  margin-right: 10px;
  border-radius: 50%;
  overflow: hidden;
}

.username-link {
  color: #ffffff;
  font-size: 18px;
  text-decoration: none;
  font-weight: bold;
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
  z-index: 3;
}

.nav-backdrop {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 2;
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
  z-index: 3;
  padding-top: 60px;
}

.nav-bar-open {
  right: 0;
}

.nav-buttons {
  padding: 20px;
}

.nav-button {
  margin-bottom: 12px;
  width: 100%;
  background-color: #ffffff;
  color: #3a3a3a;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.content-container {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.maps-container {
  margin-bottom: 20px;
}

.status-container {
  margin-bottom: 20px;
}

.status-text {
  font-size: 16px;
  font-weight: 500;
  color: #0d1132;
}

.slider-container {
  width: 200px;
  height: 40px;
  background-color: #e2e2e2;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
}

.slide-button {
  width: 40px;
  height: 40px;
  background-color: #354aff;
  color: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  transition: transform 0.3s ease;
}

.contact-link {
  display: block;
  text-align: center;
  margin-top: 30px;
  color: #354aff;
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
}
</style>
