<template>
  <div>
    <a-page-header title="Tạo hóa đơn viện phí" @back="router.back()" />

    <a-card>
      <!-- Nếu có dispensationId từ query → hiện thông tin dispensation -->
      <a-alert v-if="linkedDispensation" type="success" style="margin-bottom:16px"
        :message="`Liên kết phiếu xuất thuốc: ${linkedDispensation.dispensationCode}`"
        :description="`Bệnh nhân: ${linkedDispensation.patientName} | Tiền thuốc: ${formatCurrency(linkedDispensation.totalMedicineCost)}`"
        show-icon />

      <a-form :model="form" layout="vertical" @finish="handleSubmit">
        <a-divider>Thông tin bệnh nhân</a-divider>
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="Tên bệnh nhân" name="patientName" :rules="[{required:true, message:'Bắt buộc'}]">
              <a-input v-model:value="form.patientName" placeholder="Nguyễn Văn A" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Mã bệnh nhân">
              <a-input v-model:value="form.patientCode" placeholder="BN20260610XXXX" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Số BHYT">
              <a-input v-model:value="form.insuranceNumber" placeholder="HS4012..." />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Bác sĩ khám">
              <a-input v-model:value="form.doctorName" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="ID Phiếu xuất thuốc">
              <a-input v-model:value="form.dispensationId"
                placeholder="Để trống nếu chưa có"
                @blur="onDispensationIdBlur" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider>Chi tiết phí</a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="Phí khám (VNĐ)" name="examinationFee" :rules="[{required:true}]">
              <a-input-number v-model:value="form.examinationFee" :min="0" :step="10000"
                style="width:100%"
                :formatter="(v: any) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(v: any) => v.replace(/,/g, '')" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="Tiền thuốc (tự động)">
              <a-input-number v-model:value="form.medicineFee" :min="0"
                style="width:100%" disabled
                :formatter="(v: any) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="Phí khác (xét nghiệm...)">
              <a-input-number v-model:value="form.otherFees" :min="0" style="width:100%"
                :formatter="(v: any) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(v: any) => v.replace(/,/g, '')" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="Giảm giá (VNĐ)">
              <a-input-number v-model:value="form.discountAmount" :min="0" style="width:100%"
                :formatter="(v: any) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(v: any) => v.replace(/,/g, '')" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="BHYT chi trả (VNĐ)">
              <a-input-number v-model:value="form.insuranceCoverage" :min="0" style="width:100%"
                :formatter="(v: any) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                :parser="(v: any) => v.replace(/,/g, '')" />
            </a-form-item>
          </a-col>
        </a-row>

        <!-- Preview tổng tiền -->
        <a-card size="small" style="margin-bottom:16px; background:#f6ffed; border-color:#b7eb8f">
          <a-row justify="end">
            <a-col>
              <a-space direction="vertical" style="text-align:right">
                <div>Phí khám: <strong>{{ formatCurrency(form.examinationFee) }}</strong></div>
                <div>Tiền thuốc: <strong>{{ formatCurrency(form.medicineFee) }}</strong></div>
                <div v-if="form.otherFees">Phí khác: <strong>{{ formatCurrency(form.otherFees) }}</strong></div>
                <div v-if="form.discountAmount" style="color:#ff4d4f">
                  Giảm giá: -<strong>{{ formatCurrency(form.discountAmount) }}</strong>
                </div>
                <div v-if="form.insuranceCoverage" style="color:#52c41a">
                  BHYT: -<strong>{{ formatCurrency(form.insuranceCoverage) }}</strong>
                </div>
                <a-divider style="margin:4px 0" />
                <div style="font-size:20px; color:#1890ff">
                  TỔNG: <strong>{{ formatCurrency(totalPreview) }}</strong>
                </div>
              </a-space>
            </a-col>
          </a-row>
        </a-card>

        <a-form-item label="Ghi chú">
          <a-textarea v-model:value="form.notes" :rows="2" placeholder="Ghi chú thêm..." />
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="loading" size="large">
              <DollarOutlined /> Tạo hóa đơn
            </a-button>
            <a-button @click="router.back()" size="large">Hủy</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { invoiceService } from '@/services/invoiceService'
import { dispensationService } from '@/services/dispensationService'
import { formatCurrency } from '@/utils/format'
import type { DispensationDto } from '@/types'
import { message } from 'ant-design-vue'
import { DollarOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const linkedDispensation = ref<DispensationDto | null>(null)

const form = reactive({
  patientId: '',
  patientName: '',
  patientCode: '',
  insuranceNumber: '',
  doctorName: '',
  dispensationId: (route.query.dispensationId as string) || '',
  examinationFee: 150000,
  medicineFee: 0,
  otherFees: 0,
  discountAmount: 0,
  insuranceCoverage: 0,
  notes: ''
})

const totalPreview = computed(() =>
  form.examinationFee + form.medicineFee + form.otherFees - form.discountAmount - form.insuranceCoverage
)

// Khi nhập dispensationId → tự điền thông tin
const onDispensationIdBlur = async () => {
  if (!form.dispensationId?.trim()) return
  try {
    const res = await dispensationService.getById(form.dispensationId)
    if (res.success && res.data) {
      linkedDispensation.value = res.data
      form.patientName = res.data.patientName
      form.doctorName = res.data.doctorName
      form.medicineFee = res.data.totalMedicineCost
      form.patientId = res.data.patientId
      message.success('Đã tự điền thông tin từ phiếu xuất thuốc')
    }
  } catch {}
}

// Tự load nếu có dispensationId trong query
onMounted(async () => {
  if (form.dispensationId) {
    await onDispensationIdBlur()
  }
})

const handleSubmit = async () => {
  if (!form.patientName.trim()) {
    message.error('Vui lòng nhập tên bệnh nhân')
    return
  }
  loading.value = true
  try {
    const payload: any = {
      patientId: form.patientId || '00000000-0000-0000-0000-000000000000',
      patientName: form.patientName,
      patientCode: form.patientCode || undefined,
      insuranceNumber: form.insuranceNumber || undefined,
      doctorName: form.doctorName || undefined,
      dispensationId: form.dispensationId || undefined,
      examinationFee: form.examinationFee,
      otherFees: form.otherFees || undefined,
      discountAmount: form.discountAmount || undefined,
      insuranceCoverage: form.insuranceCoverage || undefined,
      notes: form.notes || undefined
    }
    const res = await invoiceService.create(payload)
    if (res.success) {
      message.success('Tạo hóa đơn thành công!')
      router.push('/app/invoices')
    } else {
      message.error(res.error || 'Tạo hóa đơn thất bại')
    }
  } finally {
    loading.value = false
  }
}
</script>
