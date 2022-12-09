<script setup lang="ts">
import { ElMessage, FormInstance } from 'element-plus'
import { useRouter } from 'vue-router'
import { useUserPermission } from '@/store/useUserPermission'
import { resetRouter } from '@/router'
import request from '@/api'

const router = useRouter()
const store = useUserPermission()
const ruleFormRef = ref<FormInstance>()

// 表单数据
const ruleForm = reactive({
  username: '',
  password: ''
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
  checkPass: [{ validator: validateUsername, trigger: 'blur' }]
})

// 提交表单
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async(valid) => {
    if (valid) {
      const data = await request({
        url: '/auth/login',
        method: 'post',
        data: ruleForm
      })

      if (data.code !== 200) {
        ElMessage.error('账号或密码错误')
        return
      }

      const { access_token: token, role: roleData, id, username } = data.data
      const role = roleData.toLowerCase()

      resetRouter() // 重置路由

      // 动态添加路由
      store.generateRoutes(role)

      // 存储token
      localStorage.setItem('token', token)

      // 存储用户角色字符串
      sessionStorage.setItem('userPermissions', role)
      sessionStorage.setItem('userId', id)
      sessionStorage.setItem('username', username)
      // 跳转到首页
      router.replace('/homePage')
      // 存储菜单
      store.setUserAndMenu(role)
      ElMessage({
        showClose: true,
        message: '登录成功',
        type: 'success'
      })
      return true
    } else {
      ElMessage.error('登录失败')
      return false
    }
  })
}

// 重置表单
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
  ruleForm.username = ''
  ruleForm.password = ''
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
      label-width="70px"
      class="demo-ruleForm"
      w-70
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

      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm(ruleFormRef)"
        >
          登录
        </el-button>
        <el-button @click="resetForm(ruleFormRef)">
          重置
        </el-button>
        <router-link
          to="/register"
          text-zinc-400
          hover:text-blue-3
          hover:underline
          h-5
          ml-5
        >
          注册
        </router-link>
      </el-form-item>
    </el-form>
  </div>
</template>
