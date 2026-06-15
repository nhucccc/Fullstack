<template>
  <div>
    <a-page-header title="Tạo phiếu xuất thuốc" @back="router.back()" />
    <a-card>
      <a-form :model="form" layout="vertical" @finish="handleSubmit">
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item label="ID Đơn thuốc (từ Medical Record)" name="prescriptionId" :rules="[{required:true}]">
              <a-input v-model:value="form.prescriptionId" placeholder="UUID của prescription" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="ID Bệnh nhân" name="patientId" :rules="[{required:true}]">
              <a-input v-model:value="form.patientId" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="ID Bác sĩ" name="doctorId" :rules="[{required:true}]">
              <a-input v-model:value="form.doctorId" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Tên bệnh nhân" name="patientName" :rules="[{required:true}]">
              <a-input v-model:value="form.patientName" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Tên bác sĩ" name="doctorName" :rules="[{required:true}]">
              <a-input v-model:value="form.doctorName" />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="Chẩn đoán">
              <a-input v-model:value="form.diagnosis" />
            </a-form-item>
          </a-col>
        </a-row>

        <a-divider>Danh sách thuốc</a-divider>

        <div v-for="(item, idx) in form.items" :key="idx" style="margin-bottom:12px">
          <a-card size="small" :title="`Thuốc #${idx+1}`"
            :extra="form.items.length > 1 ? undefined : null">
            <template #extra>
              <a-button v-if="form.items.length > 1" danger size="small" @click="removeItem(idx)"><MinusOutlined /></a-button>
            </template>
            <a-row :gutter="12">
              <a-col :span="8">
                <a-form-item label="Chọn thuốc">
                  <a-select v-model:value="item.medicineId" show-search placeholder="Tìm thuốc..."
                    :options="medicineOptions" :filter-option="filterOption" style="width:100%" />
                </a-form-item>
              </a-col>
              <a-col :span="3">
                <a-form-item label="Số lượng">
                  <a-input-number v-model:value="item.quantity" :min="1" style="width:100%" />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="Liều dùng">
                  <a-input v-model:value="item.dosage" placeholder="1 viên/ngày" />
                </a-form-item>
              </a-col>
              <a-col :span="5">
                <a-form-item label="Cách dùng">
                  <a-input v-model:value="item.usage" placeholder="Uống sau ăn" />
                </a-form-item>
              </a-col>
              <a-col :span="3">
                <a-form-item label="Số ngày">
                  <a-input-number v-model:value="item.durationDays" :min="1" style="width:100%" />
                </a-form-item>
              </a-col>
            </a-row>
          </a-card>
        </div>

        <a-button dashed block @click="addItem" style="margin-bottom:16px">
          <PlusOutlined /> Thêm thuốc
        </a-button>

        <a-form-item>
          <a-space>
            <a-button type="primary" html-type="submit" :loading="loading">Tạo phiếu xuất</a-button>
            <a-button @click="router.back()">Hủy</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { dispensationService } from '@/services/dispensationService'
import { medicineService } from '@/services/medicineService'
import { message } from 'ant-design-vue'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const loading = ref(false)
const medicineOptions = ref<any[]>([])

const form = reactive({
  prescriptionId: '', patientId: '', doctorId: '',
  patientName: '', doctorName: '', diagnosis: '',
  items: [{ medicineId: '', quantity: 1, dosage: '', usage: '', durationDays: 7 }]
})

const addItem = () => form.items.push({ medicineId: '', quantity: 1, dosage: '', usage: '', durationDays: 7 })
const removeItem = (idx: number) => form.items.splice(idx, 1)
const filterOption = (input: string, option: any) =>
  option.label.toLowerCase().includes(input.toLowerCase())

const handleSubmit = async () => {
  loading.value = true
  try {
    const res = await dispensationService.create({ ...form })
    if (res.success) { message.success('Tạo phiếu xuất thuốc thành công!'); router.push('/dispensations') }
    else message.error(res.error)
  } finally { loading.value = false }
}

onMounted(async () => {
  const res = await medicineService.getAll({ activeOnly: true, pageSize: 200 })
  if (res.success && res.data) {
    medicineOptions.value = res.data.items.map(m => ({
      value: m.id,
      label: `${m.name} (${m.medicineCode}) - Tồn: ${m.stockQuantity}`
    }))
  }
})
</script>
