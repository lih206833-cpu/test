<template>
  <div class="login-page">
    <el-card class="login-card">
      <template #header>
        <span>{{ isRegister ? '注册' : '登录' }}</span>
      </template>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="80px"
        @submit.prevent="handleSubmit"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="请输入密码（至少6位）"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            {{ isRegister ? '注册' : '登录' }}
          </el-button>
          <el-button @click="toggleMode">
            {{ isRegister ? '去登录' : '去注册' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useUserStore } from '../stores/user.js'
import { login, register } from '../api/user.js'

const router = useRouter()
const userStore = useUserStore()

const isRegister = ref(false)
const loading = ref(false)
const formRef = ref(null)

const form = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少6位', trigger: 'blur' }
  ]
}

const toggleMode = () => {
  isRegister.value = !isRegister.value
}

const handleSubmit = async () => {
  await formRef.value?.validate()
  loading.value = true
  try {
    const api = isRegister.value ? register : login
    const res = await api(form)
    userStore.setAuth(res.data)
    ElMessage.success(isRegister.value ? '注册成功' : '登录成功')
    router.push('/tasks')
  } catch (err) {
    const msg = err.response?.data?.message || '操作失败'
    ElMessage.error(msg)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-card {
  width: 400px;
}
</style>
