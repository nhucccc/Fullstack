<template>
  <div class="app-shell">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed }">
      <!-- Logo -->
      <div class="sidebar-logo" @click="router.push('/app/dashboard')">
        <div class="logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
        </div>
        <transition name="slide-fade">
          <div v-if="!collapsed" class="logo-text">
            <span class="logo-name">MediCare</span>
            <span class="logo-version">Pharmacy v1.0</span>
          </div>
        </transition>
      </div>

      <!-- Nav groups -->
      <div class="nav-scroll">
        <div v-for="group in navGroups" :key="group.title" class="nav-group">
          <transition name="slide-fade">
            <div v-if="!collapsed" class="nav-group-title">{{ group.title }}</div>
          </transition>
          <router-link
            v-for="item in group.items"
            :key="item.key"
            :to="`/app/${item.key}`"
            class="nav-item"
            :class="{ active: isActive(item.key) }"
            :title="collapsed ? item.label : undefined"
          >
            <div class="nav-icon-wrap">
              <component :is="item.icon" class="nav-icon" />
            </div>
            <transition name="slide-fade">
              <span v-if="!collapsed" class="nav-label">{{ item.label }}</span>
            </transition>
            <transition name="slide-fade">
              <span v-if="!collapsed && item.badge > 0" class="nav-badge">{{ item.badge }}</span>
            </transition>
          </router-link>
        </div>
      </div>

      <!-- Sidebar footer -->
      <div class="sidebar-footer">
        <div class="footer-user" :class="{ collapsed }" @click="router.push('/app/profile')">
          <div class="footer-avatar" :style="{ background: avatarBg }">
            {{ authStore.user?.fullName?.charAt(0).toUpperCase() }}
          </div>
          <transition name="slide-fade">
            <div v-if="!collapsed" class="footer-info">
              <span class="footer-name">{{ authStore.user?.fullName }}</span>
              <span class="footer-role">{{ authStore.user?.roleName }}</span>
            </div>
          </transition>
        </div>
        <button class="sidebar-toggle" @click="collapsed = !collapsed" :title="collapsed ? 'Mở rộng' : 'Thu gọn'">
          <DoubleLeftOutlined :rotate="collapsed ? 180 : 0" />
        </button>
      </div>
    </aside>

    <!-- Main -->
    <div class="main-wrapper" :class="{ expanded: collapsed }">
      <!-- Topbar -->
      <header class="topbar">
        <div class="topbar-left">
          <div class="topbar-breadcrumb">
            <span class="topbar-section">Pharmacy & Billing</span>
            <span class="topbar-sep">/</span>
            <span class="topbar-page">{{ currentTitle }}</span>
          </div>
        </div>

        <div class="topbar-right">
          <!-- Search hint -->
          <div class="search-hint">
            <SearchOutlined />
            <span>Tìm kiếm...</span>
            <kbd>⌘K</kbd>
          </div>

          <!-- Bell -->
          <a-tooltip placement="bottom" :title="lowStockCount ? `${lowStockCount} thuốc sắp hết kho` : 'Không có cảnh báo'">
            <button class="topbar-btn" @click="router.push('/app/medicines?filter=low')">
              <a-badge :count="lowStockCount" :dot="false" size="small">
                <BellOutlined />
              </a-badge>
            </button>
          </a-tooltip>

          <!-- Divider -->
          <div class="topbar-divider"></div>

          <!-- User menu -->
          <a-dropdown trigger="click" placement="bottomRight">
            <button class="topbar-user">
              <div class="tu-avatar" :style="{ background: avatarBg }">
                {{ authStore.user?.fullName?.charAt(0).toUpperCase() }}
              </div>
              <div class="tu-info">
                <span class="tu-name">{{ authStore.user?.fullName }}</span>
                <span :class="`tu-role role-${authStore.user?.role?.toLowerCase()}`">
                  {{ authStore.user?.roleName }}
                </span>
              </div>
              <DownOutlined class="tu-caret" />
            </button>
            <template #overlay>
              <div class="user-menu">
                <div class="um-header">
                  <div class="um-avatar" :style="{ background: avatarBg }">
                    {{ authStore.user?.fullName?.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <div class="um-name">{{ authStore.user?.fullName }}</div>
                    <div class="um-email">{{ authStore.user?.email }}</div>
                  </div>
                </div>
                <div class="um-divider"></div>
                <button class="um-item" @click="router.push('/app/profile')">
                  <UserOutlined /> Hồ sơ cá nhân
                </button>
                <button class="um-item" @click="router.push('/')">
                  <HomeOutlined /> Về trang chủ
                </button>
                <div class="um-divider"></div>
                <button class="um-item danger" @click="handleLogout">
                  <LogoutOutlined /> Đăng xuất
                </button>
              </div>
            </template>
          </a-dropdown>
        </div>
      </header>

      <!-- Page content -->
      <main class="page-content">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>

      <!-- Footer -->
      <footer class="page-footer">
        <span>Hệ thống Quản lý Phòng khám © 2026</span>
        <span class="footer-sep">·</span>
        <span>Đề tài 05 — Pharmacy &amp; Billing Service</span>
        <span class="footer-sep">·</span>
        <span>v1.0.0</span>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { medicineService } from '@/services/medicineService'
import { UserRole } from '@/types'
import {
  DashboardOutlined, MedicineBoxOutlined, FileTextOutlined, DollarOutlined,
  UserOutlined, BarChartOutlined, LogoutOutlined, BellOutlined,
  SearchOutlined, DoubleLeftOutlined, DownOutlined, AppstoreOutlined, HomeOutlined
} from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

const router  = useRouter()
const route   = useRoute()
const authStore = useAuthStore()
const collapsed    = ref(false)
const lowStockCount = ref(0)

const isActive = (key: string) => route.path.startsWith(`/app/${key}`)

const currentTitle = computed(() => {
  const path = route.path.replace('/app/', '')
  const map: Record<string, string> = {
    dashboard: 'Tổng quan', medicines: 'Kho thuốc',
    dispensations: 'Phiếu xuất thuốc', invoices: 'Hóa đơn viện phí',
    users: 'Người dùng', reports: 'Báo cáo', profile: 'Hồ sơ cá nhân',
    'my-invoices': 'Hóa đơn của tôi', 'my-prescriptions': 'Đơn thuốc của tôi',
  }
  for (const [k, v] of Object.entries(map)) {
    if (path.startsWith(k)) return v
  }
  return 'MediCare'
})

const avatarBg = computed(() => {
  const p = ['#2563eb','#16a34a','#dc2626','#7c3aed','#d97706']
  return p[(authStore.user?.fullName?.charCodeAt(0) ?? 0) % p.length]
})

const role = computed(() => authStore.user?.role)

const navGroups = computed(() => {
  const r = role.value
  const groups: any[] = []

  // ── ADMIN ───────────────────────────────────────────────────
  if (r === UserRole.Admin) {
    groups.push({ title: 'Quản lý', items: [
      { key: 'dashboard',     label: 'Tổng quan',          icon: DashboardOutlined,   badge: 0 },
      { key: 'medicines',     label: 'Kho thuốc',           icon: MedicineBoxOutlined, badge: lowStockCount.value },
      { key: 'dispensations', label: 'Phiếu xuất thuốc',   icon: FileTextOutlined,    badge: 0 },
      { key: 'invoices',      label: 'Hóa đơn viện phí',   icon: DollarOutlined,      badge: 0 },
    ]})
    groups.push({ title: 'Hệ thống', items: [
      { key: 'users',   label: 'Người dùng', icon: UserOutlined,     badge: 0 },
      { key: 'reports', label: 'Báo cáo',    icon: BarChartOutlined, badge: 0 },
    ]})
  }

  // ── Y TÁ / TIẾP TÂN ────────────────────────────────────────
  if (r === UserRole.Nurse) {
    groups.push({ title: 'Quản lý', items: [
      { key: 'dashboard',     label: 'Tổng quan',          icon: DashboardOutlined,   badge: 0 },
      { key: 'medicines',     label: 'Kho thuốc',           icon: MedicineBoxOutlined, badge: lowStockCount.value },
      { key: 'dispensations', label: 'Phiếu xuất thuốc',   icon: FileTextOutlined,    badge: 0 },
      { key: 'invoices',      label: 'Hóa đơn viện phí',   icon: DollarOutlined,      badge: 0 },
    ]})
  }

  // ── BÁC SĨ ──────────────────────────────────────────────────
  if (r === UserRole.Doctor) {
    groups.push({ title: 'Tra cứu', items: [
      { key: 'medicines',     label: 'Danh mục thuốc',     icon: MedicineBoxOutlined, badge: 0 },
      { key: 'dispensations', label: 'Phiếu xuất thuốc',   icon: FileTextOutlined,    badge: 0 },
    ]})
  }

  // ── BỆNH NHÂN ───────────────────────────────────────────────
  if (r === UserRole.Patient) {
    groups.push({ title: 'Của tôi', items: [
      { key: 'my-invoices',      label: 'Hóa đơn của tôi',   icon: DollarOutlined,   badge: 0 },
      { key: 'my-prescriptions', label: 'Đơn thuốc của tôi', icon: FileTextOutlined, badge: 0 },
    ]})
    groups.push({ title: 'Tra cứu', items: [
      { key: 'medicines', label: 'Danh mục thuốc', icon: MedicineBoxOutlined, badge: 0 },
    ]})
  }

  // Profile - tất cả đều có
  groups.push({ title: 'Tài khoản', items: [
    { key: 'profile', label: 'Hồ sơ cá nhân', icon: UserOutlined, badge: 0 }
  ]})

  return groups
})

const handleLogout = async () => {
  await authStore.logout()
  message.success('Đã đăng xuất thành công')
  router.push('/')
}

onMounted(async () => {
  if (authStore.canManageMedicines) {
    const res = await medicineService.getLowStock()
    if (res.success && res.data) lowStockCount.value = res.data.length
  }
})
</script>

<style scoped>
/* Shell */
.app-shell { display: flex; min-height: 100vh; }

/* Sidebar */
.sidebar {
  width: 240px;
  min-height: 100vh;
  background: #0f172a;
  position: fixed;
  top: 0; left: 0; bottom: 0;
  z-index: 200;
  display: flex;
  flex-direction: column;
  transition: width 0.25s cubic-bezier(0.4,0,0.2,1);
  overflow: hidden;
}
.sidebar.collapsed { width: 64px; }

/* Logo */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 16px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  min-height: 64px;
}
.logo-icon {
  width: 36px; height: 36px;
  background: #2563eb;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(37,99,235,0.25);
}
.logo-text { min-width: 0; }
.logo-name    { display: block; font-size: 15px; font-weight: 700; color: white; white-space: nowrap; }
.logo-version { display: block; font-size: 11px; color: rgba(255,255,255,0.35); margin-top: 1px; white-space: nowrap; }

/* Nav */
.nav-scroll { flex: 1; overflow-y: auto; padding: 12px 8px; }
.nav-scroll::-webkit-scrollbar { width: 0; }
.nav-group { margin-bottom: 8px; }
.nav-group-title {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: rgba(255,255,255,0.25);
  padding: 8px 10px 4px;
  white-space: nowrap;
}
.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 9px;
  cursor: pointer;
  transition: all 0.15s;
  color: rgba(255,255,255,0.5);
  text-decoration: none;
  position: relative;
  margin-bottom: 1px;
  white-space: nowrap;
}
.nav-item:hover { background: rgba(255,255,255,0.07); color: rgba(255,255,255,0.85); }
.nav-item.active {
  background: rgba(37,99,235,0.2);
  color: #93c5fd;
  border: 1px solid rgba(37,99,235,0.3);
}
.nav-item.active .nav-icon-wrap { color: #3b82f6; }
.nav-icon-wrap { width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.nav-icon { font-size: 16px; }
.nav-label { font-size: 13px; font-weight: 500; flex: 1; }
.nav-badge {
  background: #ef4444;
  color: white;
  font-size: 10px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

/* Sidebar footer */
.sidebar-footer {
  border-top: 1px solid rgba(255,255,255,0.06);
  padding: 12px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.footer-user {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 9px;
  cursor: pointer;
  transition: background 0.15s;
  min-width: 0;
}
.footer-user:hover { background: rgba(255,255,255,0.07); }
.footer-user.collapsed { justify-content: center; }
.footer-avatar {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 13px;
  flex-shrink: 0;
}
.footer-info { min-width: 0; }
.footer-name { display: block; font-size: 13px; font-weight: 600; color: white; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.footer-role { display: block; font-size: 11px; color: rgba(255,255,255,0.35); }
.sidebar-toggle {
  width: 30px; height: 30px;
  background: rgba(255,255,255,0.06);
  border: none; border-radius: 7px;
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  font-size: 12px;
  transition: all 0.15s;
}
.sidebar-toggle:hover { background: rgba(255,255,255,0.12); color: white; }

/* Main wrapper */
.main-wrapper {
  flex: 1;
  margin-left: 240px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  transition: margin-left 0.25s cubic-bezier(0.4,0,0.2,1);
}
.main-wrapper.expanded { margin-left: 64px; }

/* Topbar */
.topbar {
  height: 60px;
  background: white;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky; top: 0; z-index: 100;
  box-shadow: 0 1px 0 #f1f5f9;
}
.topbar-breadcrumb { display: flex; align-items: center; gap: 8px; }
.topbar-section { font-size: 13px; color: var(--gray-400); font-weight: 500; }
.topbar-sep { color: var(--gray-300); font-size: 13px; }
.topbar-page { font-size: 14px; font-weight: 600; color: var(--gray-800); }

.topbar-right { display: flex; align-items: center; gap: 4px; }
.search-hint {
  display: flex; align-items: center; gap: 8px;
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  padding: 6px 12px;
  font-size: 13px;
  color: var(--gray-400);
  cursor: pointer;
  transition: all 0.15s;
  margin-right: 4px;
}
.search-hint:hover { border-color: var(--primary-light); color: var(--primary); }
.search-hint kbd {
  background: var(--gray-200); border-radius: 4px;
  padding: 1px 5px; font-size: 11px; color: var(--gray-500);
  font-family: inherit;
}
.topbar-btn {
  width: 36px; height: 36px;
  background: transparent; border: none; border-radius: 8px;
  cursor: pointer; color: var(--gray-500);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px;
  transition: all 0.15s;
}
.topbar-btn:hover { background: var(--gray-100); color: var(--gray-800); }
.topbar-divider { width: 1px; height: 24px; background: var(--gray-200); margin: 0 8px; }

.topbar-user {
  display: flex; align-items: center; gap: 8px;
  background: transparent; border: none;
  border-radius: 10px; padding: 5px 10px 5px 5px;
  cursor: pointer; transition: background 0.15s;
}
.topbar-user:hover { background: var(--gray-100); }
.tu-avatar {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 13px;
}
.tu-info { display: flex; flex-direction: column; text-align: left; }
.tu-name { font-size: 13px; font-weight: 600; color: var(--gray-800); line-height: 1.3; }
.tu-role { font-size: 11px; line-height: 1.3; font-weight: 500; border-radius: 4px; padding: 0 4px; }
.role-admin   { color: #1d4ed8; background: #dbeafe; }
.role-nurse   { color: #15803d; background: #dcfce7; }
.role-doctor  { color: #6d28d9; background: #ede9fe; }
.role-patient { color: #c2410c; background: #ffedd5; }
.tu-caret { font-size: 10px; color: var(--gray-400); }

/* User dropdown */
.user-menu {
  width: 220px;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 14px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.12);
  overflow: hidden;
  padding: 4px;
}
.um-header {
  display: flex; align-items: center; gap: 12px;
  padding: 12px;
  border-radius: 10px;
}
.um-avatar {
  width: 38px; height: 38px;
  border-radius: 9px;
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 700; font-size: 14px;
}
.um-name  { font-size: 14px; font-weight: 600; color: var(--gray-900); }
.um-email { font-size: 12px; color: var(--gray-400); margin-top: 1px; }
.um-divider { height: 1px; background: var(--gray-100); margin: 2px 0; }
.um-item {
  display: flex; align-items: center; gap: 10px;
  width: 100%; padding: 9px 12px;
  background: none; border: none;
  border-radius: 8px;
  font-size: 14px; font-weight: 500;
  color: var(--gray-700);
  cursor: pointer;
  transition: background 0.1s;
  text-align: left;
}
.um-item:hover { background: var(--gray-100); }
.um-item.danger { color: #dc2626; }
.um-item.danger:hover { background: #fef2f2; }

/* Page content */
.page-content {
  flex: 1;
  padding: 24px;
}
.page-footer {
  display: flex; align-items: center; justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  font-size: 12px;
  color: var(--gray-400);
  border-top: 1px solid var(--gray-100);
  background: white;
}
.footer-sep { color: var(--gray-200); }

/* Transitions */
.slide-fade-enter-active, .slide-fade-leave-active { transition: opacity 0.15s, transform 0.15s; }
.slide-fade-enter-from, .slide-fade-leave-to { opacity: 0; transform: translateX(-6px); }

.page-fade-enter-active, .page-fade-leave-active { transition: opacity 0.18s, transform 0.18s; }
.page-fade-enter-from { opacity: 0; transform: translateY(6px); }
.page-fade-leave-to   { opacity: 0; }
</style>
