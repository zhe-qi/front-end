<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useAside } from '@/store/useUtils'

const route = useRoute()
const store = useAside()
const aside = ref<HTMLElement | null>(null)
const main = ref<HTMLElement | null>(null)
const borderLeft = ref<HTMLElement | null>(null)
const subWidth = ref<string>('0px')

watchEffect(() => {
  subWidth.value = `${store.detailWidth}px`
})

const dragAside = (e: MouseEvent) => {
  if (route.path === '/answer') return false
  let startX = e.clientX
  document.onmousemove = (e) => {
    const endX = e.clientX
    const moveLen = endX - startX
    startX = endX
    store.detailWidth += moveLen
  }
  document.onmouseup = () => {
    document.onmousemove = null
    document.onmouseup = null
  }
  return false
}
</script>

<template>
  <div
    bg
    dark:bg-none
    dark:bg-zinc-800
    flex
    w-full
    h-full
  >
    <aside
      ref="aside"
      :style="{ width: `${store.detailWidth}px` }"
      h-full
      flex
      overflow-y-auto
      overflow-x-hidden
    >
      <AsidePage />
    </aside>
    <div
      ref="borderLeft"
      w-1px
      hover:w-3px
      bg-zinc-300
      h-full
      cursor-ew-resize
      @mousedown="dragAside"
    />
    <div
      ref="main"
      class="main"
      h-full
      relative
    >
      <header
        h-16
        border-b
        border-zinc-200
        backdrop-blur
        absolute
        z-999
        class="md:w-[calc(100%-20px)] w-[calc(100%-10px)]"
      >
        <HeaderPage />
      </header>
      <main
        w-full
        h-full
        overflow-y-auto
      >
        <Suspense>
          <template #default>
            <router-view />
          </template>
          <template #fallback>
            <div
              w-full
              h-full
              flex
              justify-center
              items-center
            >
              loading...
            </div>
          </template>
        </Suspense>
      </main>
    </div>
  </div>
</template>

<style>
.main {
  width: calc(100% - v-bind(subWidth));
}
</style>
