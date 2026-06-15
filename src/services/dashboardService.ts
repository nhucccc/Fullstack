import http from '@/utils/http'
import type { DashboardStats, ApiResponse } from '@/types'

export const dashboardService = {
  async getStats(): Promise<ApiResponse<DashboardStats>> {
    const res = await http.get('/dashboard')
    return res.data
  }
}
