import type { RouteRecordRaw } from 'vue-router'

export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/Login/Home.vue'),
    redirect: '/login',
    children: [
      {
        path: 'login',
        name: 'loginPage',
        component: () => import('@/views/Login/Login.vue')
      },
      {
        path: 'register',
        name: 'registerPage',
        component: () => import('@/views/Login/Register.vue')
      }
    ]
  }
]

export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/homePage',
    name: 'homePage',
    component: () => import('@/views/homePage/HomePage.vue'),
    meta: { roles: ['admin', 'user'] }
  },
  {
    path: '/category',
    name: 'category',
    component: () => import('@/views/adminPage/Category.vue'),
    meta: { roles: ['admin'] }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import('@/views/adminPage/Users.vue'),
    meta: { roles: ['admin'] }
  },
  {
    path: '/question',
    name: 'question',
    component: () => import('@/views/adminPage/Question.vue'),
    meta: { roles: ['admin'] }
  },
  {
    path: '/questions',
    name: 'questions',
    component: () => import('@/views/adminPage/Questions.vue'),
    meta: { roles: ['admin'] }
  },
  {
    path: '/answer',
    name: 'answer',
    component: () => import('@/views/answerPage/Answer.vue'),
    meta: { roles: ['admin', 'user'] }
  },
  {
    path: '/result',
    name: 'result',
    component: () => import('@/views/answerPage/Result.vue'),
    meta: { roles: ['admin', 'user'] }
  }
]
