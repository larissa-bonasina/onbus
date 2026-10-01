import { RouteRecordRaw } from 'vue-router';
import TelaInicial from 'pages/TelaInicial.vue';
import TelaLogin from 'pages/TelaLogin.vue';
import TelaCadastro from 'pages/TelaCadastro.vue';
import TelaPrincipal from 'src/pages/TelaPrincipal.vue';
import TelaPerfil from 'src/pages/TelaPerfil.vue';
import TelaAdm from 'src/pages/TelaAdm.vue';
import ValidaAdm from 'src/pages/ValidaAdm.vue';
import ExpensesReport from 'src/pages/ExpensesReport.vue';
import Avisos from 'src/pages/Avisos.vue';
import Boletos from 'src/pages/Boletos.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '',
    component: TelaInicial,
  },
  {
    path: '/login',
    component: TelaLogin,
  },
  {
    path: '/signup',
    component: TelaCadastro,
  },
  {
    path: '/principal',
    component: TelaPrincipal,
    meta: { requiresAuth: true },
  },
  {
    path: '/perfil',
    component: TelaPerfil,
    meta: { requiresAuth: true },
  },
  {
    path: '/TelaAdm',
    component: TelaAdm,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/ValidaAdm',
    component: ValidaAdm,
  },
  {
    path: '/prestacao',
    component: ExpensesReport,
    meta: { requiresAuth: true },
  },
  {
    path: '/avisos',
    component: Avisos,
    meta: { requiresAuth: true },
  },
  {
    path: '/boletos',
    component: Boletos,
    meta: { requiresAuth: true },
  },
];

export default routes;
