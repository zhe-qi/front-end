<script setup lang="ts">
import { RouterLink } from 'vue-router'

const menuList: any[] = reactive(
  JSON.parse(localStorage.getItem('user')!)?.menus
)

const showMenu = (i: number) => {
  if (menuList[i].isShow) {
    menuList[i].isShow = !menuList[i].isShow
    return
  }
  menuList[menuList.findIndex(menu => menu.isShow === true)] = false
  menuList[i].isShow = !menuList[i].isShow
}

const showMenuOne = (id: string) => {
  menuList.forEach((menu) => {
    if (menu.children) {
      menu.children.forEach((menuOne: any) => {
        if (menuOne.id === id) menuOne.isShowOne = true
        else menuOne.isShowOne = false
      })
    } else {
      if (menu.id === id) menu.isShowOne = true
      else menu.isShowOne = false
    }
  })
}

onMounted(() => {
  const path = localStorage.getItem('currentPath') || '/homePage'
  menuList.forEach((menu) => {
    if (menu.children) {
      let flag = false
      menu.children.forEach((menuOne: any) => {
        if (menuOne.isShowOne) menuOne.isShowOne = false
        if (menuOne.path && menuOne.path === path) {
          menuOne.isShowOne = true
          flag = true
        }
      })
      if (flag) menu.isShow = true
    } else {
      if (menu.isShowOne) menu.isShowOne = false
      if (menu.path && menu.path === path) menu.isShowOne = true
    }
  })
})
</script>

<template>
  <div
    h-full
    w-full
  >
    <router-link
      rainbow-text
      block
      border
      text-2xl
      font-bold
      text-center
      leading-16
      w-full
      h-16
      to="/homePage"
    >
      折七LOGO
    </router-link>
    <ul
      border
      class="h-[calc(100%-4rem)]"
      select-none
      dark:text-zinc-500
    >
      <li
        v-for="(c1, index) in menuList"
        :key="c1.name"
        w-full
      >
        <RouterLink
          v-if="!c1.children"
          h-10
          w-full
          block
          border-b
          cursor-pointer
          text-center
          leading-10
          border-zinc-300
          :style="{ backgroundColor: c1.isShowOne ? '#00aaff' : '' }"
          :to="c1.path"
          @click="showMenuOne(c1.id)"
        >
          {{ c1.name }}
        </RouterLink>
        <div v-else>
          <div
            cursor-pointer
            bg-zinc-200
            border-b
            border-zinc-300
            h-10
            leading-10
            text-center
            w-full
            @click="showMenu(index)"
          >
            {{ c1.name }}
          </div>
          <ul
            v-if="c1.isShow"
            w-full
          >
            <li
              v-for="c2 in c1.children"
              :key="c2.name"
              h-10
              border-b
              border-zinc-300
              text-center
              leading-10
            >
              <router-link
                :to="c2.path"
                block
                w-full
                h-full
                :style="{ backgroundColor: c2.isShowOne ? '#00aadd' : '' }"
                @click="showMenuOne(c2.id)"
              >
                {{ c2.name }}
              </router-link>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>
