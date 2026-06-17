<template>
  <div>
    <a-page-header title="Quản lý kho thuốc">
      <template #extra>
        <a-button v-if="authStore.isAdmin" type="primary" @click="showCreateModal = true">
          <PlusOutlined /> Thêm thuốc
        </a-button>
      </template>
    </a-page-header>

    <!-- Filters -->
    <a-card style="margin-bottom: 16px">
      <a-row :gutter="12">
        <a-col :span="8">
          <a-input-search v-model:value="filters.keyword" placeholder="Tìm tên thuốc, hoạt chất, mã..." allow-clear @search="fetchData" />
        </a-col>
        <a-col :span="5">
          <a-select v-model:value="filters.category" placeholder="Nhóm thuốc" allow-clear style="width:100%" @change="fetchData">
            <a-select-option v-for="c in categories" :key="c" :value="c">{{ c }}</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="5">
          <a-select v-model:value="(filters as any).activeOnly" placeholder="Trạng thái" allow-clear style="width:100%" @change="fetchData">
            <a-select-option :value="true">Đang kinh doanh</a-select-option>
            <a-select-option :value="false">Ngừng kinh doanh</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="4">
          <a-button @click="resetFilters"><ReloadOutlined /> Làm mới</a-button>
        </a-col>
      </a-row>
    </a-card>

    <!-- Table -->
    <a-card>
      <a-table
        :dataSource="medicines" :columns="columns" :loading="loading"
        :pagination="{ current: page, pageSize: pageSize, total: total, showSizeChanger: true, showTotal: (t: number) => `Tổng ${t} thuốc` }"
        row-key="id" size="middle" @change="handleTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div>
              <strong>{{ record.name }}</strong>
              <a-tag v-if="record.requiresPrescription" color="red" style="margin-left:6px; font-size:10px">Kê đơn</a-tag>
            </div>
            <div style="color:#8c8c8c; font-size:12px">{{ record.activeIngredient }}</div>
          </template>
          <template v-if="column.key === 'stock'">
            <a-tag :color="record.isLowStock ? 'red' : 'green'">
              {{ record.stockQuantity }} {{ record.unitName }}
            </a-tag>
          </template>
          <template v-if="column.key === 'price'">
            <div>{{ formatCurrency(record.unitPrice) }}</div>
            <div style="color:#8c8c8c; font-size:11px">Nhập: {{ formatCurrency(record.importPrice) }}</div>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="record.isActive ? 'green' : 'default'">
              {{ record.isActive ? 'Hoạt động' : 'Ngừng' }}
            </a-tag>
          </template>
          <template v-if="column.key === 'actions'">
            <a-space>
              <a-button type="link" size="small" @click="router.push(`/app/medicines/${record.id}`)">
                <EyeOutlined />
              </a-button>
              <a-button v-if="authStore.isAdmin" type="link" size="small" @click="openEdit(record)">
                <EditOutlined />
              </a-button>
              <a-button v-if="authStore.canManageMedicines" type="link" size="small" @click="openImport(record)">
                <PlusCircleOutlined /> Nhập kho
              </a-button>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Create/Edit Modal -->
    <MedicineFormModal
      v-model:open="showCreateModal"
      :medicine="editingMedicine"
      @saved="onSaved"
    />

    <!-- Import Stock Modal -->
    <StockImportModal
      v-model:open="showImportModal"
      :medicine="importMedicine"
      @saved="fetchData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { medicineService } from '@/services/medicineService'
import { formatCurrency } from '@/utils/format'
import type { MedicineDto } from '@/types'
import MedicineFormModal from '@/components/medicines/MedicineFormModal.vue'
import StockImportModal from '@/components/medicines/StockImportModal.vue'
import { PlusOutlined, EyeOutlined, EditOutlined, PlusCircleOutlined, ReloadOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const medicines = ref<MedicineDto[]>([])
const categories = ref<string[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const showCreateModal = ref(false)
const showImportModal = ref(false)
const editingMedicine = ref<MedicineDto | null>(null)
const importMedicine = ref<MedicineDto | null>(null)

const filters = reactive({ keyword: '', category: undefined as string | undefined, activeOnly: undefined as boolean | undefined })

const columns: any[] = [
  { title: 'Mã thuốc', dataIndex: 'medicineCode', key: 'medicineCode', width: 130 },
  { title: 'Tên thuốc / Hoạt chất', key: 'name' },
  { title: 'Nhóm', dataIndex: 'category', key: 'category' },
  { title: 'Đơn vị', dataIndex: 'unitName', key: 'unit' },
  { title: 'Tồn kho', key: 'stock', align: 'center' },
  { title: 'Giá bán / Nhập', key: 'price' },
  { title: 'Trạng thái', key: 'status', align: 'center' },
  { title: 'Thao tác', key: 'actions', width: 160 }
]

const fetchData = async () => {
  loading.value = true
  try {
    const res = await medicineService.getAll({ ...filters, page: page.value, pageSize: pageSize.value })
    if (res.success && res.data) {
      medicines.value = res.data.items
      total.value = res.data.totalCount
    }
  } finally { loading.value = false }
}

const fetchCategories = async () => {
  const res = await medicineService.getCategories()
  if (res.success && res.data) categories.value = res.data
}

const handleTableChange = (pagination: any) => {
  page.value = pagination.current
  pageSize.value = pagination.pageSize
  fetchData()
}

const openEdit = (record: any) => {
  editingMedicine.value = record
  showCreateModal.value = true
}

const openImport = (record: any) => {
  importMedicine.value = record
  showImportModal.value = true
}

const onSaved = () => {
  editingMedicine.value = null
  fetchData()
  fetchCategories()
}

const resetFilters = () => {
  filters.keyword = ''
  filters.category = undefined
  filters.activeOnly = undefined
  page.value = 1
  fetchData()
}

onMounted(() => {
  fetchData()
  fetchCategories()
})
</script>
