<template>
  <div class="route-map">
    <div ref="el" class="route-map__canvas" aria-label="Mapa da rota" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Loader } from '@googlemaps/js-api-loader';
import type * as Leaflet from 'leaflet';
import type { PontoRota } from 'src/config/rota';

const props = defineProps<{ embarque: PontoRota; destino: PontoRota }>();

const el = ref<HTMLElement | null>(null);
const AZUL = '#354aff';
const TINTA = '#12142a';
const CHAVE = import.meta.env.VITE_GOOGLE_MAPS_KEY;

let leafletMap: Leaflet.Map | null = null;

// ---------- Google Maps (produção) ----------

// Estilo dessaturado: a rota azul é o destaque, o resto do mapa fica de fundo.
const ESTILO: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ saturation: -80 }, { lightness: 8 }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#c9d3f5' }] },
];

async function caminhoPelasEstradas(): Promise<google.maps.LatLngLiteral[] | null> {
  const a = { lat: props.embarque.lat, lng: props.embarque.lng };
  const b = { lat: props.destino.lat, lng: props.destino.lng };
  // Routes API (atual). Projetos novos no Google Cloud não ativam mais a Directions API antiga.
  try {
    const lib = (await google.maps.importLibrary('routes')) as unknown as {
      Route?: { computeRoutes(req: object): Promise<{ routes?: { path?: google.maps.LatLngLiteral[] }[] }> };
    };
    if (lib.Route) {
      const { routes } = await lib.Route.computeRoutes({ origin: a, destination: b, travelMode: 'DRIVING', fields: ['path'] });
      const path = routes?.[0]?.path;
      if (path?.length) return path.map((p) => ({ lat: Number(p.lat), lng: Number(p.lng) }));
    }
  } catch {
    /* tenta a Directions API abaixo */
  }
  try {
    const res = await new google.maps.DirectionsService().route({ origin: a, destination: b, travelMode: google.maps.TravelMode.DRIVING });
    return res.routes[0]?.overview_path.map((p) => p.toJSON()) ?? null;
  } catch {
    return null;
  }
}

function pino(cor: string): google.maps.Symbol {
  return { path: google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: cor, fillOpacity: 1, strokeColor: '#fff', strokeWeight: 3 };
}

async function montarGoogle(alvo: HTMLElement) {
  await new Loader({ apiKey: CHAVE as string, version: 'weekly', language: 'pt-BR', region: 'BR' }).importLibrary('maps');
  const map = new google.maps.Map(alvo, {
    disableDefaultUI: true,
    clickableIcons: false,
    gestureHandling: 'greedy',
    styles: ESTILO,
  });

  const a = { lat: props.embarque.lat, lng: props.embarque.lng };
  const b = { lat: props.destino.lat, lng: props.destino.lng };
  new google.maps.Marker({ map, position: a, title: props.embarque.nome, icon: pino(TINTA) });
  new google.maps.Marker({ map, position: b, title: props.destino.nome, icon: pino(AZUL) });

  const bounds = new google.maps.LatLngBounds().extend(a).extend(b);
  const caminho = await caminhoPelasEstradas();
  if (caminho) {
    caminho.forEach((p) => bounds.extend(p));
    new google.maps.Polyline({ map, path: caminho, strokeColor: AZUL, strokeWeight: 5, strokeOpacity: 0.9 });
  } else {
    // Sem rota calculada: ligação tracejada, igual ao modo sem chave.
    new google.maps.Polyline({
      map,
      path: [a, b],
      strokeOpacity: 0,
      icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, strokeColor: AZUL, scale: 3 }, offset: '0', repeat: '14px' }],
    });
  }
  map.fitBounds(bounds, { top: 80, right: 50, bottom: 70, left: 50 });
}

// ---------- Leaflet + OpenStreetMap (desenvolvimento, sem chave) ----------

async function montarLeaflet(alvo: HTMLElement) {
  const L = (await import('leaflet')).default;
  await import('leaflet/dist/leaflet.css');
  const a = props.embarque;
  const b = props.destino;
  const pin = (classe: string) =>
    L.divIcon({ className: '', html: `<span class="pin ${classe}"></span>`, iconSize: [18, 18], iconAnchor: [9, 9] });

  leafletMap = L.map(alvo, { zoomControl: false, attributionControl: true });
  // A política de uso do OSM não permite tráfego de produção; em produção o mapa é o Google.
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap', maxZoom: 19 }).addTo(leafletMap);
  L.polyline([[a.lat, a.lng], [b.lat, b.lng]], { color: AZUL, weight: 4, dashArray: '2 10', lineCap: 'round' }).addTo(leafletMap);
  L.marker([a.lat, a.lng], { icon: pin('pin--origem'), title: a.nome }).addTo(leafletMap);
  L.marker([b.lat, b.lng], { icon: pin('pin--destino'), title: b.nome }).addTo(leafletMap);
  leafletMap.fitBounds(L.latLngBounds([[a.lat, a.lng], [b.lat, b.lng]]), { padding: [60, 60] });
  alvo.classList.add('route-map--osm');
}

onMounted(async () => {
  if (!el.value) return;
  if (CHAVE) {
    try {
      await montarGoogle(el.value);
      return;
    } catch (e) {
      console.warn('Google Maps indisponível, usando OpenStreetMap.', e);
      el.value.replaceChildren();
    }
  }
  await montarLeaflet(el.value);
});

onBeforeUnmount(() => {
  leafletMap?.remove();
  leafletMap = null;
});
</script>

<style scoped>
.route-map {
  position: relative;
  background: #e8ebf4;
}

/* O painel do app sobrepõe 24px da base do mapa; o canvas para antes,
   para a logo e a atribuição do provedor ficarem visíveis (exigência dos termos). */
.route-map__canvas {
  position: absolute;
  inset: 0 0 24px 0;
}

:deep(.pin) {
  display: block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  box-shadow: 0 0 0 3px #fff, 0 2px 6px rgba(18, 20, 42, 0.3);
}

:deep(.pin--origem) {
  background: var(--ob-ink);
}

:deep(.pin--destino) {
  background: var(--ob-blue-500);
}

/* Mapa dessaturado para a rota azul ser o destaque, como no estilo do Google */
.route-map--osm :deep(.leaflet-tile-pane) {
  filter: grayscale(0.75) brightness(1.04) contrast(0.92);
}
</style>
