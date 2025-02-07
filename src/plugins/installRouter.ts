import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import type { App } from 'vue';
export const routes: Array<RouteRecordRaw> = [];
interface Moudle {
  default: RouteRecordRaw
}

// Load all router configuration files from modules into routes
const moduleRouterList = import.meta.glob('pages/routers/*.ts', { eager: true });
for (const path in moduleRouterList) {
  const routerInstance = (moduleRouterList[path] as Moudle).default;
  // Automatically associate routers with files of the same name under views
  routerInstance.component = () => import(`@/pages/views/${routerInstance.name as string}.vue`);
  routes.push(routerInstance);
}

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeResolve(async to => {
  if (to.meta.title) {
    window.document.title = to.meta.title as string;
  }
});
