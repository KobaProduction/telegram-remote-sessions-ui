import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router'
import type { RouterHistory } from 'vue-router'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

function createHistory(routerBase: string | undefined): RouterHistory {
  if (process.env.SERVER) {
    return createMemoryHistory(routerBase)
  } else if (process.env.VUE_ROUTER_MODE === 'history') {
    return createWebHistory(routerBase)
  } else {
    return createWebHashHistory(routerBase)
  }
}

export function createAppRouter(routes: RouteRecordRaw[]) {
  return createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })
}
