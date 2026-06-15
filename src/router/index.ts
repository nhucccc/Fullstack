import { createRouter, createWebHistory } from 'vue-router'
import { UserRole } from '@/types'

const router = createRouter({
  history: createWebHistory(),
  routes: [
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
    {
      path: '/',
      component: () => import('@/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        { path: '',              redirect: { name: 'Dashboard' } },
        { path: 'dashboard',    name: 'Dashboard',          component: () => import('@/views/DashboardView.vue'),                          meta: { title: 'Tổng quan',             roles: [UserRole.Admin, UserRole.Nurse] } },
        { path: 'medicines',    name: 'Medicines',          component: () => import('@/views/medicines/MedicineListView.vue'),              meta: { title: 'Quản lý thuốc' } },
        { path: 'medicines/:id',name: 'MedicineDetail',     component: () => import('@/views/medicines/MedicineDetailView.vue'),            meta: { title: 'Chi tiết thuốc' } },
        { path: 'dispensations/create', name: 'DispensationCreate', component: () => import('@/views/dispensations/DispensationCreateView.vue'), meta: { title: 'Tạo phiếu xuất thuốc', roles: [UserRole.Admin, UserRole.Nurse] } },
        { path: 'dispensations',name: 'Dispensations',      component: () => import('@/views/dispensations/DispensationListView.vue'),      meta: { title: 'Phiếu xuất thuốc' } },
        { path: 'dispensations/:id', name: 'DispensationDetail', component: () => import('@/views/dispensations/DispensationDetailView.vue'), meta: { title: 'Chi tiết phiếu xuất thuốc' } },
        { path: 'invoices/create', name: 'InvoiceCreate',   component: () => import('@/views/invoices/InvoiceCreateView.vue'),              meta: { title: 'Tạo hóa đơn',          roles: [UserRole.Admin, UserRole.Nurse] } },
        { path: 'invoices',     name: 'Invoices',           component: () => import('@/views/invoices/InvoiceListView.vue'),                meta: { title: 'Hóa đơn viện phí',     roles: [UserRole.Admin, UserRole.Nurse] } },
        { path: 'invoices/:id', name: 'InvoiceDetail',      component: () => import('@/views/invoices/InvoiceDetailView.vue'),              meta: { title: 'Chi tiết hóa đơn' } },
        { path: 'users',        name: 'Users',              component: () => import('@/views/users/UserListView.vue'),                      meta: { title: 'Quản lý người dùng',    roles: [UserRole.Admin] } },
        { path: 'reports',      name: 'Reports',            component: () => import('@/views/ReportsView.vue'),                             meta: { title: 'Báo cáo doanh thu',    roles: [UserRole.Admin] } },
        { path: 'profile',      name: 'Profile',            component: () => import('@/views/ProfileView.vue'),                             meta: { title: 'Hồ sơ cá nhân' } },
        { path: 'my-invoices',  name: 'MyInvoices',         component: () => import('@/views/patient/MyInvoicesView.vue'),                  meta: { title: 'Hóa đơn của tôi',      roles: [UserRole.Patient] } },
        { path: 'my-prescriptions', name: 'MyPrescriptions', component: () => import('@/views/patient/MyPrescriptionsView.vue'),            meta: { title: 'Đơn thuốc của tôi',    roles: [UserRole.Patient] } },
      ]
    },
  ]
})

router.beforeEach(async (to) => {
  const { useAuthStore } = await import('@/stores/auth')
  const authStore = useAuthStore()

  authStore.init()

  document.title = `${String(to.meta.title ?? 'Phòng Khám')} | Đề tài 05 - Quản lý Phòng khám`

  // Chưa đăng nhập → về login (chỉ khi route yêu cầu auth)
  if (to.meta.requiresAuth !== false && !authStore.isAuthenticated) {
    if (to.name !== 'Login') {
      return { name: 'Login', query: { redirect: to.fullPath } }
    }
    return // đã ở Login rồi, không redirect nữa
  }

  // Đã đăng nhập mà vào login → về dashboard
  if (to.name === 'Login' && authStore.isAuthenticated) {
    return { name: 'Dashboard' }
  }

  // Kiểm tra role
  const allowedRoles = to.meta.roles as UserRole[] | undefined
  if (allowedRoles && authStore.user && !allowedRoles.includes(authStore.user.role)) {
    // Doctor không có dashboard → về medicines
    if (to.name !== 'Medicines') return { name: 'Medicines' }
    return
  }
})

export default router
