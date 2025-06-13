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
          style="border-radius: 10px"
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
import { defineComponent, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router'; // <-- ADICIONE ISSO
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default defineComponent({
  name: 'TelaPrincipal',
  setup() {
    const router = useRouter(); // <-- E ISSO

    const isNavOpen = ref(false);
    const status = ref('INDEFINIDO');
    const map = ref(null);
    const routeLayer = ref(null);
    const points = ref([]);

    const navButtons = [
      { id: 1, label: 'Prestação de contas', route: '/route1' },
      { id: 2, label: 'Notificações', route: '/route2' },
      { id: 3, label: 'Boletos', route: '/route3' },
      { id: 4, label: 'Avisos da associação', route: '/route4' },
      { id: 5, label: 'Check-in', route: '/route5' },
    ];

    const toggleNav = () => {
      isNavOpen.value = !isNavOpen.value;
    };

    const navigateTo = (route) => {
      router.push(route);
    };

    onMounted(() => {
      map.value = L.map('map').setView([-15.78, -47.93], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map.value);

      map.value.on('click', (e) => {
        const { lat, lng } = e.latlng;
        points.value.push([lat, lng]);

        L.marker([lat, lng]).addTo(map.value)
          .bindPopup(`Ponto (${lat.toFixed(5)}, ${lng.toFixed(5)})`)
          .openPopup();

        if (points.value.length > 1) {
          if (routeLayer.value) {
            map.value.removeLayer(routeLayer.value);
          }

          routeLayer.value = L.polyline(points.value, { color: 'blue' }).addTo(map.value);
        }
      });
    });

    const clearRoutes = () => {
      if (routeLayer.value) {
        map.value.removeLayer(routeLayer.value);
        routeLayer.value = null;
      }
      points.value = [];
    };


    return {
      isNavOpen,
      navButtons,
      status,
      toggleNav,
      navigateTo,
      clearRoutes,
    };
  },
});
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
  z-index: 2; /* Mantém a barra de navegação sobre o mapa */
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
  background-color: #fff;
}

.content-container {
  padding: 20px;
  max-width: 900px;
  margin: 0 auto;
}

.map-container {
  width: 100%;
  height: 400px;
  border-radius: 10px;
  position: relative;
  z-index: 0;
}

.clear-route-button {
  margin-top: 10px;
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
