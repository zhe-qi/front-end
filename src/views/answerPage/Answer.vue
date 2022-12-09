<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAside } from '@/store/useUtils'
import request from '@/api'

import type { Question } from './types'

const router = useRouter()
const store = useAside()
const { examQuery } = storeToRefs(store)

const { data: res } = await request({
  url: `/question/${examQuery.value.type}/${examQuery.value.num}`,
  method: 'get'
})

const data = reactive<Question[]>(
  res.map((item: Question) => {
    return {
      ...item,
      options: (
        JSON.parse(item.options as unknown as string) as {
          key: string
          value: string
          isShow: boolean
        }[]
      ).map((op) => {
        return {
          ...op,
          isShow: false
        }
      }),
      currentAnswer: [],
      bg: '',
      scale: Math.floor(100 / res.length),
      grade: 0
    }
  })
)

const submit = () => {
  data.forEach((item) => {
    item.currentAnswer = item.currentAnswer
      .sort()
      .join('')
      .toLowerCase()
      .split('')
      .filter(k => k !== ' ')
    item.answer = item.answer
      .split('')
      .filter(k => k !== ' ')
      .sort()
      .join('')
      .toLocaleLowerCase()
    let count = 0
    let flag = true
    if (item.answer.length < 2) {
      if (item.answer[0] === item.currentAnswer[0] && item.currentAnswer.length < 2) item.grade = item.scale
    } else {
      item.currentAnswer.forEach((k) => {
        if (item.answer.includes(k)) count++
        else flag = false
      })
      // 分数计算，当前题在100分的占比分数乘以当前多选题目正确率
      if (flag) {
        item.grade
          = Math.floor(item.scale * (Math.floor((count / item.answer.length) * 100) / 100))
      }
    }
  })
  const grade = data.reduce((pre, cur) => pre + cur.grade, 0)
  store.setRes(grade, data)
  router.replace('/result')
  store.detailWidth = 200
}

// 简易计时器，安全和持久化都比较low但是写需要时间，应该与后端建立socket连接
const time = ref(0)
const timer = setInterval(() => {
  time.value++
}, 1000)
watchEffect(() => {
  if (time.value === 300) {
    clearInterval(timer)
    submit()
    router.replace('/result')
  }
})
onBeforeUnmount(() => {
  clearInterval(timer)
})
const resTime = computed(() => {
  const min = Math.floor(time.value / 60)
  const sec = time.value % 60
  return `${min < 10 ? `0${min}` : min}:${sec < 10 ? `0${sec}` : sec}`
})

store.detailWidth = 0

const current = reactive<{
  index: number
  question: Question
}>({
  index: 0,
  question: data[0]
})

data[0].bg = 'skyblue'

const check = (i: number) => {
  current.index = i
  current.question = data[i]
  // 可优化，直接对上一次操作就行了，这里省一点时间，反正数据量不大，性能损耗较低
  data.forEach((item) => {
    if (item.options.some(op => op.isShow))
      item.bg = 'rgba(147, 197, 253, 0.5)'
    else item.bg = ''
  })
  data[i].bg = 'skyblue'
}

const changeOp = (key: string) => {
  const index = data[current.index].currentAnswer.findIndex(
    item => item === key
  )
  if (index === -1) {
    data[current.index].currentAnswer.push(key)
    data[current.index].options.find(item => item.key === key)!.isShow = true
  } else {
    data[current.index].currentAnswer.splice(index, 1)
    data[current.index].options.find(item => item.key === key)!.isShow = false
  }
}
</script>

<template>
  <div
    pt-16
    w-full
    h-full
  >
    <div
      w-full
      h-full
      flex
    >
      <div
        class="w-1/6"
        border
        p-5
      >
        <ul
          w-full
          grid
          gap-3
          grid-cols-4
        >
          <li
            v-for="(item, index) in data"
            :key="item.id"
            :style="{
              backgroundColor: item.bg
            }"
            border-2
            border-black
            w-7
            h-7
            cursor-pointer
            text-center
            @click="check(index)"
          >
            {{ index + 1 }}
          </li>
        </ul>
        <el-button
          color="#626aef"
          :dark="isDark"
          w-40
          mt-30
          @click="router.replace('/homePage')"
        >
          退出答题
        </el-button>
      </div>
      <div
        class="w-2/3"
        border
      >
        <div p-5>
          <p
            prose
            mb-10
          >
            {{ current.index + 1 }}.
            {{ current.question.content }}
          </p>
          <div
            v-for="(item, index) in current.question.options"
            :key="index"
            :style="{
              backgroundColor: item.isShow ? 'rgba(147, 197, 253, 1)' : ''
            }"
            hover:bg-blue-300
            cursor-pointer
            mt-1
            @click="changeOp(item.key)"
          >
            {{ item.key }} : {{ item.value }}
          </div>
        </div>
      </div>
      <div
        class="w-1/6"
        border
        flex
        flex-col
        items-center
      >
        <div
          w-40
          h-20
          border
        >
          <p
            prose
            text-center
            leading-20
          >
            {{ resTime }}
          </p>
        </div>
        <el-button
          color="#626aef"
          :dark="isDark"
          w-40
          mt-10
          @click="submit"
        >
          提交
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
