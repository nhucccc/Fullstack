<template>
  <div class="register-page">
    <div class="register-container">
      <div style="text-align:center; margin-bottom: 24px">
        <MedicineBoxOutlined style="font-size: 40px; color: #1890ff" />
        <h2 style="margin: 8px 0 0">Đăng ký tài khoản bệnh nhân</h2>
      </div>

      <a-form :model="form" :rules="rules" layout="vertical" @finish="handleRegister">
        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="Tên đăng nhập" name="username">
              <a-input v-model:value="form.username" placeholder="username" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Họ tên" name="fullName">
              <a-input v-model:value="form.fullName" placeholder="Nguyễn Văn A" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="Email" name="email">
          <a-input v-model:value="form.email" placeholder="email@example.com" />
        </a-form-item>

        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="Mật khẩu" name="password">
              <a-input-password v-model:value="form.password" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Xác nhận mật khẩu" name="confirmPassword">
              <a-input-password v-model:value="form.confirmPassword" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-row :gutter="12">
          <a-col :span="12">
            <a-form-item label="Số điện thoại" name="phoneNumber">
              <a-input v-model:value="form.phoneNumber" placeholder="0901234567" />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="Giới tính" name="gender">
              <a-select v-model:value="form.gender" placeholder="Chọn">
                <a-select-option value="Nam">Nam</a-select-option>
                <a-select-option value="Nữ">Nữ</a-select-option>
                <a-select-option value="Khác">Khác</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="Địa chỉ">
          <a-input v-model:value="form.address" placeholder="Địa chỉ thường trú" />
        </a-form-item>

        <a-form-item label="Số BHYT">
          <a-input v-model:value="form.insuranceNumber" placeholder="Số bảo hiểm y tế" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" html-type="submit" block :loading="authStore.loading" size="large">
            Đăng ký
          </a-button>
        </a-form-item>

        <div style="text-align:center">
          Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UserRole } from '@/types'
import { MedicineBoxOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: '', password: '', confirmPassword: '',
  fullName: '', email: '', phoneNumber: '',
  gender: '', address: '', insuranceNumber: '',
  role: UserRole.Patient
})

const rules: any = {
  username: [{ required: true, min: 3, message: 'Tối thiểu 3 ký tự' }],
  fullName: [{ required: true, message: 'Vui lòng nhập họ tên' }],
  email: [{ required: true, type: 'email', message: 'Email không hợp lệ' }],
  password: [{ required: true, min: 8, message: 'Mật khẩu tối thiểu 8 ký tự' }],
  confirmPassword: [
    { required: true, message: 'Vui lòng xác nhận mật khẩu' },
    {
      validator: (_: any, value: string) =>
        value === form.password ? Promise.resolve() : Promise.reject('Mật khẩu không khớp')
    }
  ]
}

const handleRegister = async () => {
  const ok = await authStore.register({ ...form })
  if (ok) router.push('/app/dashboard')
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}
.register-container {
  background: white; border-radius: 12px;
  padding: 32px; width: 100%; max-width: 560px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
}
</style>
