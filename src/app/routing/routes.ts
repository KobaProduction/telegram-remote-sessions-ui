import type { RouteRecordRaw } from 'vue-router'
import { MainLayout } from 'src/app/layouts'
import { IndexPage } from 'pages'
import { ErrorNotFound } from 'pages/errors'


export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => MainLayout,
    children: [{ path: '', component: () => IndexPage }],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => ErrorNotFound,
  },
];
