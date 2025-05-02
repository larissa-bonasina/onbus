<template>
  <div class="map-container">
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import L from 'leaflet';

export default defineComponent({
  name: 'MapComponent',
  setup() {
    const map = ref(null);
    const routeLayer = ref(null);
    const routePath = ref([]);

    onMounted(() => {
      initMap();
    });

    function initMap() {
      map.value = L.map('map').setView([-23.55052, -46.633308], 14);

      // Adiciona OpenStreetMap como camada base
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      }).addTo(map.value);

      // Evento de clique para adicionar pontos de rota
      map.value.on('click', addRoutePoint);
    }

    function addRoutePoint(e) {
      routePath.value.push([e.latlng.lat, e.latlng.lng]);

      // Remove a camada anterior e redesenha a rota
      if (routeLayer.value) {
        map.value.removeLayer(routeLayer.value);
      }

      routeLayer.value = L.polyline(routePath.value, { color: 'red' }).addTo(map.value);
    }

    return { map };
  },
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 400px;
}
.map {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
</style>
