<template>
  <div>
    <a-page-header title="Tạo hóa đơn viện phí" @back="router.back()" />
    <a-card>
      <a-form :model="form" layout="vertical" @finish="handleSubmit">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="ID Bệnh nhân" name="patientId" :rules="[{required:true}]">
              <a-input v-model:value="form.patientId" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Tên bệnh nhân" name="patientName" :rules="[{required:true}]">
              <a-input v-model:value="form.patientName" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Mã bệnh nhân">
              <a-input v-model:value="form.patientCode" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Số BHYT">
              <a-input v-model:value="form.insuranceNumber" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Bác sĩ khám">
              <a-input v-model:value="form.doctorName" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="ID Phiếu xuất thuốc">
              <a-input v-model:value="form.dispensationId" placeholder="Để trống nếu chưa có" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider>Phí dịch vụ</a-divider>
        <a-row :gutter="16">
          <a-col :span="6">
            <a-form-item label="Phí khám (VNĐ)" name="examinationFee" :rules="[{required:true}]">
              <a-input-number v-model:value="form.examinationFee" :min="0" :step="10000" style="width:100%"
                :formatter="(v: any) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="Phí khác (VNĐ)">
              <a-input-number v-model:value="form.otherFees" :min="0" style="width:100%"
                :formatter="(v: any) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="Giảm giá (VNĐ)">
              <a-input-number v-model:value="form.discountAmount" :min="0" style="width:100%"
                :formatter="(v: any) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="BHYT chi trả (VNĐ)">
              <a-input-number v-model:value="form.insuranceCoverage" :min="0" style="width:100%"
                :formatter="(v: any) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-form-item label="Ghi chú">
          <a-textarea v-model:value="form.notes" :rows="2" />
        </a-form-item>

        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="loading">Tạo hóa đơn</a-button>
            <a-button @click="router.back()">Hủy</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { invoiceService } from '@/services/invoiceService'
import { message } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()
const loading = ref(false)

const form = reactive({
  patientId: '', patientName: '', patientCode: '',
  insuranceNumber: '', doctorName: '',
  dispensationId: (route.query.dispensationId as string) || '',
  examinationFee: 0, otherFees: 0, discountAmount: 0,
  insuranceCoverage: 0, notes: ''
})

const handleSubmit = async () => {
  loading.value = true
  try {
    const res = await invoiceService.create({
      ...form,
      dispensationId: form.dispensationId || undefined
    })
    if (res.success) { message.success('Tạo hóa đơn thành công!'); router.push('/invoices') }
    else message.error(res.error)
  } finally { loading.value = false }
}
</script>
