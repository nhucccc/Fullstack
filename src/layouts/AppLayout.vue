<template>
  <a-layout style="min-height: 100vh">
    <!-- Sidebar -->
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      width="240"
      style="background: #001529"
    >
      <!-- Logo -->
      <div class="logo">
        <MedicineBoxOutlined style="font-size: 22px; color: #1890ff" />
        <span v-if="!collapsed" class="logo-text">Phòng Khám</span>
      </div>

      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="inline"
        :items="menuItems"
        @click="handleMenuClick"
      />
    </a-layout-sider>

    <a-layout>
      <!-- Header -->
      <a-layout-header style="background: #fff; padding: 0 16px; display: flex; align-items: center; justify-content: space-between; box-shadow: 0 1px 4px rgba(0,21,41,.08)">
        <a-button type="text" @click="collapsed = !collapsed">
          <MenuFoldOutlined v-if="!collapsed" />
          <MenuUnfoldOutlined v-else />
        </a-button>

        <div style="display: flex; align-items: center; gap: 12px">
          <!-- Notification bell (low stock) -->
          <a-badge :count="lowStockCount" :max="99">
            <a-button type="text" shape="circle" @click="router.push('/medicines?filter=lowstock')">
              <BellOutlined />
            </a-button>
          </a-badge>

          <!-- User dropdown -->
          <a-dropdown>
            <a-space style="cursor: pointer">
              <a-avatar :style="{ backgroundColor: avatarColor }">
                {{ authStore.user?.fullName?.charAt(0).toUpperCase() }}
              </a-avatar>
              <span style="font-weight: 500">{{ authStore.user?.fullName }}</span>
              <a-tag :color="roleColor" style="margin: 0">{{ authStore.user?.roleName }}</a-tag>
            </a-space>
            <template #overlay>
              <a-menu>
                <a-menu-item key="profile" @click="router.push('/profile')">
                  <UserOutlined /> Hồ sơ cá nhân
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" danger @click="handleLogout">
                  <LogoutOutlined /> Đăng xuất
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>

      <!-- Content -->
      <a-layout-content style="margin: 16px; overflow: auto">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </a-layout-content>

      <!-- Footer -->
      <a-layout-footer style="text-align: center; padding: 12px; color: #8c8c8c; font-size: 13px">
        Hệ thống Đặt lịch &amp; Quản lý Phòng khám © 2026 — Đề tài 05 | Pharmacy &amp; Billing Service
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { medicineService } from '@/services/medicineService'
import { UserRole } from '@/types'
import { getRoleColor } from '@/utils/format'
import {
  DashboardOutlined, MedicineBoxOutlined, FileTextOutlined,
  DollarOutlined, UserOutlined, BarChartOutlined,
  LogoutOutlined, BellOutlined, MenuFoldOutlined, MenuUnfoldOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const collapsed = ref(false)
const lowStockCount = ref(0)

const selectedKeys = computed(() => {
  const path = route.path
  if (path.startsWith('/medicines')) return ['medicines']
  if (path.startsWith('/dispensations')) return ['dispensations']
  if (path.startsWith('/invoices')) return ['invoices']
  if (path.startsWith('/users')) return ['users']
  if (path.startsWith('/reports')) return ['reports']
  if (path.startsWith('/my-invoices')) return ['my-invoices']
  if (path.startsWith('/my-prescriptions')) return ['my-prescriptions']
  return ['dashboard']
})

const roleColor = computed(() => getRoleColor(authStore.user?.role ?? UserRole.Patient))

const avatarColor = computed(() => {
  const colors = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae', '#1890ff']
  const idx = (authStore.user?.fullName?.charCodeAt(0) ?? 0) % colors.length
  return colors[idx]
})

// Build menu based on role
const menuItems = computed(() => {
  const role = authStore.user?.role
  const items: any[] = []

  if (role === UserRole.Admin || role === UserRole.Nurse) {
    items.push({ key: 'dashboard', icon: () => h(DashboardOutlined), label: 'Tổng quan' })
  }

  items.push({ key: 'medicines', icon: () => h(MedicineBoxOutlined), label: 'Kho thuốc' })

  if (role !== UserRole.Patient) {
    items.push({ key: 'dispensations', icon: () => h(FileTextOutlined), label: 'Phiếu xuất thuốc' })
  }

  if (role === UserRole.Admin || role === UserRole.Nurse) {
    items.push({ key: 'invoices', icon: () => h(DollarOutlined), label: 'Hóa đơn viện phí' })
  }

  if (role === UserRole.Admin) {
    items.push({ key: 'users', icon: () => h(UserOutlined), label: 'Người dùng' })
    items.push({ key: 'reports', icon: () => h(BarChartOutlined), label: 'Báo cáo' })
  }

  if (role === UserRole.Patient) {
    items.push({ key: 'my-invoices', icon: () => h(DollarOutlined), label: 'Hóa đơn của tôi' })
    items.push({ key: 'my-prescriptions', icon: () => h(FileTextOutlined), label: 'Đơn thuốc của tôi' })
  }

  return items
})

const handleMenuClick = ({ key }: any) => {
  router.push(`/${key}`)
}

const handleLogout = async () => {
  await authStore.logout()
  message.success('Đã đăng xuất')
  router.push('/login')
}

onMounted(async () => {
  if (authStore.user?.role === UserRole.Admin || authStore.user?.role === UserRole.Nurse) {
    const res = await medicineService.getLowStock()
    if (res.success && res.data) lowStockCount.value = res.data.length
  }
})
</script>

<style scoped>
.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: white;
  font-size: 18px;
  font-weight: 700;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.logo-text {
  white-space: nowrap;
  overflow: hidden;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
