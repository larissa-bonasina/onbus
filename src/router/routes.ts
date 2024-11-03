import { RouteRecordRaw } from 'vue-router';
import TelaInicial from 'pages/TelaInicial.vue';
import TelaLogin from 'pages/TelaLogin.vue';
import TelaCadastro from 'pages/TelaCadastro.vue';
import TelaPrincipal from 'src/pages/TelaPrincipal.vue';
import TelaPerfil from 'src/pages/TelaPerfil.vue';
import TelaAdm from 'src/pages/TelaAdm.vue';
import ValidaTela from 'src/pages/ValidaTela.vue';
import ValidaAdm from 'src/pages/ValidaAdm.vue';

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
  },
  {
    path: '/perfil',
    component: TelaPerfil,
  },
  {
    path: '/TelaAdm',
    component: TelaAdm,
  },
  {
    path: '/TelaValida',
    component: ValidaTela,
  },
  {
    path: '/ValidaAdm',
    component: ValidaAdm,
  },
];

export default routes;
