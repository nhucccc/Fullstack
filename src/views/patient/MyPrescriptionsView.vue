<template>
  <div>
    <a-page-header title="Đơn thuốc của tôi" />
    <a-card>
      <a-table :dataSource="dispensations" :columns="columns" :loading="loading" row-key="id"
        :pagination="{ pageSize: 10 }">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getDispensationStatusColor(record.status)">{{ getDispensationStatusLabel(record.status) }}</a-tag>
          </template>
          <template v-if="column.key === 'cost'">{{ formatCurrency(record.totalMedicineCost) }}</template>
          <template v-if="column.key === 'date'">{{ formatDate(record.createdAt) }}</template>
          <template v-if="column.key === 'actions'">
            <a-button type="link" size="small" @click="router.push(`/dispensations/${record.id}`)"><EyeOutlined /></a-button>
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
import { dispensationService } from '@/services/dispensationService'
import { formatCurrency, formatDate, getDispensationStatusLabel, getDispensationStatusColor } from '@/utils/format'
import type { DispensationDto } from '@/types'
import { EyeOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const dispensations = ref<DispensationDto[]>([])

const columns: any[] = [
  { title: 'Mã phiếu', dataIndex: 'dispensationCode', key: 'code' },
  { title: 'Bác sĩ', dataIndex: 'doctorName', key: 'doctor' },
  { title: 'Chẩn đoán', dataIndex: 'diagnosis', key: 'diagnosis' },
  { title: 'Tiền thuốc', key: 'cost', align: 'right' },
  { title: 'Trạng thái', key: 'status', align: 'center' },
  { title: 'Ngày', key: 'date' },
  { title: '', key: 'actions', width: 60 }
]

onMounted(async () => {
  loading.value = true
  const res = await dispensationService.getAll({ keyword: authStore.user?.userId })
  if (res.success && res.data) dispensations.value = res.data.items
  loading.value = false
})
</script>
