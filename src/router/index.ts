import { createRouter, createWebHistory } from 'vue-router'
import { UserRole } from '@/types'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ── PUBLIC (không cần đăng nhập, kể cả đã đăng nhập vẫn vào được) ──
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: false, isPublicPage: true, title: 'Trang chủ' }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { requiresAuth: false, title: 'Đăng nhập' }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { requiresAuth: false, title: 'Đăng ký' }
    },

    // ── APP (cần đăng nhập) ──────────────────────────────────
    {
      path: '/app',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        // Redirect mặc định theo role (xử lý trong guard)
        { path: '',        redirect: '/app/dashboard' },

        // Admin + Nurse
        { path: 'dashboard',    name: 'Dashboard',       component: () => import('@/views/DashboardView.vue'),                          meta: { title: 'Tổng quan',           roles: [UserRole.Admin, UserRole.Nurse] } },

        // Tất cả roles
        { path: 'medicines',    name: 'Medicines',       component: () => import('@/views/medicines/MedicineListView.vue'),              meta: { title: 'Kho thuốc' } },
        { path: 'medicines/:id',name: 'MedicineDetail',  component: () => import('@/views/medicines/MedicineDetailView.vue'),            meta: { title: 'Chi tiết thuốc' } },

        // Admin + Nurse: tạo dispensation
        { path: 'dispensations/create', name: 'DispensationCreate', component: () => import('@/views/dispensations/DispensationCreateView.vue'), meta: { title: 'Tạo phiếu xuất thuốc', roles: [UserRole.Admin, UserRole.Nurse] } },
        // Admin + Nurse + Doctor: xem dispensations
        { path: 'dispensations',     name: 'Dispensations',     component: () => import('@/views/dispensations/DispensationListView.vue'),      meta: { title: 'Phiếu xuất thuốc',    roles: [UserRole.Admin, UserRole.Nurse, UserRole.Doctor] } },
        { path: 'dispensations/:id', name: 'DispensationDetail', component: () => import('@/views/dispensations/DispensationDetailView.vue'),     meta: { title: 'Chi tiết phiếu xuất' } },

        // Admin + Nurse: invoices
        { path: 'invoices/create', name: 'InvoiceCreate', component: () => import('@/views/invoices/InvoiceCreateView.vue'),  meta: { title: 'Tạo hóa đơn', roles: [UserRole.Admin, UserRole.Nurse] } },
        { path: 'invoices',        name: 'Invoices',      component: () => import('@/views/invoices/InvoiceListView.vue'),    meta: { title: 'Hóa đơn viện phí', roles: [UserRole.Admin, UserRole.Nurse] } },
        { path: 'invoices/:id',    name: 'InvoiceDetail', component: () => import('@/views/invoices/InvoiceDetailView.vue'),  meta: { title: 'Chi tiết hóa đơn' } },

        // Admin only
        { path: 'users',   name: 'Users',   component: () => import('@/views/users/UserListView.vue'), meta: { title: 'Quản lý người dùng', roles: [UserRole.Admin] } },
        { path: 'reports', name: 'Reports', component: () => import('@/views/ReportsView.vue'),         meta: { title: 'Báo cáo doanh thu',  roles: [UserRole.Admin] } },

        // Tất cả roles
        { path: 'profile', name: 'Profile', component: () => import('@/views/ProfileView.vue'), meta: { title: 'Hồ sơ cá nhân' } },

        // Patient only
        { path: 'my-invoices',       name: 'MyInvoices',       component: () => import('@/views/patient/MyInvoicesView.vue'),       meta: { title: 'Hóa đơn của tôi',   roles: [UserRole.Patient] } },
        { path: 'my-prescriptions',  name: 'MyPrescriptions',  component: () => import('@/views/patient/MyPrescriptionsView.vue'),  meta: { title: 'Đơn thuốc của tôi', roles: [UserRole.Patient] } },
      ]
    },

    // Fallback
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

// ── Navigation Guard ───────────────────────────────────────────
router.beforeEach(async (to) => {
  const { useAuthStore } = await import('@/stores/auth')
  const authStore = useAuthStore()
  authStore.init()

  document.title = `${String(to.meta.title ?? 'MediCare')} | Pharmacy & Billing`

  // Trang isPublicPage (trang chủ) → ai cũng vào được kể cả đã login
  if (to.meta.isPublicPage) return

  // Chưa đăng nhập → về login
  if (to.meta.requiresAuth !== false && !authStore.isAuthenticated) {
    return { name: 'Login', query: { redirect: to.fullPath } }
  }

  // Đã đăng nhập mà vào /login hoặc /register → về app
  if ((to.name === 'Login' || to.name === 'Register') && authStore.isAuthenticated) {
    return getHomeRoute(authStore.user?.role)
  }

  // Kiểm tra role
  const allowedRoles = to.meta.roles as UserRole[] | undefined
  if (allowedRoles && authStore.user && !allowedRoles.includes(authStore.user.role)) {
    return getHomeRoute(authStore.user.role)
  }
})

function getHomeRoute(role?: UserRole) {
  if (role === UserRole.Patient) return { name: 'MyInvoices' }
  if (role === UserRole.Doctor)  return { name: 'Medicines' }
  return { name: 'Dashboard' }
}

export default router
