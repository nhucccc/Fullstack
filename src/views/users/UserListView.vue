<template>
  <div>
    <a-page-header title="Quản lý người dùng" />
    <a-card style="margin-bottom:16px">
      <a-row :gutter="12">
        <a-col :span="8">
          <a-input-search v-model:value="filters.keyword" placeholder="Tìm tên, username, email..." allow-clear @search="fetchData" />
        </a-col>
        <a-col :span="5">
          <a-select v-model:value="filters.role" placeholder="Vai trò" allow-clear style="width:100%" @change="fetchData">
            <a-select-option value="Admin">Admin</a-select-option>
            <a-select-option value="Doctor">Bác sĩ</a-select-option>
            <a-select-option value="Nurse">Y tá</a-select-option>
            <a-select-option value="Patient">Bệnh nhân</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="5">
          <a-select v-model:value="(filters as any).isActive" placeholder="Trạng thái" allow-clear style="width:100%" @change="fetchData">
            <a-select-option :value="true">Đang hoạt động</a-select-option>
            <a-select-option :value="false">Đã khóa</a-select-option>
          </a-select>
        </a-col>
        <a-col :span="3">
          <a-button @click="showCreateModal = true" type="primary"><PlusOutlined /> Thêm</a-button>
        </a-col>
      </a-row>
    </a-card>

    <a-card>
      <a-table :dataSource="users" :columns="columns" :loading="loading"
        :pagination="{ current: page, pageSize, total, showTotal: (t: number) => `Tổng ${t} người dùng` }"
        row-key="id" @change="handleTableChange">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'user'">
            <a-space>
              <a-avatar :style="{ backgroundColor: '#1890ff' }">{{ record.fullName.charAt(0) }}</a-avatar>
              <div>
                <div><strong>{{ record.fullName }}</strong></div>
                <div style="color:#8c8c8c; font-size:12px">{{ record.username }}</div>
              </div>
            </a-space>
          </template>
          <template v-if="column.key === 'role'">
            <a-tag :color="getRoleColor(record.role)">{{ getRoleLabel(record.role) }}</a-tag>
          </template>
          <template v-if="column.key === 'status'">
            <a-badge :status="record.isActive ? 'success' : 'error'" :text="record.isActive ? 'Hoạt động' : 'Đã khóa'" />
          </template>
          <template v-if="column.key === 'actions'">
            <a-popconfirm :title="record.isActive ? 'Khóa tài khoản?' : 'Mở khóa tài khoản?'" @confirm="toggleActive(record.id)">
              <a-button type="link" size="small" :danger="record.isActive">
                {{ record.isActive ? 'Khóa' : 'Mở khóa' }}
              </a-button>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Create User Modal -->
    <a-modal v-model:open="showCreateModal" title="Thêm người dùng mới" @ok="handleCreate" ok-text="Tạo tài khoản" :confirm-loading="createLoading">
      <a-form :model="createForm" layout="vertical">
        <a-row :gutter="12">
          <a-col :span="12"><a-form-item label="Username"><a-input v-model:value="createForm.username" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="Họ tên"><a-input v-model:value="createForm.fullName" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="Email"><a-input v-model:value="createForm.email" /></a-form-item></a-col>
          <a-col :span="12"><a-form-item label="Mật khẩu"><a-input-password v-model:value="createForm.password" /></a-form-item></a-col>
          <a-col :span="12">
            <a-form-item label="Vai trò">
              <a-select v-model:value="createForm.role">
                <a-select-option value="Admin">Admin</a-select-option>
                <a-select-option value="Doctor">Bác sĩ</a-select-option>
                <a-select-option value="Nurse">Y tá / Tiếp tân</a-select-option>
                <a-select-option value="Patient">Bệnh nhân</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12"><a-form-item label="SĐT"><a-input v-model:value="createForm.phoneNumber" /></a-form-item></a-col>
        </a-row>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { userService } from '@/services/userService'
import { getRoleLabel, getRoleColor } from '@/utils/format'
import type { UserDto } from '@/types'
import { UserRole } from '@/types'
import { PlusOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const loading = ref(false)
const users = ref<UserDto[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const showCreateModal = ref(false)
const createLoading = ref(false)
const filters = reactive({ keyword: '', role: undefined as number | undefined, isActive: undefined as boolean | undefined })
const createForm = reactive({ username: '', password: '', fullName: '', email: '', phoneNumber: '', role: UserRole.Doctor })

const columns: any[] = [
  { title: 'Người dùng', key: 'user' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Điện thoại', dataIndex: 'phoneNumber', key: 'phone' },
  { title: 'Vai trò', key: 'role', align: 'center' },
  { title: 'Trạng thái', key: 'status', align: 'center' },
  { title: 'Thao tác', key: 'actions', width: 100 }
]

const fetchData = async () => {
  loading.value = true
  try {
    const res = await userService.getAll({ ...filters, page: page.value, pageSize: pageSize.value })
    if (res.success && res.data) { users.value = res.data.items; total.value = res.data.totalCount }
  } finally { loading.value = false }
}

const toggleActive = async (id: string) => {
  await userService.toggleActive(id)
  message.success('Cập nhật trạng thái thành công')
  fetchData()
}

const handleCreate = async () => {
  createLoading.value = true
  try {
    const res = await authStore.register({ ...createForm, confirmPassword: createForm.password })
    if (res) { message.success('Tạo tài khoản thành công!'); showCreateModal.value = false; fetchData() }
  } finally { createLoading.value = false }
}

const handleTableChange = (p: any) => { page.value = p.current; fetchData() }

onMounted(fetchData)
</script>
