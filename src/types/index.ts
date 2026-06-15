// ── Enums ─────────────────────────────────────────────────────────────────────
// Dùng string enum để khớp với API trả về
export enum UserRole {
  Admin   = 'Admin',
  Doctor  = 'Doctor',
  Nurse   = 'Nurse',
  Patient = 'Patient'
}

export enum DispensationStatus {
  Pending            = 'Pending',
  Processing         = 'Processing',
  Dispensed          = 'Dispensed',
  Cancelled          = 'Cancelled',
  PartiallyDispensed = 'PartiallyDispensed'
}

export enum InvoiceStatus {
  Pending  = 'Pending',
  Paid     = 'Paid',
  Cancelled = 'Cancelled',
  Refunded = 'Refunded'
}

export enum PaymentMethod {
  Cash         = 'Cash',
  BankTransfer = 'BankTransfer',
  Card         = 'Card',
  Insurance    = 'Insurance'
}

export enum MedicineUnit {
  Vien = 'Vien',
  Chai = 'Chai',
  Ong  = 'Ong',
  Goi  = 'Goi',
  Hop  = 'Hop',
  Tube = 'Tube',
  Ml   = 'Ml',
  Mg   = 'Mg'
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  password: string
  confirmPassword: string
  fullName: string
  email: string
  phoneNumber?: string
  role: UserRole
  dateOfBirth?: string
  gender?: string
  address?: string
  insuranceNumber?: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  accessTokenExpiry: string
  userId: string
  username: string
  fullName: string
  email: string
  role: UserRole
  roleName: string
}

export interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

// ── User ──────────────────────────────────────────────────────────────────────
export interface UserDto {
  id: string
  username: string
  fullName: string
  email: string
  phoneNumber?: string
  role: UserRole
  roleName: string
  isActive: boolean
  patientCode?: string
  dateOfBirth?: string
  gender?: string
  address?: string
  insuranceNumber?: string
  avatarUrl?: string
  createdAt: string
}

export interface UpdateProfileRequest {
  fullName: string
  email: string
  phoneNumber?: string
  address?: string
  dateOfBirth?: string
  gender?: string
  insuranceNumber?: string
}

// ── Medicine ──────────────────────────────────────────────────────────────────
export interface MedicineDto {
  id: string
  medicineCode: string
  name: string
  activeIngredient: string
  manufacturer?: string
  countryOfOrigin?: string
  unit: MedicineUnit
  unitName: string
  unitDescription?: string
  category?: string
  unitPrice: number
  importPrice: number
  stockQuantity: number
  minimumStock: number
  isLowStock: boolean
  description?: string
  sideEffects?: string
  storageConditions?: string
  requiresPrescription: boolean
  isActive: boolean
  expiryDate?: string
  createdAt: string
}

export interface CreateMedicineRequest {
  name: string
  activeIngredient: string
  unit: MedicineUnit
  unitPrice: number
  importPrice: number
  initialStock: number
  requiresPrescription?: boolean
  manufacturer?: string
  countryOfOrigin?: string
  category?: string
  description?: string
  sideEffects?: string
  storageConditions?: string
  unitDescription?: string
  minimumStock?: number
  expiryDate?: string
}

export interface UpdateMedicineRequest {
  name: string
  activeIngredient: string
  unit: MedicineUnit
  unitPrice: number
  importPrice: number
  manufacturer?: string
  countryOfOrigin?: string
  category?: string
  description?: string
  sideEffects?: string
  storageConditions?: string
  unitDescription?: string
  requiresPrescription: boolean
  minimumStock: number
  expiryDate?: string
}

export interface StockImportRequest {
  quantity: number
  note?: string
  expiryDate?: string
}

export interface StockAdjustRequest {
  newQuantity: number
  reason: string
}

// ── Dispensation ──────────────────────────────────────────────────────────────
export interface DispensationItemDto {
  id: string
  medicineId: string
  medicineName: string
  activeIngredient: string
  quantity: number
  unitPrice: number
  subTotal: number
  dosage?: string
  usage?: string
  durationDays?: number
}

export interface DispensationDto {
  id: string
  dispensationCode: string
  prescriptionId: string
  patientId: string
  patientName: string
  doctorName: string
  diagnosis?: string
  status: DispensationStatus
  statusName: string
  notes?: string
  dispensedAt?: string
  items: DispensationItemDto[]
  totalMedicineCost: number
  createdAt: string
}

export interface CreateDispensationItemRequest {
  medicineId: string
  quantity: number
  dosage?: string
  usage?: string
  durationDays?: number
}

export interface CreateDispensationRequest {
  prescriptionId: string
  patientId: string
  doctorId: string
  patientName: string
  doctorName: string
  diagnosis?: string
  appointmentId?: string
  notes?: string
  items: CreateDispensationItemRequest[]
}

// ── Invoice ───────────────────────────────────────────────────────────────────
export interface InvoiceItemDto {
  id: string
  itemName: string
  itemType: string
  quantity: number
  unitPrice: number
  subTotal: number
  note?: string
}

export interface InvoiceDto {
  id: string
  invoiceCode: string
  patientId: string
  patientName: string
  patientCode?: string
  insuranceNumber?: string
  doctorName?: string
  dispensationId?: string
  appointmentId?: string
  examinationFee: number
  medicineFee: number
  otherFees: number
  discountAmount: number
  insuranceCoverage: number
  totalAmount: number
  status: InvoiceStatus
  statusName: string
  paymentMethod?: PaymentMethod
  paymentMethodName?: string
  paidAt?: string
  notes?: string
  items: InvoiceItemDto[]
  createdAt: string
}

export interface CreateInvoiceRequest {
  patientId: string
  patientName: string
  examinationFee: number
  patientCode?: string
  insuranceNumber?: string
  doctorName?: string
  dispensationId?: string
  appointmentId?: string
  otherFees?: number
  discountAmount?: number
  insuranceCoverage?: number
  notes?: string
}

export interface PayInvoiceRequest {
  paymentMethod: PaymentMethod
}

// ── Pagination ────────────────────────────────────────────────────────────────
export interface PagedResult<T> {
  items: T[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export interface DashboardStats {
  totalMedicines: number
  lowStockCount: number
  todayDispensations: number
  pendingDispensations: number
  pendingInvoices: number
  todayRevenue: number
  monthRevenue: number
  lowStockMedicines: LowStockItem[]
  revenueByDate: RevenueByDate[]
}

export interface LowStockItem {
  id: string
  name: string
  medicineCode: string
  stock: number
  minimumStock: number
}

export interface RevenueByDate {
  date: string
  amount: number
}
