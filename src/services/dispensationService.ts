import http from '@/utils/http'
import type { DispensationDto, CreateDispensationRequest, PagedResult, ApiResponse } from '@/types'
import type { DispensationStatus } from '@/types'

export interface DispensationSearchParams {
  keyword?: string
  status?: DispensationStatus
  from?: string
  to?: string
  page?: number
  pageSize?: number
}

export const dispensationService = {
  async getAll(params: DispensationSearchParams = {}): Promise<ApiResponse<PagedResult<DispensationDto>>> {
    const res = await http.get('/dispensations', { params: { page: 1, pageSize: 20, ...params } })
    return res.data
  },

  async getById(id: string): Promise<ApiResponse<DispensationDto>> {
    const res = await http.get(`/dispensations/${id}`)
    return res.data
  },

  async create(data: CreateDispensationRequest): Promise<ApiResponse<DispensationDto>> {
    const res = await http.post('/dispensations', data)
    return res.data
  },

  async process(id: string): Promise<ApiResponse<DispensationDto>> {
    const res = await http.post(`/dispensations/${id}/process`)
    return res.data
  },

  async cancel(id: string, reason: string): Promise<ApiResponse<DispensationDto>> {
    const res = await http.post(`/dispensations/${id}/cancel`, { reason })
    return res.data
  }
}
