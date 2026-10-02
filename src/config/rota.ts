// Rota fixa até existir o cadastro de rotas/viagens no backend (roadmap, Fase 2).
// Com o Google Maps configurado, o mapa desenha o caminho pelas estradas; sem ele,
// uma ligação tracejada entre os pontos. Ainda não é a posição ao vivo do ônibus.

export interface PontoRota {
  nome: string;
  lat: number;
  lng: number;
}

export const ROTA = {
  nome: 'Vera → Sinop',
  embarque: { nome: 'Vera', lat: -12.3006, lng: -55.3133 } as PontoRota,
  destino: { nome: 'Sinop', lat: -11.8642, lng: -55.5093 } as PontoRota,
};
