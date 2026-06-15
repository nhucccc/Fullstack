import http from '@/utils/http'
import type { UserDto, UpdateProfileRequest, PagedResult, ApiResponse } from '@/types'
import type { UserRole } from '@/types'

export interface UserSearchParams {
  keyword?: string
  role?: UserRole
  isActive?: boolean
  page?: number
  pageSize?: number
}

export const userService = {
  async getAll(params: UserSearchParams = {}): Promise<ApiResponse<PagedResult<UserDto>>> {
    const res = await http.get('/users', { params: { page: 1, pageSize: 20, ...params } })
    return res.data
  },

  async getById(id: string): Promise<ApiResponse<UserDto>> {
    const res = await http.get(`/users/${id}`)
    return res.data
  },

  async updateMyProfile(data: UpdateProfileRequest): Promise<ApiResponse<UserDto>> {
    const res = await http.put('/users/me', data)
    return res.data
  },

  async updateProfile(id: string, data: UpdateProfileRequest): Promise<ApiResponse<UserDto>> {
    const res = await http.put(`/users/${id}`, data)
    return res.data
  },

  async toggleActive(id: string): Promise<ApiResponse<void>> {
    const res = await http.post(`/users/${id}/toggle-active`)
    return res.data
  }
}
