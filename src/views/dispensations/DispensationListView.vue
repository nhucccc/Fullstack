<template>
  <div>
    <a-page-header title="Phiếu xuất thuốc">
      <template #extra>
        <a-button v-if="authStore.canManageMedicines" type="primary" @click="router.push('/dispensations/create')">
          <PlusOutlined /> Tạo phiếu mới
        </a-button>
      </template>
    </a-page-header>

    <a-card style="margin-bottom:16px">
      <a-row :gutter="12">
        <a-col :span="7">
          <a-input-search v-model:value="filters.keyword" placeholder="Tìm bệnh nhân, bác sĩ, mã phiếu..." allow-clear @search="fetchData" />
        </a-col>
        <a-col :span="5">
          <a-select v-model:value="filters.status" placeholder="Trạng thái" allow-clear style="width:100%" @change="fetchData">
            <a-select-option value="Pending">Chờ xử lý</a-select-option>
            <a-select-option value="Processing">Đang xử lý</a-select-option>
            <a-select-option value="Dispensed">Đã xuất thuốc</a-select-option>
            <a-select-option value="Cancelled">Đã hủy</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="5">
          <a-range-picker v-model:value="dateRange" @change="fetchData" style="width:100%" />
        </a-col>
        <a-col :span="3">
          <a-button @click="resetFilters"><ReloadOutlined /> Làm mới</a-button>
        </a-col>
      </a-row>
    </a-card>

    <a-card>
      <a-table :dataSource="dispensations" :columns="columns" :loading="loading"
        :pagination="{ current: page, pageSize, total, showTotal: (t: number) => `Tổng ${t} phiếu` }"
        row-key="id" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="getDispensationStatusColor(record.status)">{{ getDispensationStatusLabel(record.status) }}</a-tag>
          </template>
          <template v-if="column.key === 'cost'">{{ formatCurrency(record.totalMedicineCost) }}</template>
          <template v-if="column.key === 'date'">{{ formatDateTime(record.createdAt) }}</template>
          <template v-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="router.push(`/dispensations/${record.id}`)"><EyeOutlined /></a-button>
              <a-popconfirm v-if="record.status === 'Pending' && authStore.canManageMedicines"
                title="Xác nhận xuất thuốc?" @confirm="processDispensation(record.id)">
                <a-button type="link" size="small" style="color:#52c41a"><CheckOutlined /> Xuất</a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { dispensationService } from '@/services/dispensationService'
import { formatCurrency, formatDateTime, getDispensationStatusLabel, getDispensationStatusColor } from '@/utils/format'
import type { DispensationDto } from '@/types'
import { PlusOutlined, EyeOutlined, CheckOutlined, ReloadOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const dispensations = ref<DispensationDto[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const dateRange = ref<any>(null)
const filters = reactive({ keyword: '', status: undefined as number | undefined })

const columns: any[] = [
  { title: 'Mã phiếu', dataIndex: 'dispensationCode', key: 'code', width: 160 },
  { title: 'Bệnh nhân', dataIndex: 'patientName', key: 'patient' },
  { title: 'Bác sĩ', dataIndex: 'doctorName', key: 'doctor' },
  { title: 'Tiền thuốc', key: 'cost', align: 'right' },
  { title: 'Trạng thái', key: 'status', align: 'center' },
  { title: 'Ngày tạo', key: 'date' },
  { title: 'Thao tác', key: 'actions', width: 120 }
]

const fetchData = async () => {
  loading.value = true
  try {
    const params: any = { ...filters, page: page.value, pageSize }
    if (dateRange.value) {
      params.from = dayjs(dateRange.value[0]).toISOString()
      params.to = dayjs(dateRange.value[1]).toISOString()
    }
    const res = await dispensationService.getAll(params)
    if (res.success && res.data) {
      dispensations.value = res.data.items
      total.value = res.data.totalCount
    }
  } finally { loading.value = false }
}

const processDispensation = async (id: string) => {
  const res = await dispensationService.process(id)
  if (res.success) { message.success('Xuất thuốc thành công!'); fetchData() }
  else message.error(res.error)
}

const handleTableChange = (p: any) => { page.value = p.current; fetchData() }
const resetFilters = () => { filters.keyword = ''; filters.status = undefined; dateRange.value = null; fetchData() }

onMounted(fetchData)
</script>
