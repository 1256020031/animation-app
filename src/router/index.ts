import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 定义路由规则
const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '/',
    name: 'layout',
    redirect: '/HomePage',
    component: () => import('@/views/layout/index.vue'),
    children: [
      {
        path: '/HomePage',
        name: 'HomePage',
        component: () => import('@/views/HomePage/index.vue')
      },
      {
        path: '/CategoryPage',
        name: 'CategoryPage',
        component: () => import('@/views/CategoryPage/index.vue')
      },
      {
        path: '/SearchPage',
        name: 'SearchPage',
        component: () => import('@/views/SearchPage/index.vue')
      },
      {
        path: '/mine',
        name: 'mine',
        component: () => import('@/views/mine/index.vue')
      },
    ]
  },
  {
    path: '/AnimeDetail',
    name: 'AnimeDetail',
    component: () => import('@/views/components/AnimeDetail.vue')
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router