<template>
  <div>
    <a-page-header title="Hồ sơ cá nhân" />
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card>
          <div style="text-align:center; padding: 16px">
            <a-avatar :size="80" :style="{ backgroundColor: '#1890ff', fontSize: '32px' }">
              {{ authStore.user?.fullName?.charAt(0) }}
            </a-avatar>
            <h2 style="margin:12px 0 4px">{{ authStore.user?.fullName }}</h2>
            <a-tag :color="getRoleColor(authStore.user?.role ?? 4)">{{ authStore.user?.roleName }}</a-tag>
            <p style="color:#8c8c8c; margin-top:8px">{{ authStore.user?.email }}</p>
          </div>
        </a-card>

        <a-card title="Đổi mật khẩu" style="margin-top:16px">
          <a-form :model="pwdForm" layout="vertical" @finish="handleChangePassword">
            <a-form-item label="Mật khẩu hiện tại"><a-input-password v-model:value="pwdForm.currentPassword" /></a-form-item>
            <a-form-item label="Mật khẩu mới"><a-input-password v-model:value="pwdForm.newPassword" /></a-form-item>
            <a-form-item label="Xác nhận mật khẩu"><a-input-password v-model:value="pwdForm.confirmPassword" /></a-form-item>
            <a-button type="primary" html-type="submit" block :loading="pwdLoading">Đổi mật khẩu</a-button>
          </a-form>
        </a-card>
      </a-col>

      <a-col :span="16">
        <a-card title="Thông tin cá nhân">
          <a-form :model="profileForm" layout="vertical" @finish="handleUpdateProfile">
            <a-row :gutter="12">
              <a-col :span="12"><a-form-item label="Họ tên"><a-input v-model:value="profileForm.fullName" /></a-form-item></a-col>
              <a-col :span="12"><a-form-item label="Email"><a-input v-model:value="profileForm.email" /></a-form-item></a-col>
              <a-col :span="12"><a-form-item label="Số điện thoại"><a-input v-model:value="profileForm.phoneNumber" /></a-form-item></a-col>
              <a-col :span="12">
                <a-form-item label="Giới tính">
                  <a-select v-model:value="profileForm.gender" allow-clear>
                    <a-select-option value="Nam">Nam</a-select-option>
                    <a-select-option value="Nữ">Nữ</a-select-option>
                    <a-select-option value="Khác">Khác</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="24"><a-form-item label="Địa chỉ"><a-input v-model:value="profileForm.address" /></a-form-item></a-col>
              <a-col :span="12"><a-form-item label="Số BHYT"><a-input v-model:value="profileForm.insuranceNumber" /></a-form-item></a-col>
            </a-row>
            <a-button type="primary" html-type="submit" :loading="profileLoading">Lưu thay đổi</a-button>
          </a-form>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/services/userService'
import { authService } from '@/services/authService'
import { getRoleColor } from '@/utils/format'
import { message } from 'ant-design-vue'

const authStore = useAuthStore()
const profileLoading = ref(false)
const pwdLoading = ref(false)

const profileForm = reactive({
  fullName: '', email: '', phoneNumber: '', address: '', gender: '', insuranceNumber: ''
})

const pwdForm = reactive({ currentPassword: '', newPassword: '', confirmPassword: '' })

const handleUpdateProfile = async () => {
  profileLoading.value = true
  try {
    const res = await userService.updateMyProfile({ ...profileForm })
    if (res.success) message.success('Cập nhật thành công!')
    else message.error(res.error)
  } finally { profileLoading.value = false }
}

const handleChangePassword = async () => {
  if (pwdForm.newPassword !== pwdForm.confirmPassword) { message.error('Mật khẩu không khớp'); return }
  pwdLoading.value = true
  try {
    const res = await authService.changePassword({ ...pwdForm })
    if (res.success) { message.success('Đổi mật khẩu thành công!'); Object.assign(pwdForm, { currentPassword: '', newPassword: '', confirmPassword: '' }) }
    else message.error(res.error)
  } finally { pwdLoading.value = false }
}

onMounted(() => {
  const u = authStore.user
  if (u) {
    profileForm.fullName = u.fullName
    profileForm.email = u.email
  }
})
</script>
