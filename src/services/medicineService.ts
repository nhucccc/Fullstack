import http from '@/utils/http'
import type {
  MedicineDto, CreateMedicineRequest, UpdateMedicineRequest,
  StockImportRequest, StockAdjustRequest, PagedResult, ApiResponse
} from '@/types'

export interface MedicineSearchParams {
  keyword?: string
  category?: string
  activeOnly?: boolean
  page?: number
  pageSize?: number
}

export const medicineService = {
  async getAll(params: MedicineSearchParams = {}): Promise<ApiResponse<PagedResult<MedicineDto>>> {
    const res = await http.get('/medicines', { params: { page: 1, pageSize: 20, ...params } })
    return res.data
  },

  async getById(id: string): Promise<ApiResponse<MedicineDto>> {
    const res = await http.get(`/medicines/${id}`)
    return res.data
  },

  async getCategories(): Promise<ApiResponse<string[]>> {
    const res = await http.get('/medicines/categories')
    return res.data
  },

  async getLowStock(): Promise<ApiResponse<MedicineDto[]>> {
    const res = await http.get('/medicines/low-stock')
    return res.data
  },

  async create(data: CreateMedicineRequest): Promise<ApiResponse<MedicineDto>> {
    const res = await http.post('/medicines', data)
    return res.data
  },

  async update(id: string, data: UpdateMedicineRequest): Promise<ApiResponse<MedicineDto>> {
    const res = await http.put(`/medicines/${id}`, data)
    return res.data
  },

  async delete(id: string): Promise<ApiResponse<void>> {
    const res = await http.delete(`/medicines/${id}`)
    return res.data
  },

  async importStock(id: string, data: StockImportRequest): Promise<ApiResponse<MedicineDto>> {
    const res = await http.post(`/medicines/${id}/import-stock`, data)
    return res.data
  },

  async adjustStock(id: string, data: StockAdjustRequest): Promise<ApiResponse<MedicineDto>> {
    const res = await http.post(`/medicines/${id}/adjust-stock`, data)
    return res.data
  }
}
