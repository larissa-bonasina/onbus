import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/TelaInicial.vue') }],
  },
  // Aqui você pode adicionar outras rotas, se necessário
  {
    path: '/outra-rota',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/OutraPagina.vue') }],
  },
  // Leave the catch-all route as the last one
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
