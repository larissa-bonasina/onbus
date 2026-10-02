// Fica num arquivo próprio: o "import" transforma o arquivo em módulo, e no
// shims-vue.d.ts isso desligaria a declaração global de '*.vue'.
import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean;
    role?: 'admin' | 'aluno';
  }
}
