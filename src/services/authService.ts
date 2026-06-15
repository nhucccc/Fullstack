import http from '@/utils/http'
import type { LoginRequest, RegisterRequest, AuthResponse, ChangePasswordRequest, ApiResponse } from '@/types'

export const authService = {
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const res = await http.post('/auth/login', data)
    return res.data
  },

  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const res = await http.post('/auth/register', data)
    return res.data
  },

  async registerPatient(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const res = await http.post('/auth/register/patient', data)
    return res.data
  },

  async refresh(accessToken: string, refreshToken: string): Promise<ApiResponse<AuthResponse>> {
    const res = await http.post('/auth/refresh', { accessToken, refreshToken })
    return res.data
  },

  async logout(): Promise<void> {
    await http.post('/auth/logout')
  },

  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse<void>> {
    const res = await http.post('/auth/change-password', data)
    return res.data
  },

  async getMe(): Promise<ApiResponse<any>> {
    const res = await http.get('/auth/me')
    return res.data
  }
}
