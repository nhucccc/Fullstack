<template>
  <div v-if="invoice">
    <a-page-header :title="`Hóa đơn: ${invoice.invoiceCode}`" @back="router.back()">
      <template #tags>
        <a-tag :color="getInvoiceStatusColor(invoice.status)">{{ getInvoiceStatusLabel(invoice.status) }}</a-tag>
        <a-tag v-if="invoice.paymentMethod">{{ getPaymentMethodLabel(invoice.paymentMethod) }}</a-tag>
      </template>
      <template #extra>
        <a-button v-if="invoice.status === 1" type="primary" @click="showPayModal = true">
          <DollarOutlined /> Thu tiền
        </a-button>
      </template>
    </a-page-header>

    <a-row :gutter="16">
      <a-col :span="16">
        <a-card title="Chi tiết hóa đơn">
          <a-descriptions :column="2" bordered size="small">
            <a-descriptions-item label="Bệnh nhân"><strong>{{ invoice.patientName }}</strong></a-descriptions-item>
            <a-descriptions-item label="Mã bệnh nhân">{{ invoice.patientCode || '—' }}</a-descriptions-item>
            <a-descriptions-item label="Số BHYT">{{ invoice.insuranceNumber || '—' }}</a-descriptions-item>
            <a-descriptions-item label="Bác sĩ khám">{{ invoice.doctorName || '—' }}</a-descriptions-item>
            <a-descriptions-item label="Ngày tạo">{{ formatDateTime(invoice.createdAt) }}</a-descriptions-item>
            <a-descriptions-item label="Ngày thanh toán">{{ formatDateTime(invoice.paidAt) }}</a-descriptions-item>
          </a-descriptions>

          <a-divider>Chi tiết phí</a-divider>
          <a-table :dataSource="invoice.items" :columns="itemColumns" row-key="id"
            :pagination="false" size="small">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'price'">{{ formatCurrency(record.unitPrice) }}</template>
              <template v-if="column.key === 'sub'"><strong>{{ formatCurrency(record.subTotal) }}</strong></template>
            </template>
          </a-table>
        </a-card>
      </a-col>

      <a-col :span="8">
        <a-card title="Tổng cộng">
          <a-descriptions :column="1" size="small">
            <a-descriptions-item label="Phí khám">{{ formatCurrency(invoice.examinationFee) }}</a-descriptions-item>
            <a-descriptions-item label="Tiền thuốc">{{ formatCurrency(invoice.medicineFee) }}</a-descriptions-item>
            <a-descriptions-item label="Phí khác">{{ formatCurrency(invoice.otherFees) }}</a-descriptions-item>
            <a-descriptions-item v-if="invoice.discountAmount" label="Giảm giá" style="color:#ff4d4f">
              -{{ formatCurrency(invoice.discountAmount) }}
            </a-descriptions-item>
            <a-descriptions-item v-if="invoice.insuranceCoverage" label="BHYT chi trả" style="color:#52c41a">
              -{{ formatCurrency(invoice.insuranceCoverage) }}
            </a-descriptions-item>
          </a-descriptions>
          <a-divider style="margin: 8px 0" />
          <div style="font-size:20px; font-weight:700; color:#1890ff; text-align:right">
            {{ formatCurrency(invoice.totalAmount) }}
          </div>

          <div v-if="invoice.notes" style="margin-top:12px; color:#8c8c8c; font-size:12px">
            {{ invoice.notes }}
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- Pay Modal -->
    <a-modal v-model:open="showPayModal" title="Thu viện phí" @ok="handlePay" ok-text="Xác nhận">
      <a-form-item label="Phương thức">
        <a-radio-group v-model:value="paymentMethod" button-style="solid">
          <a-radio-button :value="1">Tiền mặt</a-radio-button>
          <a-radio-button :value="2">Chuyển khoản</a-radio-button>
          <a-radio-button :value="3">Thẻ</a-radio-button>
          <a-radio-button :value="4">BHYT</a-radio-button>
        </a-radio-group>
      </a-form-item>
    </a-modal>
  </div>
  <a-skeleton v-else active />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { invoiceService } from '@/services/invoiceService'
import { formatCurrency, formatDateTime, getInvoiceStatusLabel, getInvoiceStatusColor, getPaymentMethodLabel } from '@/utils/format'
import type { InvoiceDto } from '@/types'
import { DollarOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()
const invoice = ref<InvoiceDto | null>(null)
const showPayModal = ref(false)
const paymentMethod = ref(1)

const itemColumns = [
  { title: 'Tên dịch vụ/thuốc', dataIndex: 'itemName', key: 'name' },
  { title: 'Loại', dataIndex: 'itemType', key: 'type', width: 100 },
  { title: 'SL', dataIndex: 'quantity', key: 'qty', width: 60 },
  { title: 'Đơn giá', key: 'price', align: 'right' },
  { title: 'Thành tiền', key: 'sub', align: 'right' }
]

const fetchData = async () => {
  const res = await invoiceService.getById(route.params.id as string)
  if (res.success) invoice.value = res.data ?? null
}

const handlePay = async () => {
  const res = await invoiceService.pay(route.params.id as string, { paymentMethod: paymentMethod.value })
  if (res.success) { message.success('Thu tiền thành công!'); showPayModal.value = false; fetchData() }
  else message.error(res.error)
}

onMounted(fetchData)
</script>
