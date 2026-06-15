<template>
  <div v-if="medicine">
    <a-page-header :title="medicine.name" @back="router.back()">
      <template #tags>
        <a-tag :color="medicine.isActive ? 'green' : 'default'">{{ medicine.isActive ? 'Hoạt động' : 'Ngừng' }}</a-tag>
        <a-tag v-if="medicine.requiresPrescription" color="red">Thuốc kê đơn</a-tag>
        <a-tag v-if="medicine.isLowStock" color="orange">⚠ Sắp hết kho</a-tag>
      </template>
      <template #extra>
        <a-space v-if="authStore.canManageMedicines">
          <a-button @click="showImport = true"><PlusCircleOutlined /> Nhập kho</a-button>
          <a-button v-if="authStore.isAdmin" type="primary" @click="showEdit = true"><EditOutlined /> Chỉnh sửa</a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-row :gutter="16">
      <a-col :span="16">
        <a-card title="Thông tin thuốc">
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="Mã thuốc">{{ medicine.medicineCode }}</a-descriptions-item>
            <a-descriptions-item label="Hoạt chất">{{ medicine.activeIngredient }}</a-descriptions-item>
            <a-descriptions-item label="Nhà sản xuất">{{ medicine.manufacturer || '—' }}</a-descriptions-item>
            <a-descriptions-item label="Xuất xứ">{{ medicine.countryOfOrigin || '—' }}</a-descriptions-item>
            <a-descriptions-item label="Nhóm thuốc">{{ medicine.category || '—' }}</a-descriptions-item>
            <a-descriptions-item label="Đơn vị">{{ medicine.unitName }} {{ medicine.unitDescription ? `(${medicine.unitDescription})` : '' }}</a-descriptions-item>
            <a-descriptions-item label="Giá bán lẻ"><strong style="color:#1890ff">{{ formatCurrency(medicine.unitPrice) }}</strong></a-descriptions-item>
            <a-descriptions-item label="Giá nhập">{{ formatCurrency(medicine.importPrice) }}</a-descriptions-item>
            <a-descriptions-item label="Tồn kho">
              <a-tag :color="medicine.isLowStock ? 'red' : 'green'" style="font-size:14px">
                {{ medicine.stockQuantity }} {{ medicine.unitName }}
              </a-tag>
            </a-descriptions-item>
            <a-descriptions-item label="Tồn kho tối thiểu">{{ medicine.minimumStock }}</a-descriptions-item>
            <a-descriptions-item label="Ngày tạo" :span="2">{{ formatDateTime(medicine.createdAt) }}</a-descriptions-item>
          </a-descriptions>
        </a-card>

        <a-card title="Thông tin bổ sung" style="margin-top:16px">
          <a-descriptions :column="1" bordered size="small">
            <a-descriptions-item label="Mô tả">{{ medicine.description || '—' }}</a-descriptions-item>
            <a-descriptions-item label="Tác dụng phụ">{{ medicine.sideEffects || '—' }}</a-descriptions-item>
            <a-descriptions-item label="Điều kiện bảo quản">{{ medicine.storageConditions || '—' }}</a-descriptions-item>
          </a-descriptions>
        </a-card>
      </a-col>

      <a-col :span="8">
        <a-card title="Lịch sử nhập/xuất kho">
          <a-timeline>
            <a-timeline-item v-for="tx in stockHistory" :key="tx.id"
              :color="tx.transactionType === 'IN' ? 'green' : tx.transactionType === 'OUT' ? 'red' : 'blue'">
              <div><strong>{{ tx.transactionType }}</strong> {{ tx.quantity }} {{ medicine.unitName }}</div>
              <div style="color:#8c8c8c; font-size:11px">{{ formatDateTime(tx.createdAt) }}</div>
              <div v-if="tx.note" style="font-size:12px">{{ tx.note }}</div>
            </a-timeline-item>
            <a-timeline-item v-if="!stockHistory.length" color="gray">Chưa có giao dịch</a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>
    </a-row>

    <MedicineFormModal v-model:open="showEdit" :medicine="medicine" @saved="fetchDetail" />
    <StockImportModal v-model:open="showImport" :medicine="medicine" @saved="fetchDetail" />
  </div>
  <a-skeleton v-else active />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { medicineService } from '@/services/medicineService'
import http from '@/utils/http'
import { formatCurrency, formatDateTime } from '@/utils/format'
import type { MedicineDto } from '@/types'
import MedicineFormModal from '@/components/medicines/MedicineFormModal.vue'
import StockImportModal from '@/components/medicines/StockImportModal.vue'
import { PlusCircleOutlined, EditOutlined } from '@ant-design/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const medicine = ref<MedicineDto | null>(null)
const stockHistory = ref<any[]>([])
const showEdit = ref(false)
const showImport = ref(false)

const fetchDetail = async () => {
  const res = await medicineService.getById(route.params.id as string)
  if (res.success) medicine.value = res.data ?? null
  // Fetch stock history
  try {
    const txRes = await http.get(`/medicines/${route.params.id}/stock-history`)
    if (txRes.data?.success) stockHistory.value = txRes.data.data ?? []
  } catch {}
}

onMounted(fetchDetail)
</script>
