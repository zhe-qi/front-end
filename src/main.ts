import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createHead } from '@vueuse/head'
import piniaPersist from 'pinia-plugin-persist'
import router from '@/router'

import App from '@/App.vue'
import { buttonPermissions } from './utils/permissions'

// 使用unocss和tailwind样式重置库
import '@unocss/reset/tailwind.css'
import 'uno.css'
// 引入组件库样式
import 'element-plus/theme-chalk/src/message.scss'
import 'nprogress/nprogress.css'

// 国际化i18n
const messages = Object.fromEntries(
  Object.entries(
    import.meta.glob<{ default: any }>('../locales/*.y(a)?ml', {
      eager: true
    })
  ).map(([key, value]) => {
    const yaml = key.endsWith('.yaml')
    return [key.slice(14, yaml ? -5 : -4), value.default]
  })
)
const i18n = createI18n({
  legacy: false,
  locale: 'zh-CN',
  messages
})

// 使用vueuse/head
const head = createHead()
const pinia = createPinia()
pinia.use(piniaPersist)
// 创建spa
const app = createApp(App)
app.directive('permissions', buttonPermissions)
app.use(router).use(pinia).use(i18n).use(head)
app.mount('#app')
export default app
