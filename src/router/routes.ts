import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },

  {
    path: '/connect',
    component: () => import('pages/ConnectPage.vue') ,
    children: [{ path: '', component: () => import('pages/ConnectPage.vue') }]
    },
  {
    path: '/sessions',
    component: () => import('pages/SessionsPage.vue') ,
    children: [{ path: '', component: () => import('pages/SessionsPage.vue') }]
  },
];

export default routes;

