import type { App } from 'vue'
import {
  createRouter,
  createWebHistory,
  Router,
  RouteRecordRaw,
} from 'vue-router'
import LayoutMain from '@/components/layout/LayoutMain.vue'
import Error from '@/views/Error.vue'
import Home from '@/views/Home.vue'
import ResultList from '@/views/ResultList.vue'
import ResultDetails from '@/views/ResultDetails.vue'

const mainRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    props: false,
    component: Home,
  },
  {
    path: '/result',
    name: 'Result',
    props: false,
    component: ResultList,
    children: [
      {
        path: '/result/:code',
        name: 'Result Details',
        props: false,
        component: ResultDetails,
      },
    ],
  },
]

const routes: RouteRecordRaw[] = [
  {
    path: '/error',
    alias: '/:pathMatch(.*)*',
    name: 'Error',
    props: false,
    component: Error,
  },
  {
    path: '/',
    props: false,
    component: LayoutMain,
    children: mainRoutes,
  },
]

export default function initializeRouter(app: App): Router {
  const router: Router = createRouter({
    history: createWebHistory(),
    routes,
  })

  app.use(router)

  return router
}
