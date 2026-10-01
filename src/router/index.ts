import { route } from 'quasar/wrappers';
import { createRouter, createWebHistory } from 'vue-router';
import routes from './routes';
import { isAuthenticated, getRole } from 'src/utils/auth';

export default route(function () {
  const Router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes,
  });

  Router.beforeEach((to) => {
    if (!to.meta.requiresAuth) return true;

    if (!isAuthenticated()) {
      return { path: to.meta.role === 'admin' ? '/ValidaAdm' : '/login' };
    }

    if (to.meta.role && getRole() !== to.meta.role) {
      return { path: '/' };
    }

    return true;
  });

  return Router;
});
