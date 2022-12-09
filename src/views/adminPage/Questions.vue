<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import request from '@/api'
import type { FormInstance } from 'element-plus'

interface Questions {
  categoryId: number
  id: number
  content: string
  options: string
}

interface Question {
  id: number
  name: string
  questions: Questions[]
}

interface CreateQuestion {
  content: string
  options: { key: string; value: string }[]
  categoryId: number
  answer: string
}

const route = useRoute()
const router = useRouter()
const dialogFormVisible = ref(false)
const id = ref<number>(+route.query.id!)
const tableData = ref<Questions[]>([])
const message = ref<{ id: number; name: string }>({ id: 0, name: '' })
const search = ref('')
const res = ref<any[]>([])

if (!id.value) {
  router.push('/question')
} else {
  const data: { data: Question } = await request({
    url: `/category/${id.value}`,
    method: 'get'
  })
  tableData.value = data.data.questions
  res.value = JSON.parse(JSON.stringify(data.data.questions))
  message.value = {
    id: data.data.id,
    name: data.data.name
  }
}

watch(search, (val) => {
  if (val.length > 0) {
    tableData.value = res.value.filter((item) => {
      return item.content.includes(val)
    })
  } else {
    tableData.value = res.value
  }
})

const formRef = ref<FormInstance>()
const dynamicValidateForm = reactive<CreateQuestion>({
  content: '',
  options: [],
  categoryId: id.value,
  answer: ''
})

const removeDomain = (item: { key: string; value: string }) => {
  const index = dynamicValidateForm.options.indexOf(item)
  if (index !== -1) dynamicValidateForm.options.splice(index, 1)
}

const addDomain = () => {
  dynamicValidateForm.options.push({
    key: String.fromCharCode(65 + dynamicValidateForm.options.length),
    value: ''
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

const add = async() => {
  dialogFormVisible.value = false
  const { categoryId, content, options, answer } = dynamicValidateForm
  const data = await request({
    url: '/question',
    method: 'post',
    data: {
      categoryId,
      content,
      options: JSON.stringify(options),
      answer
    }
  })
  if (data.code) {
    ElMessage.success('添加成功')
    tableData.value.push(data.data)
  } else {
    ElMessage.error('添加失败')
  }
}

const del = (id: number) => {
  if (isNaN(id)) {
    ElMessage.error('删除失败')
    return
  }
  request({
    url: `/question/${id}`,
    method: 'delete'
  }).then((data) => {
    if (data.code === 200) {
      ElMessage.success('删除成功')
      tableData.value = tableData.value.filter(item => item.id !== id)
    } else {
      ElMessage.error('删除失败')
    }
  })
}
</script>

<template>
  <div
    pt-16
    px-10
  >
    <div mt-5>
      当前题库ID是{{ message.id }}，题库名：{{ message.name }}
    </div>
    <div flex space-x-3 items-center my-4>
      <el-button
        @click="router.push('/question')"
      >
        返回
      </el-button>
      <el-button
        @click="dialogFormVisible = true"
      >
        添加
      </el-button>
      <el-input
        v-model="search"
        placeholder="请输入题目"
        clearable
        class="w-50!"
      />
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%"
    >
      <el-table-column
        prop="content"
        label="题目"
        width="180"
      />
      <el-table-column
        label="选项"
        width="180"
      >
        <template #default="scope">
          <div
            v-for="item in JSON.parse(scope.row.options)"
            :key="item.key"
          >
            {{ item.key }}: {{ item.value }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="answer"
        label="答案"
      />
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
            type="danger"
            @click="del(+scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogFormVisible"
      title="添加题目"
    >
      <el-form
        ref="formRef"
        :model="dynamicValidateForm"
        label-width="120px"
        class="demo-dynamic"
      >
        <el-form-item
          label="题目"
          :rules="[
            {
              required: true,
              message: '题目不能为空',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="dynamicValidateForm.content"
            maxlength="500"
            placeholder="输入当前题目"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="答案：">
          <el-input
            v-model="dynamicValidateForm.answer"
            placeholder="格式: A or ABC or ABCD"
          />
        </el-form-item>
        <el-form-item
          v-for="domain in dynamicValidateForm.options"
          :key="domain.key"
          :label="`选项${domain.key}`"
        >
          <div
            flex
            space-x-2
          >
            <el-input
              v-model="domain.value"
              maxlength="200"
              placeholder="输入选项内容"
              show-word-limit
              type="textarea"
            />
            <el-button
              class="mt-2"
              @click.prevent="removeDomain(domain)"
            >
              删除
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="addDomain">
            新选项
          </el-button>
          <el-button @click="resetForm(formRef)">
            重置
          </el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button
            type="primary"
            @click="add"
          >
            添加
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
