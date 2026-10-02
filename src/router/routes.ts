import { RouteRecordRaw } from 'vue-router';
import BlankLayout from 'layouts/BlankLayout.vue';
import StudentLayout from 'layouts/StudentLayout.vue';
import AdminLayout from 'layouts/AdminLayout.vue';
import TelaInicial from 'pages/TelaInicial.vue';
import TelaLogin from 'pages/TelaLogin.vue';
import TelaCadastro from 'pages/TelaCadastro.vue';
import TelaPrincipal from 'src/pages/TelaPrincipal.vue';
import TelaPerfil from 'src/pages/TelaPerfil.vue';
import ValidaAdm from 'src/pages/ValidaAdm.vue';
import ExpensesReport from 'src/pages/ExpensesReport.vue';
import Avisos from 'src/pages/Avisos.vue';
import Boletos from 'src/pages/Boletos.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: BlankLayout,
    children: [
      { path: '', component: TelaInicial },
      { path: 'login', component: TelaLogin },
      { path: 'signup', component: TelaCadastro },
      { path: 'ValidaAdm', component: ValidaAdm },
      { path: 'TelaAdm', redirect: '/admin' },
    ],
  },
  {
    // Telas do aluno: barra de navegação inferior
    path: '/',
    component: StudentLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'principal', component: TelaPrincipal },
      { path: 'boletos', component: Boletos },
      { path: 'avisos', component: Avisos },
      { path: 'perfil', component: TelaPerfil },
      { path: 'prestacao', component: ExpensesReport },
    ],
  },
  {
    // Painel da associação (carregado só quando acessado)
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      { path: '', component: () => import('pages/admin/AdminVisaoGeral.vue') },
      { path: 'presenca', component: () => import('pages/admin/AdminPresenca.vue') },
      { path: 'rotas', component: () => import('pages/admin/AdminRotas.vue') },
      { path: 'alunos', component: () => import('pages/admin/AdminAlunos.vue') },
      { path: 'mensalidades', component: () => import('pages/admin/AdminMensalidades.vue') },
      { path: 'avisos', component: () => import('pages/admin/AdminAvisos.vue') },
      { path: 'contas', component: () => import('pages/admin/AdminContas.vue') },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: BlankLayout,
    children: [{ path: '', component: () => import('pages/ErrorNotFound.vue') }],
  },
];

export default routes;
