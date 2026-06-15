<template>
  <div>
    <a-page-header title="Hóa đơn của tôi" />
    <a-card>
      <a-table :dataSource="invoices" :columns="columns" :loading="loading" row-key="id"
        :pagination="{ pageSize: 10, showTotal: (t: number) => `Tổng ${t} hóa đơn` }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getInvoiceStatusColor(record.status)">{{ getInvoiceStatusLabel(record.status) }}</a-tag>
          </template>
          <template v-if="column.key === 'total'"><strong>{{ formatCurrency(record.totalAmount) }}</strong></template>
          <template v-if="column.key === 'date'">{{ formatDate(record.createdAt) }}</template>
          <template v-if="column.key === 'actions'">
            <a-button type="link" size="small" @click="router.push(`/invoices/${record.id}`)"><EyeOutlined /></a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { invoiceService } from '@/services/invoiceService'
import { formatCurrency, formatDate, getInvoiceStatusLabel, getInvoiceStatusColor } from '@/utils/format'
import type { InvoiceDto } from '@/types'
import { EyeOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const invoices = ref<InvoiceDto[]>([])

const columns: any[] = [
  { title: 'Mã hóa đơn', dataIndex: 'invoiceCode', key: 'code' },
  { title: 'Bác sĩ', dataIndex: 'doctorName', key: 'doctor' },
  { title: 'Tổng tiền', key: 'total', align: 'right' },
  { title: 'Trạng thái', key: 'status', align: 'center' },
  { title: 'Ngày', key: 'date' },
  { title: '', key: 'actions', width: 60 }
]

onMounted(async () => {
  loading.value = true
  const res = await invoiceService.getAll({ keyword: authStore.user?.userId })
  if (res.success && res.data) invoices.value = res.data.items
  loading.value = false
})
</script>
