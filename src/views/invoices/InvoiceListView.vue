<template>
  <div>
    <a-page-header title="Hóa đơn viện phí">
      <template #extra>
        <a-button type="primary" @click="router.push('/app/invoices/create')">
          <PlusOutlined /> Tạo hóa đơn
        </a-button>
      </template>
    </a-page-header>

    <a-card style="margin-bottom:16px">
      <a-row :gutter="12">
        <a-col :span="7">
          <a-input-search v-model:value="filters.keyword" placeholder="Tìm bệnh nhân, mã hóa đơn..." allow-clear @search="fetchData" />
        </a-col>
        <a-col :span="5">
          <a-select v-model:value="filters.status" placeholder="Trạng thái" allow-clear style="width:100%" @change="fetchData">
            <a-select-option value="Pending">Chờ thanh toán</a-select-option>
            <a-select-option value="Paid">Đã thanh toán</a-select-option>
            <a-select-option value="Cancelled">Đã hủy</a-select-option>
            <a-select-option value="Refunded">Đã hoàn tiền</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="5">
          <a-range-picker v-model:value="dateRange" style="width:100%" @change="fetchData" />
        </a-col>
        <a-col :span="3">
          <a-button @click="resetFilters"><ReloadOutlined /></a-button>
        </a-col>
      </a-row>
    </a-card>

    <a-card>
      <a-table :dataSource="invoices" :columns="columns" :loading="loading"
        :pagination="{ current: page, pageSize, total, showTotal: (t: number) => `Tổng ${t} hóa đơn` }"
        row-key="id" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getInvoiceStatusColor(record.status)">{{ getInvoiceStatusLabel(record.status) }}</a-tag>
          </template>
          <template v-if="column.key === 'total'">
            <strong>{{ formatCurrency(record.totalAmount) }}</strong>
          </template>
          <template v-if="column.key === 'date'">{{ formatDate(record.createdAt) }}</template>
          <template v-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="router.push(`/app/invoices/${record.id}`)"><EyeOutlined /></a-button>
              <a-button v-if="record.status === 'Pending'" type="link" size="small" style="color:#52c41a"
                @click="openPay(record)">
                <DollarOutlined /> Thu tiền
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Pay Modal -->
    <a-modal v-model:open="showPayModal" title="Thu viện phí" @ok="handlePay" ok-text="Xác nhận thu tiền">
      <div v-if="payingInvoice" style="margin-bottom:16px">
        <a-descriptions bordered size="small">
          <a-descriptions-item label="Bệnh nhân" :span="3">{{ payingInvoice.patientName }}</a-descriptions-item>
          <a-descriptions-item label="Tổng tiền" :span="3">
            <strong style="color:#1890ff; font-size:18px">{{ formatCurrency(payingInvoice.totalAmount) }}</strong>
          </a-descriptions-item>
        </a-descriptions>
      </div>
      <a-form-item label="Phương thức thanh toán">
        <a-radio-group v-model:value="paymentMethod" button-style="solid">
          <a-radio-button value="Cash">💵 Tiền mặt</a-radio-button>
          <a-radio-button value="BankTransfer">🏦 Chuyển khoản</a-radio-button>
          <a-radio-button value="Card">💳 Thẻ</a-radio-button>
          <a-radio-button value="Insurance">🏥 BHYT</a-radio-button>
        </a-radio-group>
      </a-form-item>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { invoiceService } from '@/services/invoiceService'
import { formatCurrency, formatDate, getInvoiceStatusLabel, getInvoiceStatusColor } from '@/utils/format'
import type { InvoiceDto } from '@/types'
import { PlusOutlined, EyeOutlined, DollarOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

const router = useRouter()
const loading = ref(false)
const invoices = ref<InvoiceDto[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const dateRange = ref<any>(null)
const showPayModal = ref(false)
const payingInvoice = ref<InvoiceDto | null>(null)
const paymentMethod = ref<string>('Cash')
const filters = reactive({ keyword: '', status: undefined as number | undefined })

const columns: any[] = [
  { title: 'Mã hóa đơn', dataIndex: 'invoiceCode', key: 'code', width: 160 },
  { title: 'Bệnh nhân', dataIndex: 'patientName', key: 'patient' },
  { title: 'Phí khám', dataIndex: 'examinationFee', key: 'examFee', render: (v: number) => formatCurrency(v) },
  { title: 'Tiền thuốc', dataIndex: 'medicineFee', key: 'medFee', render: (v: number) => formatCurrency(v) },
  { title: 'Tổng tiền', key: 'total', align: 'right' },
  { title: 'Trạng thái', key: 'status', align: 'center' },
  { title: 'Ngày tạo', key: 'date' },
  { title: 'Thao tác', key: 'actions', width: 120 }
]

const fetchData = async () => {
  loading.value = true
  try {
    const params: any = { ...filters, page: page.value, pageSize }
    if (dateRange.value) { params.from = dayjs(dateRange.value[0]).toISOString(); params.to = dayjs(dateRange.value[1]).toISOString() }
    const res = await invoiceService.getAll(params)
    if (res.success && res.data) { invoices.value = res.data.items; total.value = res.data.totalCount }
  } finally { loading.value = false }
}

const openPay = (inv: any) => { payingInvoice.value = inv; showPayModal.value = true }

const handlePay = async () => {
  if (!payingInvoice.value) return
  const res = await invoiceService.pay(payingInvoice.value.id, { paymentMethod: paymentMethod.value })
  if (res.success) { message.success('Thu tiền thành công!'); showPayModal.value = false; fetchData() }
  else message.error(res.error)
}

const handleTableChange = (p: any) => { page.value = p.current; fetchData() }
const resetFilters = () => { filters.keyword = ''; filters.status = undefined; dateRange.value = null; fetchData() }

onMounted(fetchData)
</script>
