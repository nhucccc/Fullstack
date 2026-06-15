import http from '@/utils/http'
import type { InvoiceDto, CreateInvoiceRequest, PayInvoiceRequest, PagedResult, ApiResponse } from '@/types'
import type { InvoiceStatus } from '@/types'

export interface InvoiceSearchParams {
  keyword?: string
  status?: InvoiceStatus
  patientId?: string
  from?: string
  to?: string
  page?: number
  pageSize?: number
}

export const invoiceService = {
  async getAll(params: InvoiceSearchParams = {}): Promise<ApiResponse<PagedResult<InvoiceDto>>> {
    const res = await http.get('/invoices', { params: { page: 1, pageSize: 20, ...params } })
    return res.data
  },

  async getById(id: string): Promise<ApiResponse<InvoiceDto>> {
    const res = await http.get(`/invoices/${id}`)
    return res.data
  },

  async create(data: CreateInvoiceRequest): Promise<ApiResponse<InvoiceDto>> {
    const res = await http.post('/invoices', data)
    return res.data
  },

  async pay(id: string, data: PayInvoiceRequest): Promise<ApiResponse<InvoiceDto>> {
    const res = await http.post(`/invoices/${id}/pay`, data)
    return res.data
  },

  async cancel(id: string, reason: string): Promise<ApiResponse<InvoiceDto>> {
    const res = await http.post(`/invoices/${id}/cancel`, { reason })
    return res.data
  },

  async getRevenueReport(from: string, to: string): Promise<ApiResponse<any>> {
    const res = await http.get('/invoices/reports/revenue', { params: { from, to } })
    return res.data
  }
}
