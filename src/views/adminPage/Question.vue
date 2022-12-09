<script setup lang="ts">
import { useRouter } from 'vue-router'
import request from '@/api'

const router = useRouter()
const data = await request({
  url: '/category',
  method: 'get'
})
const search = ref('')
const res = JSON.parse(JSON.stringify(data.data))
const tableData = ref(res)

watch(search, (val) => {
  if (val.length > 0) {
    tableData.value = res.filter((item: any) => {
      return item.name.includes(val)
    })
  } else {
    tableData.value = res
  }
})

const toQuestionsPage = (id: number) => {
  router.push({
    path: '/questions',
    query: {
      id
    }
  })
}
</script>

<template>
  <div
    pt-19
    px-3
  >
    <el-input
      v-model="search"
      placeholder="请输入题库名称"
      clearable
      class="mt-2 w-50!"
    />
    <el-table
      :data="tableData"
      border
      mx-auto
      mt-5
      style="width: 100%"
    >
      <el-table-column
        label="序号"
        width="180"
      >
        <template #default="{ $index }">
          <span>{{ $index + 1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="题库ID"
        width="180"
      />
      <el-table-column
        prop="name"
        label="题库名称"
        width="180"
      />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="toQuestionsPage(+scope.row.id)">
            跳转
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped></style>
