<template>
  <a-modal
    :open="open"
    :title="`Nhập kho: ${medicine?.name ?? ''}`"
    @ok="handleSubmit"
    :confirm-loading="loading"
    ok-text="Xác nhận nhập kho"
    @cancel="emit('update:open', false)"
  >
    <a-descriptions bordered size="small" style="margin-bottom:16px">
      <a-descriptions-item label="Tồn kho hiện tại" :span="3">
        <a-tag :color="medicine?.isLowStock ? 'red' : 'green'">
          {{ medicine?.stockQuantity }} {{ medicine?.unitName }}
        </a-tag>
      </a-descriptions-item>
    </a-descriptions>

    <a-form :model="form" layout="vertical">
      <a-form-item label="Số lượng nhập *">
        <a-input-number v-model:value="form.quantity" :min="1" style="width:100%" size="large" />
      </a-form-item>
      <a-form-item label="Ghi chú">
        <a-textarea v-model:value="form.note" :rows="2" placeholder="Nhà cung cấp, số lô hàng..." />
      </a-form-item>
      <a-form-item label="Hạn sử dụng">
        <a-date-picker v-model:value="form.expiryDate" style="width:100%" placeholder="Chọn ngày hết hạn" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { medicineService } from '@/services/medicineService'
import { message } from 'ant-design-vue'
import type { MedicineDto } from '@/types'

const props = defineProps<{ open: boolean; medicine?: MedicineDto | null }>()
const emit = defineEmits(['update:open', 'saved'])
const loading = ref(false)
const form = reactive({ quantity: 1, note: '', expiryDate: null as any })

const handleSubmit = async () => {
  if (!props.medicine) return
  if (form.quantity <= 0) { message.warning('Số lượng phải lớn hơn 0'); return }
  loading.value = true
  try {
    const res = await medicineService.importStock(props.medicine.id, {
      quantity: form.quantity,
      note: form.note || undefined,
      expiryDate: form.expiryDate ? form.expiryDate.toISOString() : undefined
    })
    if (res.success) {
      message.success(`Đã nhập ${form.quantity} ${props.medicine.unitName} vào kho!`)
      form.quantity = 1
      form.note = ''
      form.expiryDate = null
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
