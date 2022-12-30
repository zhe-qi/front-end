import { acceptHMRUpdate, defineStore } from 'pinia'
import store from '@/store/store'
import router from '@/router'
import { asyncRoutes } from '@/router/routes'
import type { RouteRecordRaw } from 'vue-router'

// TODO: 缺少图标
interface Menus {
  name: string
  roles: string[]
  isShow?: boolean
  path?: string
  id: string
  isShowOne?: boolean
  children?: {
    name: string
    roles: string[]
    path: string
    id: string
    isShowOne?: boolean
  }[]
}

const menus: Menus[] = [
  {
    name: '首页',
    roles: ['admin', 'user'],
    isShowOne: true,
    id: '1',
    path: '/homePage'
  },
  {
    name: '后台管理',
    roles: ['admin'],
    isShow: false,
    id: '2',
    children: [
      {
        name: '用户管理',
        roles: ['admin'],
        path: '/users',
        id: '2-1',
        isShowOne: false
      },
      {
        name: '分类管理',
        roles: ['admin'],
        path: '/category',
        id: '2-2',
        isShowOne: false
      },
      {
        name: '题目管理',
        roles: ['admin'],
        path: '/question',
        id: '2-3',
        isShowOne: false
      }
    ]
  }
]

export const useUserPermission = defineStore('useUserPermission', {
  state: (): {
    routes: RouteRecordRaw[]
    isRef: boolean
  } => ({
    routes: [],
    isRef: true
  }),
  actions: {
    generateRoutes(roles: string) {
      // 过滤路由
      const accessedRoutes = asyncRoutes.filter((route) => {
        if (route.meta && route.meta.roles)
          return (route.meta.roles as string[]).includes(roles)
        else return true
      })
      const routes: RouteRecordRaw = {
        path: '/admin',
        name: 'admin',
        redirect: 'homePage',
        component: () => import('@/views/Admin.vue'),
        children: accessedRoutes
      }
      router.addRoute(routes)
      localStorage.setItem('routes', JSON.stringify(routes, (_k, v) => {
        if (typeof v === 'function')
          return `thisFunction${v}`
        return v
      }))
    },
    setUserAndMenu(role: string) {
      const menu = (JSON.parse(JSON.stringify(menus)) as typeof menus).filter(
        (item) => {
          const flag = item.roles.includes(role)
          if (item.children && flag) {
            item.children = item.children.filter((child) => {
              return child.roles.includes(role)
            })
          }
          return flag
        }
      )
      localStorage.setItem('user', JSON.stringify({ menus: menu, roles: role }))
    },
    reset() {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      sessionStorage.removeItem('userPermissions')
      sessionStorage.removeItem('userId')
      sessionStorage.removeItem('username')
      localStorage.removeItem('currentPath')
      localStorage.removeItem('routes')
    }
  }
})

export function usePiniaUserPermission() {
  return useUserPermission(store)
}

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useUserPermission, import.meta.hot))
