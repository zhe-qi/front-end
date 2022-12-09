<script setup lang="ts">
import { useRouter } from 'vue-router'
import { Ref } from 'vue'
import { resetRouter } from '@/router'

const router = useRouter()

/* 刷新页面时添加路由 */
if (localStorage.getItem('token')) {
  resetRouter()
  const routes = JSON.parse(localStorage.getItem('routes')!, (_key, value) => {
    if (value && typeof value === 'string') {
      return value.includes('thisFunction')
      // eslint-disable-next-line no-new-func
        ? new Function(`return ${value.replace('thisFunction', '')}`)()
        : value
    }
    return value
  })
  router.addRoute(routes)
  router.replace(localStorage.getItem('currentPath') || '/homePage')
}

useHead({
  title: '在线答题系统'
})

const el = ref<HTMLElement | null>(null)

const { toggle, isFullscreen } = useFullscreen(el as Ref<HTMLElement | null>)
provide('fullScreen', toggle)
provide('isFullscreen', isFullscreen)
</script>

<template>
  <div ref="el" w-full h-full>
    <RouterView />
  </div>
</template>

<style>
html,
body,
#app {
  height: 100%;
  width: 100%;
}

#nprogress .bar {
  @apply !bg-blue-500;
}
</style>
