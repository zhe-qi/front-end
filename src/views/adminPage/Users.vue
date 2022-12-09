<script setup lang="ts">
import { ElMessage } from 'element-plus'
import request from '@/api'

interface User {
  id: number
  username: string
  role: string
}

const data = await request({
  url: '/users',
  method: 'get'
})

const res = JSON.parse(JSON.stringify(data.data))
const tableData = ref<User[]>(res)
const search = ref('')
const dialogVisible = ref<boolean>(false)
const userId = ref<number>(0)

// 搜索应该后端，前端做分页，但是为了方便，就前端做了，主要是没多少数据，正常情况下肯定不是这样的
watch(search, (newVal) => {
  if (newVal.length > 0) {
    const newData = res.filter((item: User) => {
      return item.username.includes(newVal)
    })
    tableData.value = newData
  } else {
    tableData.value = res
  }
})

const handleEdit = async(id: number) => {
  userId.value = id
  dialogVisible.value = true
}

const deleteUser = async() => {
  const res = await request({
    url: `/users/${userId.value}`,
    method: 'delete'
  })
  if (res.code === 200) ElMessage.success('删除成功')
  else ElMessage.error('删除失败')
  const data = await request({
    url: '/users',
    method: 'get'
  })
  tableData.value = data.data
  dialogVisible.value = false
}
</script>

<template>
  <div pt-16 px-5>
    <el-input
      v-model="search"
      placeholder="请输入用户名"
      clearable
      style="width: 200px"
      class="mb-5 mt-7 ml-3"
    />
    <el-table
      :data="tableData"
      border
      mt-3
      mx-3
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
        label="用户ID"
        width="180"
      />
      <el-table-column
        prop="username"
        label="用户名"
        width="180"
      />
      <el-table-column
        prop="role"
        label="角色"
        width="180"
      />
      <el-table-column
        prop=""
        label="操作"
      >
        <template #default="scoped">
          <el-button
            v-if="!scoped.row.role.includes('ADMIN')"
            type="danger"
            @click="handleEdit(scoped.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogVisible"
      title="确认删除"
      width="30%"
    >
      <span>确定删除ID为{{ userId }}的用户吗</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="deleteUser"
          >
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
