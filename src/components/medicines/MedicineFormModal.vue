<template>
  <a-modal
    :open="open"
    :title="medicine ? 'Chỉnh sửa thuốc' : 'Thêm thuốc mới'"
    width="700px"
    @ok="handleSubmit"
    :confirm-loading="loading"
    ok-text="Lưu"
    @cancel="emit('update:open', false)"
  >
    <a-form :model="form" layout="vertical">
      <a-row :gutter="12">
        <a-col :span="12">
          <a-form-item label="Tên thuốc *"><a-input v-model:value="form.name" /></a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Hoạt chất *"><a-input v-model:value="form.activeIngredient" /></a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="Đơn vị *">
            <a-select v-model:value="form.unit" style="width:100%">
              <a-select-option :value="1">Viên</a-select-option>
              <a-select-option :value="2">Chai</a-select-option>
              <a-select-option :value="3">Ống</a-select-option>
              <a-select-option :value="4">Gói</a-select-option>
              <a-select-option :value="5">Hộp</a-select-option>
              <a-select-option :value="6">Tuýp</a-select-option>
              <a-select-option :value="7">ml</a-select-option>
              <a-select-option :value="8">mg</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="Giá bán lẻ (VNĐ) *">
            <a-input-number v-model:value="form.unitPrice" :min="0" style="width:100%"
              :formatter="(v: any) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="Giá nhập (VNĐ) *">
            <a-input-number v-model:value="form.importPrice" :min="0" style="width:100%"
              :formatter="(v: any) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
          </a-form-item>
        </a-col>
        <a-col :span="8" v-if="!medicine">
          <a-form-item label="Tồn kho ban đầu">
            <a-input-number v-model:value="form.initialStock" :min="0" style="width:100%" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="Tồn kho tối thiểu">
            <a-input-number v-model:value="form.minimumStock" :min="0" style="width:100%" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="Nhóm thuốc">
            <a-input v-model:value="form.category" placeholder="Tim mạch, Hô hấp..." />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Nhà sản xuất">
            <a-input v-model:value="form.manufacturer" />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="Xuất xứ">
            <a-input v-model:value="form.countryOfOrigin" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Mô tả">
            <a-textarea v-model:value="form.description" :rows="2" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Tác dụng phụ">
            <a-textarea v-model:value="form.sideEffects" :rows="2" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="Điều kiện bảo quản">
            <a-input v-model:value="form.storageConditions" placeholder="Nhiệt độ phòng, tránh ánh sáng..." />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item>
            <a-checkbox v-model:checked="form.requiresPrescription">Thuốc kê đơn</a-checkbox>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { medicineService } from '@/services/medicineService'
import { message } from 'ant-design-vue'
import type { MedicineDto } from '@/types'
import { MedicineUnit } from '@/types'

const props = defineProps<{ open: boolean; medicine?: MedicineDto | null }>()
const emit = defineEmits(['update:open', 'saved'])
const loading = ref(false)

const form = reactive({
  name: '', activeIngredient: '', unit: MedicineUnit.Vien,
  unitPrice: 0, importPrice: 0, initialStock: 0, minimumStock: 10,
  category: '', manufacturer: '', countryOfOrigin: '',
  description: '', sideEffects: '', storageConditions: '',
  requiresPrescription: false, unitDescription: ''
})

watch(() => props.medicine, (m) => {
  if (m) {
    Object.assign(form, {
      name: m.name, activeIngredient: m.activeIngredient, unit: m.unit,
      unitPrice: m.unitPrice, importPrice: m.importPrice, minimumStock: m.minimumStock,
      category: m.category || '', manufacturer: m.manufacturer || '',
      countryOfOrigin: m.countryOfOrigin || '', description: m.description || '',
      sideEffects: m.sideEffects || '', storageConditions: m.storageConditions || '',
      requiresPrescription: m.requiresPrescription, unitDescription: m.unitDescription || ''
    })
  } else {
    Object.assign(form, {
      name: '', activeIngredient: '', unit: MedicineUnit.Vien,
      unitPrice: 0, importPrice: 0, initialStock: 0, minimumStock: 10,
      category: '', manufacturer: '', countryOfOrigin: '',
      description: '', sideEffects: '', storageConditions: '', requiresPrescription: false
    })
  }
}, { immediate: true })

const handleSubmit = async () => {
  if (!form.name || !form.activeIngredient) {
    message.warning('Vui lòng nhập tên thuốc và hoạt chất')
    return
  }
  loading.value = true
  try {
    const res = props.medicine
      ? await medicineService.update(props.medicine.id, { ...form })
      : await medicineService.create({ ...form })

    if (res.success) {
      message.success(props.medicine ? 'Cập nhật thành công!' : 'Thêm thuốc thành công!')
      emit('saved')
      emit('update:open', false)
    } else {
      message.error(res.error)
    }
  } finally {
    loading.value = false
  }
}
</script>
