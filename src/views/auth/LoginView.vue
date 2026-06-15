<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <MedicineBoxOutlined style="font-size: 48px; color: #1890ff" />
        <h1>Hệ thống Quản lý Phòng khám</h1>
        <p>Đề tài 05 — Pharmacy &amp; Billing Service</p>
      </div>

      <a-form :model="form" :rules="rules" layout="vertical" @finish="handleLogin">
        <a-form-item label="Tên đăng nhập" name="username">
          <a-input v-model:value="form.username" placeholder="Nhập tên đăng nhập" size="large">
            <template #prefix><UserOutlined /></template>
          </a-input>
        </a-form-item>

        <a-form-item label="Mật khẩu" name="password">
          <a-input-password v-model:value="form.password" placeholder="Nhập mật khẩu" size="large">
            <template #prefix><LockOutlined /></template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary" html-type="submit" size="large" block
            :loading="authStore.loading"
          >
            Đăng nhập
          </a-button>
        </a-form-item>

        <div style="text-align: center">
          Chưa có tài khoản?
          <router-link to="/register"> Đăng ký ngay</router-link>
        </div>
      </a-form>

      <!-- Demo accounts -->
      <a-divider>Tài khoản demo</a-divider>
      <a-space wrap style="justify-content: center">
        <a-button v-for="acc in demoAccounts" :key="acc.username"
          size="small" :type="acc.type as any" @click="fillDemo(acc)">
          {{ acc.label }}
        </a-button>
      </a-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UserOutlined, LockOutlined, MedicineBoxOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = reactive({ username: '', password: '' })

const rules = {
  username: [{ required: true, message: 'Vui lòng nhập tên đăng nhập' }],
  password: [{ required: true, message: 'Vui lòng nhập mật khẩu' }]
}

const demoAccounts = [
  { username: 'admin', password: 'Admin@123', label: 'Admin', type: 'primary' },
  { username: 'nurse1', password: 'Nurse@123', label: 'Y tá', type: 'default' },
  { username: 'doctor1', password: 'Doctor@123', label: 'Bác sĩ', type: 'default' },
  { username: 'patient1', password: 'Patient@123', label: 'Bệnh nhân', type: 'dashed' }
]

const fillDemo = (acc: any) => {
  form.username = acc.username
  form.password = acc.password
}

const handleLogin = async () => {
  const ok = await authStore.login({ username: form.username, password: form.password })
  if (ok) {
    const redirect = route.query.redirect as string || '/dashboard'
    router.push(redirect)
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}
.login-container {
  background: white;
  border-radius: 12px;
  padding: 40px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
.login-header {
  text-align: center;
  margin-bottom: 32px;
}
.login-header h1 {
  margin: 12px 0 4px;
  font-size: 22px;
  color: #001529;
}
.login-header p {
  color: #8c8c8c;
  margin: 0;
}
</style>
