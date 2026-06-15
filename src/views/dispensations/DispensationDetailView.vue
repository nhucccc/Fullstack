<template>
  <div v-if="dispensation">
    <a-page-header :title="`Phiếu xuất: ${dispensation.dispensationCode}`" @back="router.back()">
      <template #tags>
        <a-tag :color="getDispensationStatusColor(dispensation.status)">
          {{ getDispensationStatusLabel(dispensation.status) }}
        </a-tag>
      </template>
      <template #extra>
        <a-space>
          <a-popconfirm v-if="dispensation.status === 1 && authStore.canManageMedicines"
            title="Xác nhận xuất thuốc từ kho?" @confirm="process">
            <a-button type="primary"><CheckOutlined /> Xuất thuốc</a-button>
          </a-popconfirm>
          <a-button v-if="dispensation.status !== 3 && dispensation.status !== 4" danger @click="showCancelModal = true">
            <CloseOutlined /> Hủy
          </a-button>
        </a-space>
      </template>
    </a-page-header>

    <a-row :gutter="16">
      <a-col :span="16">
        <a-card title="Thông tin phiếu">
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="Bệnh nhân"><strong>{{ dispensation.patientName }}</strong></a-descriptions-item>
            <a-descriptions-item label="Bác sĩ">{{ dispensation.doctorName }}</a-descriptions-item>
            <a-descriptions-item label="Chẩn đoán" :span="2">{{ dispensation.diagnosis || '—' }}</a-descriptions-item>
            <a-descriptions-item label="Ghi chú" :span="2">{{ dispensation.notes || '—' }}</a-descriptions-item>
            <a-descriptions-item label="Ngày tạo">{{ formatDateTime(dispensation.createdAt) }}</a-descriptions-item>
            <a-descriptions-item label="Thời gian xuất">{{ formatDateTime(dispensation.dispensedAt) }}</a-descriptions-item>
          </a-descriptions>
        </a-card>

        <a-card title="Danh sách thuốc" style="margin-top:16px">
          <a-table :dataSource="dispensation.items" :columns="itemColumns" row-key="id"
            :pagination="false" size="small">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'price'">{{ formatCurrency(record.unitPrice) }}</template>
              <template v-if="column.key === 'subtotal'">
                <strong>{{ formatCurrency(record.subTotal) }}</strong>
              </template>
            </template>
            <template #summary>
              <a-table-summary fixed>
                <a-table-summary-row>
                  <a-table-summary-cell :index="0" :col-span="5" align="right">
                    <strong>Tổng tiền thuốc:</strong>
                  </a-table-summary-cell>
                  <a-table-summary-cell :index="5">
                    <strong style="color:#1890ff; font-size:16px">
                      {{ formatCurrency(dispensation.totalMedicineCost) }}
                    </strong>
                  </a-table-summary-cell>
                </a-table-summary-row>
              </a-table-summary>
            </template>
          </a-table>
        </a-card>
      </a-col>

      <a-col :span="8">
        <a-card title="Tạo hóa đơn" v-if="dispensation.status === 3 && authStore.canViewFinance">
          <p>Phiếu đã xuất thuốc. Tạo hóa đơn viện phí cho bệnh nhân?</p>
          <a-button type="primary" block @click="router.push(`/invoices/create?dispensationId=${dispensation.id}`)">
            <DollarOutlined /> Tạo hóa đơn
          </a-button>
        </a-card>
      </a-col>
    </a-row>

    <!-- Cancel Modal -->
    <a-modal v-model:open="showCancelModal" title="Hủy phiếu xuất thuốc" @ok="cancelDispensation" ok-text="Xác nhận hủy" ok-type="danger">
      <a-form-item label="Lý do hủy">
        <a-textarea v-model:value="cancelReason" :rows="3" placeholder="Nhập lý do..." />
      </a-form-item>
    </a-modal>
  </div>
  <a-skeleton v-else active />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { dispensationService } from '@/services/dispensationService'
import { formatCurrency, formatDateTime, getDispensationStatusLabel, getDispensationStatusColor } from '@/utils/format'
import type { DispensationDto } from '@/types'
import { CheckOutlined, CloseOutlined, DollarOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const dispensation = ref<DispensationDto | null>(null)
const showCancelModal = ref(false)
const cancelReason = ref('')

const itemColumns = [
  { title: 'Tên thuốc', dataIndex: 'medicineName', key: 'name' },
  { title: 'Hoạt chất', dataIndex: 'activeIngredient', key: 'ai', width: 120 },
  { title: 'Liều dùng', dataIndex: 'dosage', key: 'dosage' },
  { title: 'SL', dataIndex: 'quantity', key: 'qty', width: 60, align: 'center' },
  { title: 'Đơn giá', key: 'price', align: 'right' },
  { title: 'Thành tiền', key: 'subtotal', align: 'right' }
]

const fetchData = async () => {
  const res = await dispensationService.getById(route.params.id as string)
  if (res.success) dispensation.value = res.data ?? null
}

const process = async () => {
  const res = await dispensationService.process(route.params.id as string)
  if (res.success) { message.success('Xuất thuốc thành công!'); fetchData() }
  else message.error(res.error)
}

const cancelDispensation = async () => {
  if (!cancelReason.value.trim()) { message.warning('Vui lòng nhập lý do hủy'); return }
  const res = await dispensationService.cancel(route.params.id as string, cancelReason.value)
  if (res.success) { message.success('Đã hủy phiếu'); showCancelModal.value = false; fetchData() }
  else message.error(res.error)
}

onMounted(fetchData)
</script>
