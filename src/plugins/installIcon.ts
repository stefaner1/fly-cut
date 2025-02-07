import type { App, Component } from 'vue';
const installIcon = {
  install(app: App) {
    // Automatically register icon components from icons directory
    const moduleRouterList = import.meta.glob('@/components/icons/*.vue', { eager: true });
    for (const path in moduleRouterList) {
      const name = path.match(/(?<=\/)(\w+)(?=\.vue)/) || [];
      app.component(name[0], (moduleRouterList[path] as { default: Component }).default);
    }
  }
};
export default installIcon;