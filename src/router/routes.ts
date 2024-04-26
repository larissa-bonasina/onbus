import { RouteRecordRaw } from 'vue-router';
import TelaInicial from 'pages/TelaInicial.vue'; // Certifique-se de importar corretamente sua TelaInicial.vue

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: TelaInicial,
  },
  // outras rotas
];

export default routes;
