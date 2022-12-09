<script setup lang="ts">
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import request from '@/api'
import { useAside } from '@/store/useUtils'
import { option, option1 } from './echartsOp'

const store = useAside()
const router = useRouter()
const { width } = useWindowSize()
const swiperWidth = computed(() => `${Math.floor(width.value / 3)}px`)
store.detailWidth = 200

const data = await request({
  url: '/category',
  method: 'get'
})
const tableData = ref(data.data)
const form = reactive({
  type: tableData.value[0].name,
  num: 10
})

const submitForm = async() => {
  store.setExam(form.type, form.num)
  router.replace('/answer')
}

const myEcharts = ref<HTMLElement | null>(null)
const myEcharts2 = ref<HTMLElement | null>(null)
onMounted(() => {
  const myChart = echarts.init(myEcharts.value as HTMLElement)
  myChart.setOption(option)
  const myChart2 = echarts.init(myEcharts2.value as HTMLElement)
  myChart2.setOption(option1)
})
const value2 = ref(null)
const colors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])
const imgList = reactive([
  '/images/1.png',
  '/images/2.png',
  '/images/3.png',
  '/images/4.png',
  '/images/5.png',
  '/images/6.png'
])
</script>

<template>
  <div
    pt-16
    mx-3
    h-300
    dark:text-zinc-300
  >
    <div
      w-full
      h-60
      mt-3
    >
      <h1
        text-6xl
        font-800
        rainbow-text
        text-center
        w-full
        mt-10
      >
        在线题库平台(系统)
      </h1>
      <div
        flex
        space-x-2xl
        justify-center
        mt-20
      >
        <div>
          <label for="type">题目类型: </label>
          <select
            id="type"
            v-model="form.type"
            border
          >
            <option
              v-for="item in tableData"
              :key="item.id"
              :value="item.name"
            >
              {{ item.name }}
            </option>
          </select>
        </div>
        <div>
          <label for="difficulty">难度: </label>
          <select
            id="difficulty"
            border
          >
            <option value="easy">
              简单
            </option>
            <option value="medium">
              中等
            </option>
            <option value="hard">
              困难
            </option>
          </select>
        </div>
        <div title="超出题库题目数返回全部">
          <label for="num">数量: </label>
          <input
            id="num"
            v-model="form.num"
            type="number"
            border
          >
        </div>
        <div>
          <el-button
            type="primary"
            @click="submitForm"
          >
            生成题目
          </el-button>
        </div>
      </div>
    </div>
    <div
      flex
      border
      rounded-xl
      overflow-hidden
    >
      <div
        ref="myEcharts"
        class="w-1/2 h-100"
        border-r
      />
      <div
        ref="myEcharts2"
        class="w-1/2 h-100"
      />
    </div>
    <div w-full flex>
      <div
        class="demo-rate-block w-1/2 mt-5"
        border
        text-center
      >
        <div class="demonstration">
          您对本题库满意吗
        </div>
        <br>
        <el-rate
          v-model="value2"
          :colors="colors"
        />
      </div>
      <el-carousel
        class="w-1/2"
        mt-5
        :interval="4000"
        type="card"
        :height="swiperWidth"
      >
        <el-carousel-item
          v-for="item in imgList"
          :key="item"
        >
          <img :src="item" alt="none">
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>
