<template>
  <div>
    <a-page-header title="Đơn thuốc của tôi" sub-title="Lịch sử xuất thuốc" />

    <a-card>
      <a-table
        :dataSource="dispensations"
        :columns="columns"
        :loading="loading"
        row-key="id"
        :pagination="{ pageSize: 10, showTotal: (t: number) => `Tổng ${t} đơn thuốc` }"
        :expandable="{ expandedRowRender }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'code'">
            <a-typography-text strong>{{ record.dispensationCode }}</a-typography-text>
          </template>
          <template v-if="column.key === 'diagnosis'">
            <span v-if="record.diagnosis">{{ record.diagnosis }}</span>
            <span v-else style="color:#bfbfbf">Không có</span>
          </template>
          <template v-if="column.key === 'items'">
            <a-tag>{{ record.items?.length ?? 0 }} loại thuốc</a-tag>
          </template>
          <template v-if="column.key === 'cost'">
            <strong style="color:#722ed1">{{ formatCurrency(record.totalMedicineCost) }}</strong>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="getDispensationStatusColor(record.status)">
              {{ getDispensationStatusLabel(record.status) }}
            </a-tag>
          </template>
          <template v-if="column.key === 'date'">{{ formatDate(record.createdAt) }}</template>
          <template v-if="column.key === 'actions'">
            <a-button type="link" size="small" @click="router.push(`/app/dispensations/${record.id}`)">
              <EyeOutlined /> Xem
            </a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, h, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { dispensationService } from '@/services/dispensationService'
import { formatCurrency, formatDate, getDispensationStatusLabel, getDispensationStatusColor } from '@/utils/format'
import type { DispensationDto } from '@/types'
import { EyeOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const dispensations = ref<DispensationDto[]>([])

const columns: any[] = [
  { title: 'Mã phiếu', key: 'code', width: 160 },
  { title: 'Bác sĩ kê đơn', dataIndex: 'doctorName', key: 'doctor' },
  { title: 'Chẩn đoán', key: 'diagnosis' },
  { title: 'Số loại thuốc', key: 'items', align: 'center' },
  { title: 'Tiền thuốc', key: 'cost', align: 'right' },
  { title: 'Trạng thái', key: 'status', align: 'center' },
  { title: 'Ngày', key: 'date', width: 110 },
  { title: '', key: 'actions', width: 80 }
]

// Expand row để xem chi tiết thuốc
const expandedRowRender = (record: DispensationDto) => {
  if (!record.items?.length) return h('div', { style: 'color:#8c8c8c' }, 'Không có thuốc')
  return h('div', { style: 'padding: 8px 0' }, [
    h('table', { style: 'width:100%; font-size:13px; border-collapse:collapse' }, [
      h('thead', {}, h('tr', { style: 'background:#fafafa' }, [
        h('th', { style: 'padding:6px 12px; text-align:left' }, 'Tên thuốc'),
        h('th', { style: 'padding:6px 12px' }, 'Hoạt chất'),
        h('th', { style: 'padding:6px 12px' }, 'Liều dùng'),
        h('th', { style: 'padding:6px 12px' }, 'Cách dùng'),
        h('th', { style: 'padding:6px 12px; text-align:right' }, 'SL'),
        h('th', { style: 'padding:6px 12px; text-align:right' }, 'Thành tiền'),
      ])),
      h('tbody', {}, record.items.map(item =>
        h('tr', { style: 'border-top:1px solid #f0f0f0' }, [
          h('td', { style: 'padding:6px 12px; font-weight:500' }, item.medicineName),
          h('td', { style: 'padding:6px 12px; color:#8c8c8c' }, item.activeIngredient),
          h('td', { style: 'padding:6px 12px' }, item.dosage ?? '—'),
          h('td', { style: 'padding:6px 12px' }, item.usage ?? '—'),
          h('td', { style: 'padding:6px 12px; text-align:right' }, item.quantity),
          h('td', { style: 'padding:6px 12px; text-align:right; color:#722ed1; font-weight:500' }, formatCurrency(item.subTotal)),
        ])
      ))
    ])
  ])
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await dispensationService.getAll({ patientId: authStore.user?.userId, pageSize: 100 })
    if (res.success && res.data) dispensations.value = res.data.items
  } finally {
    loading.value = false
  }
})
</script>
