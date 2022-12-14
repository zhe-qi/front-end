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
    ElMessage.success('????????????')
    tableData.value.push(data.data)
  } else {
    ElMessage.error('????????????')
  }
}

const del = (id: number) => {
  if (isNaN(id)) {
    ElMessage.error('????????????')
    return
  }
  request({
    url: `/question/${id}`,
    method: 'delete'
  }).then((data) => {
    if (data.code === 200) {
      ElMessage.success('????????????')
      tableData.value = tableData.value.filter(item => item.id !== id)
    } else {
      ElMessage.error('????????????')
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
      ????????????ID???{{ message.id }}???????????????{{ message.name }}
    </div>
    <div flex space-x-3 items-center my-4>
      <el-button
        @click="router.push('/question')"
      >
        ??????
      </el-button>
      <el-button
        @click="dialogFormVisible = true"
      >
        ??????
      </el-button>
      <el-input
        v-model="search"
        placeholder="???????????????"
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
        label="??????"
        width="180"
      />
      <el-table-column
        label="??????"
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
        label="??????"
      />
      <el-table-column label="??????">
        <template #default="scope">
          <el-button
            type="danger"
            @click="del(+scope.row.id)"
          >
            ??????
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      v-model="dialogFormVisible"
      title="????????????"
    >
      <el-form
        ref="formRef"
        :model="dynamicValidateForm"
        label-width="120px"
        class="demo-dynamic"
      >
        <el-form-item
          label="??????"
          :rules="[
            {
              required: true,
              message: '??????????????????',
              trigger: 'blur'
            }
          ]"
        >
          <el-input
            v-model="dynamicValidateForm.content"
            maxlength="500"
            placeholder="??????????????????"
            show-word-limit
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="?????????">
          <el-input
            v-model="dynamicValidateForm.answer"
            placeholder="??????: A or ABC or ABCD"
          />
        </el-form-item>
        <el-form-item
          v-for="domain in dynamicValidateForm.options"
          :key="domain.key"
          :label="`??????${domain.key}`"
        >
          <div
            flex
            space-x-2
          >
            <el-input
              v-model="domain.value"
              maxlength="200"
              placeholder="??????????????????"
              show-word-limit
              type="textarea"
            />
            <el-button
              class="mt-2"
              @click.prevent="removeDomain(domain)"
            >
              ??????
            </el-button>
          </div>
        </el-form-item>
        <el-form-item>
          <el-button @click="addDomain">
            ?????????
          </el-button>
          <el-button @click="resetForm(formRef)">
            ??????
          </el-button>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">??????</el-button>
          <el-button
            type="primary"
            @click="add"
          >
            ??????
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped></style>
