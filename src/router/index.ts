import { createRouter, createWebHashHistory } from 'vue-router'
import nprogress from 'nprogress'
import { constantRoutes } from './routes'

// 白名单应该包含基本静态路由
const WHITE_NAME_LIST: string[] = []
const getRouteNames = (array: any[]) =>
  array.forEach((item) => {
    WHITE_NAME_LIST.push(item.name)
    getRouteNames(item.children || [])
  })
getRouteNames(constantRoutes)

// app router
// 创建一个可以被 Vue 应用程序使用的路由实例
const router = createRouter({
  // 创建一个 hash 历史记录。
  history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
  // 应该添加到路由的初始路由列表。
  routes: constantRoutes,
  // 是否应该禁止尾部斜杠。默认为假
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

router.beforeEach((to, from, next) => {
  if (to.path !== from.path) nprogress.start()
  const token = localStorage.getItem('token')
  if (to.path === '/login' || to.path === '/404' || to.path === '/register') {
    if (token)
      router.push('/homePage')
    else
      next()
  }
  else { token ? next() : next('/login') }
})

router.afterEach((to) => {
  // 结束进度条
  nprogress.done()
  if (to.path !== '/login' && to.path !== '/register')
    localStorage.setItem('currentPath', to.path)
})

// reset router
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route
    if (name && !WHITE_NAME_LIST.includes(name as string))
      router.hasRoute(name) && router.removeRoute(name)
  })
}

export default router