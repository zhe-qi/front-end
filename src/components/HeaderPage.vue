<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Ref } from 'vue'
import { useUserPermission } from '@/store/useUserPermission'
import { useAside } from '@/store/useUtils'
const route = useRoute()
const router = useRouter()
const store = useUserPermission()
const aside = useAside()
const { width } = useWindowSize()
const dialogVisible = ref<boolean>(false)

const hiddenAside = () => {
  aside.detailWidth = 0
}
const showAside = () => {
  if (route.path === '/answer') return false
  if (width.value < 768) aside.detailWidth = 80
  else aside.detailWidth = 200
}

const isAside = computed(() => {
  return aside.detailWidth === 0
})

const exit = () => {
  dialogVisible.value = true
}

const exitConfirm = () => {
  dialogVisible.value = false
  store.reset()
  router.replace('/login')
  ElMessage({
    showClose: true,
    message: '退出成功',
    type: 'success'
  })
}

const toggle = inject('fullScreen') as () => Promise<void>
const isFullscreen = inject('isFullscreen') as Ref<boolean>
const isDark = useDark()
const toggleDark = useToggle(isDark)
const toGithub = () => {
  window.open('https://github.com/zhe-qi')
}
</script>

<template>
  <Teleport to="#app">
    <el-dialog
      v-model="dialogVisible"
      title="Tips"
      width="30%"
      draggable
    >
      <span>确定退出登录吗？</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="exitConfirm"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </Teleport>
  <div
    flex
    items-center
    h-full
    w-full
    space-x-3xl
  >
    <div title="隐藏显示侧边栏">
      <div
        v-if="isAside"
        i-material-symbols:keyboard-double-arrow-right
        text-2xl
        cursor-pointer
        hover:text-red-200
        @click="showAside"
      />
      <div
        v-else
        i-material-symbols:keyboard-double-arrow-left
        cursor-pointer
        hover:text-red-200
        text-2xl
        @click="hiddenAside"
      />
    </div>
    <div>
      <div
        v-if="isFullscreen"
        i-material-symbols:fullscreen-exit-rounded
        h-6
        w-6
        cursor-pointer
        hover:text-red-200
        @click="toggle"
      />
      <div
        v-else
        i-material-symbols:fullscreen-rounded
        h-6
        w-6
        cursor-pointer
        @click="toggle"
      />
    </div>
    <div>
      <div
        v-if="isDark"
        i-material-symbols:light-mode
        h-6
        w-6
        cursor-pointer
        hover:text-red-200
        @click="toggleDark()"
      />
      <div
        v-else
        i-material-symbols:nightlight-outline
        h-6
        w-6
        cursor-pointer
        hover:text-red-200
        @click="toggleDark()"
      />
    </div>
    <div
      flex
      justify-center
      items-center
      cursor-pointer
      hover:text-red-200
      @click="exit"
    >
      <div
        i-icomoon-free:exit
        text-lg
      />
    </div>
    <div cursor-pointer i-line-md:github-loop @click="toGithub" />
    <a href="#" hover:text-blue-200>历史记录</a>
    <a href="#" hover:text-blue-200>排行</a>
  </div>
</template>
