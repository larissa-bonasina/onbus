import { route } from 'quasar/wrappers';
import { createRouter } from 'vue-router';
import routes from './routes';

export default route(function () {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
  });

  return Router;
});
