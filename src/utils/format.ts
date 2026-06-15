import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import { DispensationStatus, InvoiceStatus, PaymentMethod, UserRole, MedicineUnit } from '@/types'

dayjs.locale('vi')

export const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

export const formatDate = (date?: string | null): string =>
  date ? dayjs(date).format('DD/MM/YYYY') : '—'

export const formatDateTime = (date?: string | null): string =>
  date ? dayjs(date).format('DD/MM/YYYY HH:mm') : '—'

export const formatDateTimeSecond = (date?: string | null): string =>
  date ? dayjs(date).format('DD/MM/YYYY HH:mm:ss') : '—'

export const getRoleLabel = (role: UserRole): string => {
  const map: Record<UserRole, string> = {
    [UserRole.Admin]: 'Quản trị viên',
    [UserRole.Doctor]: 'Bác sĩ',
    [UserRole.Nurse]: 'Y tá / Tiếp tân',
    [UserRole.Patient]: 'Bệnh nhân'
  }
  return map[role] ?? 'Không xác định'
}

export const getRoleColor = (role: UserRole): string => {
  const map: Record<UserRole, string> = {
    [UserRole.Admin]: 'red',
    [UserRole.Doctor]: 'blue',
    [UserRole.Nurse]: 'green',
    [UserRole.Patient]: 'orange'
  }
  return map[role] ?? 'default'
}

export const getDispensationStatusLabel = (status: DispensationStatus): string => {
  const map: Record<DispensationStatus, string> = {
    [DispensationStatus.Pending]: 'Chờ xử lý',
    [DispensationStatus.Processing]: 'Đang xử lý',
    [DispensationStatus.Dispensed]: 'Đã xuất thuốc',
    [DispensationStatus.Cancelled]: 'Đã hủy',
    [DispensationStatus.PartiallyDispensed]: 'Xuất một phần'
  }
  return map[status] ?? 'Không xác định'
}

export const getDispensationStatusColor = (status: DispensationStatus): string => {
  const map: Record<DispensationStatus, string> = {
    [DispensationStatus.Pending]: 'orange',
    [DispensationStatus.Processing]: 'blue',
    [DispensationStatus.Dispensed]: 'green',
    [DispensationStatus.Cancelled]: 'red',
    [DispensationStatus.PartiallyDispensed]: 'purple'
  }
  return map[status] ?? 'default'
}

export const getInvoiceStatusLabel = (status: InvoiceStatus): string => {
  const map: Record<InvoiceStatus, string> = {
    [InvoiceStatus.Pending]: 'Chờ thanh toán',
    [InvoiceStatus.Paid]: 'Đã thanh toán',
    [InvoiceStatus.Cancelled]: 'Đã hủy',
    [InvoiceStatus.Refunded]: 'Đã hoàn tiền'
  }
  return map[status] ?? 'Không xác định'
}

export const getInvoiceStatusColor = (status: InvoiceStatus): string => {
  const map: Record<InvoiceStatus, string> = {
    [InvoiceStatus.Pending]: 'orange',
    [InvoiceStatus.Paid]: 'green',
    [InvoiceStatus.Cancelled]: 'red',
    [InvoiceStatus.Refunded]: 'purple'
  }
  return map[status] ?? 'default'
}

export const getPaymentMethodLabel = (method?: PaymentMethod): string => {
  if (!method) return '—'
  const map: Record<PaymentMethod, string> = {
    [PaymentMethod.Cash]: 'Tiền mặt',
    [PaymentMethod.BankTransfer]: 'Chuyển khoản',
    [PaymentMethod.Card]: 'Thẻ',
    [PaymentMethod.Insurance]: 'Bảo hiểm y tế'
  }
  return map[method] ?? 'Không xác định'
}

export const getMedicineUnitLabel = (unit: MedicineUnit): string => {
  const map: Record<MedicineUnit, string> = {
    [MedicineUnit.Vien]: 'Viên',
    [MedicineUnit.Chai]: 'Chai',
    [MedicineUnit.Ong]: 'Ống',
    [MedicineUnit.Goi]: 'Gói',
    [MedicineUnit.Hop]: 'Hộp',
    [MedicineUnit.Tube]: 'Tuýp',
    [MedicineUnit.Ml]: 'ml',
    [MedicineUnit.Mg]: 'mg'
  }
  return map[unit] ?? 'Không xác định'
}
