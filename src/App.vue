<script setup lang="ts">
import { Ref } from 'vue'

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
