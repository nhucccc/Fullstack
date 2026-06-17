<template>
  <div>
    <a-page-header title="Hóa đơn của tôi" sub-title="Lịch sử viện phí" />

    <a-card>
      <a-table
        :dataSource="invoices"
        :columns="columns"
        :loading="loading"
        row-key="id"
        :pagination="{ pageSize: 10, showTotal: (t: number) => `Tổng ${t} hóa đơn` }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'code'">
            <a-typography-text strong>{{ record.invoiceCode }}</a-typography-text>
          </template>
          <template v-if="column.key === 'fees'">
            <div style="font-size:12px; color:#8c8c8c">Khám: {{ formatCurrency(record.examinationFee) }}</div>
            <div style="font-size:12px; color:#8c8c8c">Thuốc: {{ formatCurrency(record.medicineFee) }}</div>
          </template>
          <template v-if="column.key === 'total'">
            <strong style="color:#1890ff">{{ formatCurrency(record.totalAmount) }}</strong>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="getInvoiceStatusColor(record.status)">{{ getInvoiceStatusLabel(record.status) }}</a-tag>
          </template>
          <template v-if="column.key === 'payment'">
            <span v-if="record.paymentMethod">{{ getPaymentMethodLabel(record.paymentMethod) }}</span>
            <span v-else style="color:#bfbfbf">—</span>
          </template>
          <template v-if="column.key === 'date'">{{ formatDate(record.createdAt) }}</template>
          <template v-if="column.key === 'actions'">
            <a-button type="link" size="small" @click="router.push(`/app/invoices/${record.id}`)">
              <EyeOutlined /> Xem
            </a-button>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Tổng kết -->
    <a-row :gutter="16" style="margin-top: 16px" v-if="invoices.length">
      <a-col :span="6">
        <a-card size="small">
          <a-statistic title="Tổng hóa đơn" :value="invoices.length" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card size="small">
          <a-statistic title="Đã thanh toán"
            :value="invoices.filter(i => i.status === 'Paid').length"
            :value-style="{ color: '#52c41a' }" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card size="small">
          <a-statistic title="Chờ thanh toán"
            :value="invoices.filter(i => i.status === 'Pending').length"
            :value-style="{ color: '#faad14' }" />
        </a-card>
      </a-col>
      <a-col :span="6">
        <a-card size="small">
          <a-statistic
            title="Tổng chi phí"
            :value="totalSpent"
            :formatter="(v: any) => formatCurrency(Number(v))"
            :value-style="{ color: '#1890ff', fontSize: '16px' }" />
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { invoiceService } from '@/services/invoiceService'
import { formatCurrency, formatDate, getInvoiceStatusLabel, getInvoiceStatusColor, getPaymentMethodLabel } from '@/utils/format'
import type { InvoiceDto } from '@/types'
import { EyeOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const invoices = ref<InvoiceDto[]>([])

const totalSpent = computed(() =>
  invoices.value.filter(i => i.status === 'Paid').reduce((s, i) => s + i.totalAmount, 0)
)

const columns: any[] = [
  { title: 'Mã hóa đơn', key: 'code', width: 160 },
  { title: 'Bác sĩ', dataIndex: 'doctorName', key: 'doctor' },
  { title: 'Chi tiết phí', key: 'fees' },
  { title: 'Tổng tiền', key: 'total', align: 'right' },
  { title: 'Trạng thái', key: 'status', align: 'center' },
  { title: 'Thanh toán', key: 'payment', align: 'center' },
  { title: 'Ngày', key: 'date', width: 110 },
  { title: '', key: 'actions', width: 80 }
]

onMounted(async () => {
  loading.value = true
  try {
    // Lấy theo patientId của user đang đăng nhập
    const res = await invoiceService.getAll({ patientId: authStore.user?.userId, pageSize: 100 })
    if (res.success && res.data) invoices.value = res.data.items
  } finally {
    loading.value = false
  }
})
</script>
