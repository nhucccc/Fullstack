<template>
  <div v-if="invoice">
    <a-page-header :title="`Hóa đơn: ${invoice.invoiceCode}`" @back="router.back()">
      <template #tags>
        <a-tag :color="getInvoiceStatusColor(invoice.status)">{{ getInvoiceStatusLabel(invoice.status) }}</a-tag>
        <a-tag v-if="invoice.paymentMethod" color="blue">{{ getPaymentMethodLabel(invoice.paymentMethod) }}</a-tag>
      </template>
      <template #extra>
        <a-space>
          <a-button v-if="invoice.status === 'Pending'" type="primary" @click="showPayModal = true">
            <DollarOutlined /> Thu tiền
          </a-button>
          <a-popconfirm v-if="invoice.status === 'Pending'" title="Hủy hóa đơn này?"
            @confirm="cancelInvoice">
            <a-button danger><CloseOutlined /> Hủy</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-page-header>

    <a-row :gutter="16">
      <!-- LEFT: Chi tiết -->
      <a-col :xs="24" :lg="16">
        <a-card title="Thông tin bệnh nhân">
          <a-descriptions :column="{ xs: 1, sm: 2 }" bordered size="small">
            <a-descriptions-item label="Bệnh nhân">
              <strong>{{ invoice.patientName }}</strong>
            </a-descriptions-item>
            <a-descriptions-item label="Mã BN">{{ invoice.patientCode || '—' }}</a-descriptions-item>
            <a-descriptions-item label="Số BHYT">{{ invoice.insuranceNumber || '—' }}</a-descriptions-item>
            <a-descriptions-item label="Bác sĩ khám">{{ invoice.doctorName || '—' }}</a-descriptions-item>
            <a-descriptions-item label="Ngày tạo">{{ formatDateTime(invoice.createdAt) }}</a-descriptions-item>
            <a-descriptions-item label="Thanh toán lúc">
              {{ invoice.paidAt ? formatDateTime(invoice.paidAt) : '—' }}
            </a-descriptions-item>
          </a-descriptions>
        </a-card>

        <a-card title="Chi tiết dịch vụ / thuốc" style="margin-top:16px">
          <a-table :dataSource="invoice.items" :columns="itemColumns" row-key="id"
            :pagination="false" size="small">
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'type'">
                <a-tag :color="record.itemType === 'Medicine' ? 'purple' : 'blue'" size="small">
                  {{ record.itemType === 'Medicine' ? 'Thuốc' : 'Dịch vụ' }}
                </a-tag>
              </template>
              <template v-if="column.key === 'price'">{{ formatCurrency(record.unitPrice) }}</template>
              <template v-if="column.key === 'sub'">
                <strong>{{ formatCurrency(record.subTotal) }}</strong>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>

      <!-- RIGHT: Tổng cộng -->
      <a-col :xs="24" :lg="8">
        <a-card title="Tổng thanh toán">
          <a-list size="small" :bordered="false">
            <a-list-item>
              <span style="color:#8c8c8c">Phí khám</span>
              <span>{{ formatCurrency(invoice.examinationFee) }}</span>
            </a-list-item>
            <a-list-item>
              <span style="color:#8c8c8c">Tiền thuốc</span>
              <span>{{ formatCurrency(invoice.medicineFee) }}</span>
            </a-list-item>
            <a-list-item v-if="invoice.otherFees">
              <span style="color:#8c8c8c">Phí khác</span>
              <span>{{ formatCurrency(invoice.otherFees) }}</span>
            </a-list-item>
            <a-list-item v-if="invoice.discountAmount">
              <span style="color:#ff4d4f">Giảm giá</span>
              <span style="color:#ff4d4f">-{{ formatCurrency(invoice.discountAmount) }}</span>
            </a-list-item>
            <a-list-item v-if="invoice.insuranceCoverage">
              <span style="color:#52c41a">BHYT chi trả</span>
              <span style="color:#52c41a">-{{ formatCurrency(invoice.insuranceCoverage) }}</span>
            </a-list-item>
          </a-list>
          <a-divider style="margin: 12px 0" />
          <div style="text-align:right">
            <div style="font-size:22px; font-weight:700; color:#1890ff">
              {{ formatCurrency(invoice.totalAmount) }}
            </div>
            <div v-if="invoice.paymentMethod" style="color:#8c8c8c; font-size:12px; margin-top:4px">
              Đã thanh toán qua {{ getPaymentMethodLabel(invoice.paymentMethod) }}
            </div>
          </div>
        </a-card>

        <!-- Phiếu xuất thuốc liên quan -->
        <a-card v-if="invoice.dispensationId" title="Phiếu xuất thuốc" style="margin-top:16px">
          <a-button type="link" @click="router.push(`/dispensations/${invoice.dispensationId}`)">
            <FileTextOutlined /> Xem phiếu xuất thuốc
          </a-button>
        </a-card>

        <a-card v-if="invoice.notes" title="Ghi chú" style="margin-top:16px">
          <p style="color:#595959">{{ invoice.notes }}</p>
        </a-card>
      </a-col>
    </a-row>

    <!-- Pay Modal -->
    <a-modal v-model:open="showPayModal" title="Thu viện phí"
      @ok="handlePay" ok-text="Xác nhận thu tiền" :confirm-loading="payLoading">
      <div style="margin-bottom:16px; padding:12px; background:#f6ffed; border-radius:8px">
        <div style="font-size:14px; color:#8c8c8c">Bệnh nhân: {{ invoice.patientName }}</div>
        <div style="font-size:24px; font-weight:700; color:#52c41a">
          {{ formatCurrency(invoice.totalAmount) }}
        </div>
      </div>
      <a-form-item label="Phương thức thanh toán">
        <a-radio-group v-model:value="paymentMethod" button-style="solid" size="large">
          <a-radio-button value="Cash">💵 Tiền mặt</a-radio-button>
          <a-radio-button value="BankTransfer">🏦 Chuyển khoản</a-radio-button>
          <a-radio-button value="Card">💳 Thẻ</a-radio-button>
          <a-radio-button value="Insurance">🏥 BHYT</a-radio-button>
        </a-radio-group>
      </a-form-item>
    </a-modal>
  </div>
  <div v-else style="padding:24px">
    <a-skeleton active :paragraph="{ rows: 8 }" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { invoiceService } from '@/services/invoiceService'
import { formatCurrency, formatDateTime, getInvoiceStatusLabel, getInvoiceStatusColor, getPaymentMethodLabel } from '@/utils/format'
import type { InvoiceDto } from '@/types'
import { DollarOutlined, CloseOutlined, FileTextOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const invoice = ref<InvoiceDto | null>(null)
const showPayModal = ref(false)
const paymentMethod = ref<string>('Cash')
const payLoading = ref(false)

const itemColumns = [
  { title: 'Tên dịch vụ / thuốc', dataIndex: 'itemName', key: 'name' },
  { title: 'Loại', key: 'type', width: 90, align: 'center' },
  { title: 'SL', dataIndex: 'quantity', key: 'qty', width: 55, align: 'center' },
  { title: 'Đơn giá', key: 'price', align: 'right', width: 130 },
  { title: 'Thành tiền', key: 'sub', align: 'right', width: 140 }
]

const fetchData = async () => {
  const res = await invoiceService.getById(route.params.id as string)
  if (res.success) invoice.value = res.data ?? null
}

const handlePay = async () => {
  payLoading.value = true
  try {
    const res = await invoiceService.pay(route.params.id as string, { paymentMethod: paymentMethod.value })
    if (res.success) {
      message.success('Thu tiền thành công!')
      showPayModal.value = false
      fetchData()
    } else {
      message.error(res.error || 'Thu tiền thất bại')
    }
  } finally {
    payLoading.value = false
  }
}

const cancelInvoice = async () => {
  const res = await invoiceService.cancel(route.params.id as string, 'Hủy theo yêu cầu')
  if (res.success) { message.success('Đã hủy hóa đơn'); fetchData() }
  else message.error(res.error)
}

onMounted(fetchData)
</script>
