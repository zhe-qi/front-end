<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import request from '@/api'

const category = ref('')
const search = ref('')
const currentId = ref<number>(0)
const data = await request({
  url: '/category',
  method: 'get'
})
const flag = ref<boolean>(false)
const updateData: {
  id: number
  name: string
} = reactive({
  id: 0,
  name: ''
})
const res = JSON.parse(JSON.stringify(data.data))
const tableData = ref(res)

watch(search, (newVal) => {
  if (newVal.length > 0) {
    const newData = res.filter((item: any) => {
      return item.name.includes(newVal)
    })
    tableData.value = newData
  } else {
    tableData.value = res
  }
})

const dialogVisible = ref(false)
const centerDialogVisible = ref(false)
const addCategory = () => {
  dialogVisible.value = true
}

const add = async() => {
  if (flag.value) {
    await request({
      url: `/category/${updateData.id}/${updateData.name}`,
      method: 'put'
    })
    ElMessage.success('更新成功')
    const data = await request({
      url: '/category',
      method: 'get'
    })
    tableData.value = data.data
    flag.value = false
    dialogVisible.value = false
  } else {
    if (category.value.length < 1) {
      ElMessage.error('请输入分类名称')
      return
    }
    const data = await request({
      url: '/category',
      method: 'post',
      data: {
        name: category.value
      }
    })
    dialogVisible.value = false
    if (!data.data) {
      ElMessage.error('重复添加')
      return
    }
    if (data.code === 200) {
      ElMessage.success('添加成功')
      const data = await request({
        url: '/category',
        method: 'get'
      })
      tableData.value = data.data
    } else {
      ElMessage.error('添加失败')
    }
  }
}

const update = (id: number) => {
  flag.value = true
  dialogVisible.value = true
  updateData.id = id
}

const remove = async(id: number) => {
  centerDialogVisible.value = true
  currentId.value = id
}

const del = async() => {
  centerDialogVisible.value = false
  const res = await request({
    url: `/category/${currentId.value}`,
    method: 'delete'
  })
  const data = await request({
    url: '/category',
    method: 'get'
  })
  tableData.value = data.data
  if (res.code === 200) ElMessage.success('删除成功')
}
</script>

<template>
  <div
    pt-16
    w-full
  >
    <el-button
      type="primary"
      mt-5
      ml-15
      @click="addCategory"
    >
      添加题库
    </el-button>
    <el-input
      v-model="search"
      placeholder="请输入分类名称"
      clearable
      class="mt-5 ml-15"
      style="width: 300px"
    />
    <el-table
      :data="tableData"
      border
      ml-15
      mt-5
      style="width: 90%"
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
          <el-button
            type="warning"
            @click="update(scope.row.id)"
          >
            修改
          </el-button>
          <el-button
            type="danger"
            @click="remove(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogVisible"
      :title="flag ? '修改题库' : '添加题库'"
      width="30%"
    >
      <span>
        <label for="category">{{ flag ? '修改名称：' : '题库名称：' }}</label>
        <input
          v-if="flag"
          v-model="updateData.name"
          type="text"
          placeholder="请输入修改后的名称"
          border
          border-2
          rounded-lg
        >
        <input
          v-else
          id="category"
          v-model="category"
          type="text"
          autocomplete="off"
          required
          placeholder="请输入分类名称"
          border
          border-2
          rounded-lg
        >
      </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click=";(dialogVisible = false), (flag = false)">取消</el-button>
          <el-button
            type="primary"
            @click="add"
          >
            添加
          </el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      v-model="centerDialogVisible"
      title="Warning"
      width="30%"
      center
    >
      <span> 确定删除吗？ </span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="del"
          >
            删除
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
