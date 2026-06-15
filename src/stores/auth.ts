import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '@/services/authService'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types'
import { UserRole } from '@/types'
import { message } from 'ant-design-vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthResponse | null>(null)
  const loading = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.role === UserRole.Admin)
  const isDoctor = computed(() => user.value?.role === UserRole.Doctor)
  const isNurse = computed(() => user.value?.role === UserRole.Nurse)
  const isPatient = computed(() => user.value?.role === UserRole.Patient)
  const canManageMedicines = computed(() => user.value?.role === UserRole.Admin || user.value?.role === UserRole.Nurse)
  const canViewFinance = computed(() => user.value?.role === UserRole.Admin || user.value?.role === UserRole.Nurse)

  // Restore from localStorage on init
  const init = () => {
    const stored = localStorage.getItem('user')
    const token = localStorage.getItem('access_token')
    if (stored && token) {
      try {
        const parsed = JSON.parse(stored)
        // Đảm bảo role là đúng string enum
        user.value = parsed as AuthResponse
      } catch {
        localStorage.clear()
      }
    }
  }

  const login = async (data: LoginRequest): Promise<boolean> => {
    loading.value = true
    try {
      const res = await authService.login(data)
      if (res.success && res.data) {
        user.value = res.data
        localStorage.setItem('access_token', res.data.accessToken)
        localStorage.setItem('refresh_token', res.data.refreshToken)
        localStorage.setItem('user', JSON.stringify(res.data))
        message.success(`Chào mừng, ${res.data.fullName}!`)
        return true
      }
      message.error(res.error || 'Đăng nhập thất bại')
      return false
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Lỗi kết nối máy chủ')
      return false
    } finally {
      loading.value = false
    }
  }

  const register = async (data: RegisterRequest): Promise<boolean> => {
    loading.value = true
    try {
      const res = await authService.register(data)
      if (res.success && res.data) {
        user.value = res.data
        localStorage.setItem('access_token', res.data.accessToken)
        localStorage.setItem('refresh_token', res.data.refreshToken)
        localStorage.setItem('user', JSON.stringify(res.data))
        message.success('Đăng ký thành công!')
        return true
      }
      message.error(res.error || 'Đăng ký thất bại')
      return false
    } catch (err: any) {
      message.error(err.response?.data?.error || 'Lỗi kết nối máy chủ')
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch { /* ignore */ }
    user.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  }

  return {
    user, loading, isAuthenticated,
    isAdmin, isDoctor, isNurse, isPatient,
    canManageMedicines, canViewFinance,
    init, login, register, logout
  }
})
