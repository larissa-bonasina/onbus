import { Loader } from '@googlemaps/js-api-loader';

export interface PontoRota {
  nome: string;
  lat: number;
  lng: number;
}

export interface Rota {
  id: string;
  nome: string;
  embarque: PontoRota;
  destino: PontoRota;
  horarioIda: string; // "HH:MM"
  horarioVolta: string | null;
  dias: number[]; // 0 = domingo … 6 = sábado, como Date.getDay()
}

export const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

// "Seg a Sex", "Seg, Qua e Sex", "Todos os dias"
export function resumoDias(dias: number[]): string {
  const d = [...dias].sort();
  if (d.length === 7) return 'Todos os dias';
  if (d.length >= 3 && d.every((v, i) => i === 0 || v === d[i - 1] + 1)) {
    return `${DIAS_SEMANA[d[0]]} a ${DIAS_SEMANA[d[d.length - 1]]}`;
  }
  const nomes = d.map((v) => DIAS_SEMANA[v]);
  return nomes.length > 1 ? `${nomes.slice(0, -1).join(', ')} e ${nomes[nomes.length - 1]}` : nomes.join('');
}

export function rodaHoje(r: Rota, hoje = new Date()): boolean {
  return r.dias.includes(hoje.getDay());
}

// ---------- Google Maps ----------

export const CHAVE_MAPS = import.meta.env.VITE_GOOGLE_MAPS_KEY;

// Uma única instância do Loader: criar outra com opções diferentes faz a biblioteca lançar erro.
let loader: Loader | null = null;
export function carregarGoogleMaps() {
  if (!CHAVE_MAPS) return Promise.reject(new Error('Sem chave do Google Maps'));
  loader ??= new Loader({ apiKey: CHAVE_MAPS, version: 'weekly', language: 'pt-BR', region: 'BR' });
  return loader.importLibrary('maps');
}

// Endereço/cidade → coordenadas. Google (Geocoding API) quando há chave; OpenStreetMap senão.
export async function geocodificar(texto: string): Promise<PontoRota | null> {
  const nome = texto.trim();
  if (!nome) return null;

  if (CHAVE_MAPS) {
    try {
      await carregarGoogleMaps();
      const { results } = await new google.maps.Geocoder().geocode({ address: nome, region: 'BR' });
      const loc = results[0]?.geometry.location;
      if (loc) return { nome, lat: loc.lat(), lng: loc.lng() };
    } catch {
      /* Geocoding API desativada ou sem resultado: tenta o OpenStreetMap */
    }
  }

  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=br&q=${encodeURIComponent(nome)}`;
  const res = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } });
  if (!res.ok) return null;
  const [r] = (await res.json()) as { lat: string; lon: string }[];
  return r ? { nome, lat: Number(r.lat), lng: Number(r.lon) } : null;
}
