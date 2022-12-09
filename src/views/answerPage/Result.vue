<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAside } from '@/store/useUtils'

const router = useRouter()
const store = useAside()
</script>

<template>
  <div
    pt-16
    px-3
  >
    <el-button mt-5 @click="router.push('/homePage')">
      退回首页
    </el-button>
    <p
      mt-5
      prose
      text-xl
    >
      你当前分数为：
      <span
        text-2xl
        text-red-500
      >
        {{ store.res.grade }}
      </span>
    </p>

    <h3
      text-2xl
      font-800
      mt-10
    >
      题目列表：
    </h3>
    <ul>
      <li v-for="item, index in store.res.data" :key="item.id" text-zinc-500 mt-5>
        <p prose :style="{ color: item.scale !== item.grade ? 'red' : 'springgreen' }">
          {{ index + 1 }}. {{ item.content }}
        </p>
        <div mt-3>
          <div
            v-for="op in item.options"
            :key="op.key"
            :style="{ color: item.answer.toLowerCase().includes(op.key.toLowerCase()) ? 'darkViolet' : '' }"
          >
            {{ op.key }}: {{ op.value }}
          </div>
        </div>
        <div text-red-300>
          你的答案：{{ item.currentAnswer.join('').toUpperCase() }} &nbsp;&nbsp;&nbsp; <span text-blue-300>你当前题的分数：{{ item.grade }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped></style>
