<script setup lang="ts">
import { ElMessage, FormInstance } from 'element-plus'
import request from '@/api'

const ruleFormRef = ref<FormInstance>()

// 表单数据
const ruleForm = reactive({
  username: '',
  password: '',
  DeterminePassword: ''
})

// 验证用户名格式
const validateUsername = (_rule: any, _value: any, callback: any) => {
  if (ruleForm.username === '') callback(new Error('Please input the username'))
  else if (ruleForm.username.length > 18)
    callback(new Error('The username is too long'))
  else callback()
}

// 验证密码格式
const validatePassword = (_rule: any, _value: any, callback: any) => {
  if (ruleForm.password === '') callback(new Error('Please input the password'))
  else if (ruleForm.username.length > 18)
    callback(new Error('The password is too long'))
  else callback()
}

// 添加规则
const rules = reactive({
  pass: [{ validator: validatePassword, trigger: 'blur' }],
  username: [{ validator: validateUsername, trigger: 'blur' }],
  determinePassword: [{ validator: validatePassword, trigger: 'blur' }]
})

// 提交表单
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async(valid) => {
    if (valid) {
      if (ruleForm.password !== ruleForm.DeterminePassword) {
        ElMessage.error('两次密码不一致')
        return
      }

      const data = await request({
        url: '/users/create',
        method: 'post',
        data: {
          username: ruleForm.username,
          password: ruleForm.password
        }
      })
      if (data.data && data.code === 200)
        ElMessage.success('注册成功')
      else ElMessage.error('用户名已存在')
    }
  })
}

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>

<template>
  <h2
    rainbow-text
    h-30
    text-center
    leading-30
    text-4xl
    font-bold
    tracking-widest
  >
    在线题库系统
  </h2>
  <div
    class="h-[calc(100%-7.5rem)]"
    flex
    justify-center
    w-full
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      status-icon
      :rules="rules"
      label-width="100px"
      class="demo-ruleForm"
      w-80
      h-40
      @keyup.enter="submitForm(ruleFormRef)"
    >
      <el-form-item
        label="账号："
        prop="checkPass"
      >
        <el-input
          v-model="ruleForm.username"
          type="text"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="密码："
        prop="pass"
      >
        <el-input
          v-model="ruleForm.password"
          type="password"
          autocomplete="off"
        />
      </el-form-item>
      <el-form-item
        label="再次输入："
        prop="pass"
      >
        <el-input
          v-model="ruleForm.DeterminePassword"
          type="password"
          autocomplete="off"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm(ruleFormRef)"
        >
          注册
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">
          重置
        </el-button>
        <router-link
          to="/login"
          text-zinc-400
          hover:text-blue-3
          hover:underline
          h-5
          ml-5
        >
          返回登录
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>
