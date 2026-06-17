<template>
  <div class="home">
    <!-- NAVBAR -->
    <nav class="navbar" :class="{ scrolled: isScrolled }">
      <div class="nav-container">
        <div class="nav-brand">
          <div class="nav-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="nav-name">MediCare</span>
        </div>
        <div class="nav-links">
          <a href="#features" class="nav-link">Tính năng</a>
          <a href="#roles"    class="nav-link">Vai trò</a>
          <a href="#tech"     class="nav-link">Công nghệ</a>
          <a href="#about"    class="nav-link">Về chúng tôi</a>
        </div>
        <div class="nav-actions">
          <template v-if="authStore.isAuthenticated">
            <router-link to="/" class="btn-ghost">Trang chủ</router-link>
            <router-link :to="appHome" class="btn-primary-sm">Dashboard →</router-link>
          </template>
          <template v-else>
            <router-link to="/login" class="btn-ghost">Đăng nhập</router-link>
            <router-link to="/login" class="btn-primary-sm">Bắt đầu →</router-link>
          </template>
        </div>
        <button class="nav-mobile-btn" @click="mobileOpen = !mobileOpen">
          <MenuOutlined v-if="!mobileOpen" /><CloseOutlined v-else />
        </button>
      </div>
      <!-- Mobile menu -->
      <div class="mobile-menu" v-show="mobileOpen">
        <a href="#features" class="mobile-link" @click="mobileOpen=false">Tính năng</a>
        <a href="#roles"    class="mobile-link" @click="mobileOpen=false">Vai trò</a>
        <router-link to="/login" class="mobile-link" @click="mobileOpen=false">Đăng nhập</router-link>
      </div>
    </nav>

    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-orb orb-1"></div>
        <div class="hero-orb orb-2"></div>
        <div class="hero-grid"></div>
      </div>
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-dot"></span>
          Đề tài 05 — Hệ thống Quản lý Phòng khám
        </div>
        <h1 class="hero-title">
          Quản lý <span class="text-gradient">kho thuốc</span><br/>
          và viện phí <span class="text-gradient">thông minh</span>
        </h1>
        <p class="hero-desc">
          Hệ thống Pharmacy & Billing tích hợp đầy đủ — từ nhận đơn thuốc tự động qua RabbitMQ,
          xuất kho chính xác, đến tính và thu viện phí nhanh chóng.
        </p>
        <div class="hero-btns">
          <router-link :to="authStore.isAuthenticated ? appHome : '/login'" class="hero-btn-primary">
            {{ authStore.isAuthenticated ? 'Vào Dashboard' : 'Vào hệ thống' }} <ArrowRightOutlined />
          </router-link>
          <a href="#features" class="hero-btn-ghost">Xem tính năng</a>
        </div>
        <div class="hero-stats">
          <div class="hstat" v-for="s in heroStats" :key="s.label">
            <div class="hstat-val">{{ s.val }}</div>
            <div class="hstat-label">{{ s.label }}</div>
          </div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="dashboard-preview">
          <div class="dp-header">
            <div class="dp-dot red"></div><div class="dp-dot yellow"></div><div class="dp-dot green"></div>
            <span class="dp-url">localhost:3000/dashboard</span>
          </div>
          <div class="dp-body">
            <div class="dp-sidebar">
              <div class="dp-logo-mini"></div>
              <div class="dp-menu-item active"></div>
              <div class="dp-menu-item"></div>
              <div class="dp-menu-item"></div>
              <div class="dp-menu-item"></div>
              <div class="dp-menu-item"></div>
            </div>
            <div class="dp-main">
              <div class="dp-cards">
                <div class="dp-card c1"><div class="dc-num">142</div><div class="dc-lbl">Thuốc</div></div>
                <div class="dp-card c2"><div class="dc-num">28</div><div class="dc-lbl">Xuất hôm nay</div></div>
                <div class="dp-card c3"><div class="dc-num">12</div><div class="dc-lbl">Chờ thu</div></div>
                <div class="dp-card c4"><div class="dc-num">4.2M</div><div class="dc-lbl">Doanh thu</div></div>
              </div>
              <div class="dp-chart">
                <div class="dc-bar" v-for="h in chartBars" :key="h" :style="{height: h+'%'}"></div>
              </div>
              <div class="dp-table">
                <div class="dt-row header"><span>Mã thuốc</span><span>Tên thuốc</span><span>Tồn kho</span></div>
                <div class="dt-row" v-for="r in 4" :key="r">
                  <div class="dt-skeleton"></div><div class="dt-skeleton long"></div><div class="dt-skeleton short"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section class="section" id="features">
      <div class="section-container">
        <div class="section-header">
          <div class="section-badge">Tính năng</div>
          <h2 class="section-title">Đầy đủ chức năng quản lý</h2>
          <p class="section-sub">Được thiết kế cho quy trình thực tế tại phòng khám đa khoa</p>
        </div>
        <div class="features-grid">
          <div class="feature-card" v-for="f in features" :key="f.title">
            <div class="fc-icon" :style="{ background: f.bg, color: f.color }">
              <component :is="f.icon" />
            </div>
            <h3 class="fc-title">{{ f.title }}</h3>
            <p class="fc-desc">{{ f.desc }}</p>
            <ul class="fc-list">
              <li v-for="item in f.items" :key="item">
                <CheckCircleFilled class="fc-check" /> {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ROLES -->
    <section class="section section-gray" id="roles">
      <div class="section-container">
        <div class="section-header">
          <div class="section-badge">Phân quyền</div>
          <h2 class="section-title">4 vai trò người dùng</h2>
          <p class="section-sub">Mỗi vai trò có giao diện và chức năng riêng biệt</p>
        </div>
        <div class="roles-grid">
          <div
            class="role-card"
            v-for="role in roles"
            :key="role.name"
            :class="{ active: activeRole === role.name }"
            @click="activeRole = role.name"
          >
            <div class="rc-top">
              <div class="rc-icon" :style="{ background: role.bg }">
                <component :is="role.icon" :style="{ color: role.color }" />
              </div>
              <div>
                <div class="rc-name">{{ role.name }}</div>
                <div class="rc-count">{{ role.perms.length }} chức năng</div>
              </div>
            </div>
            <ul class="rc-perms" v-if="activeRole === role.name">
              <li v-for="p in role.perms" :key="p">
                <CheckOutlined style="color:#16a34a; font-size:12px" /> {{ p }}
              </li>
            </ul>
            <div class="rc-hint" v-else>Click để xem chi tiết →</div>
          </div>
        </div>
      </div>
    </section>

    <!-- TECH STACK -->
    <section class="section" id="tech">
      <div class="section-container">
        <div class="section-header">
          <div class="section-badge">Công nghệ</div>
          <h2 class="section-title">Tech stack hiện đại</h2>
          <p class="section-sub">Microservices architecture với các công nghệ enterprise</p>
        </div>
        <div class="tech-grid">
          <div class="tech-col" v-for="col in techStack" :key="col.title">
            <div class="tc-header">
              <component :is="col.icon" class="tc-icon" />
              <span class="tc-title">{{ col.title }}</span>
            </div>
            <div class="tc-items">
              <div class="tc-item" v-for="t in col.items" :key="t.name">
                <div class="tc-dot" :style="{ background: t.color }"></div>
                <div>
                  <div class="tc-name">{{ t.name }}</div>
                  <div class="tc-desc">{{ t.desc }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ABOUT / CTA -->
    <section class="section cta-section" id="about">
      <div class="section-container">
        <div class="cta-card">
          <div class="cta-orb"></div>
          <div class="cta-content">
            <div class="section-badge light">Về dự án</div>
            <h2 class="cta-title">Đề tài 05 — Nhóm 3</h2>
            <p class="cta-desc">
              Hệ thống Đặt lịch & Quản lý Phòng khám được xây dựng theo kiến trúc Microservices.
              Nhóm 3 phụ trách <strong>Pharmacy & Billing Service</strong> — service quản lý kho thuốc,
              xuất thuốc và thu viện phí.
            </p>
            <div class="cta-services">
              <div class="cs-item cs-other">Nhóm 1: Appointment Service</div>
              <div class="cs-item cs-other">Nhóm 2: Medical Record Service</div>
              <div class="cs-item cs-active">Nhóm 3: Pharmacy & Billing ← Nhóm tôi</div>
            </div>
            <router-link :to="authStore.isAuthenticated ? appHome : '/login'" class="hero-btn-primary" style="width: fit-content">
              {{ authStore.isAuthenticated ? 'Vào Dashboard ngay' : 'Vào hệ thống ngay' }} <ArrowRightOutlined />
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="footer">
      <div class="section-container">
        <div class="footer-top">
          <div class="footer-brand">
            <div class="footer-logo">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>
            <span>MediCare</span>
          </div>
          <div class="footer-links">
            <a href="#features">Tính năng</a>
            <a href="#roles">Vai trò</a>
            <a href="#tech">Công nghệ</a>
            <router-link to="/login">Đăng nhập</router-link>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 MediCare — Pharmacy & Billing Service. Đề tài 05 Nhóm 3.</span>
          <span>ASP.NET Core 9 · Vue 3 · Docker · RabbitMQ</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import {
  ArrowRightOutlined, CheckCircleFilled, CheckOutlined,
  MedicineBoxOutlined, DollarOutlined, FileTextOutlined,
  UserOutlined, BarChartOutlined, SafetyOutlined, CloudServerOutlined,
  ApiOutlined, MenuOutlined, CloseOutlined, TeamOutlined
} from '@ant-design/icons-vue'

const authStore = useAuthStore()
const router = useRouter()
const isScrolled  = ref(false)
const mobileOpen  = ref(false)
const activeRole  = ref('Admin')

// Home route theo role khi đã đăng nhập
const appHome = computed(() => {
  const role = authStore.user?.role
  if (role === 'Patient') return '/app/my-invoices'
  if (role === 'Doctor')  return '/app/medicines'
  return '/app/dashboard'
})

const chartBars = [40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88]

const heroStats = [
  { val: '4',    label: 'Vai trò người dùng' },
  { val: '15+',  label: 'API Endpoints' },
  { val: '100%', label: 'Docker containerized' },
]

const features = [
  {
    icon: MedicineBoxOutlined, title: 'Quản lý kho thuốc',
    bg: '#eff6ff', color: '#2563eb',
    desc: 'Theo dõi tồn kho real-time với cảnh báo sắp hết hàng tự động.',
    items: ['Thêm/sửa/xóa thuốc', 'Nhập kho & kiểm kê', 'Cảnh báo low stock', 'Lịch sử giao dịch kho']
  },
  {
    icon: FileTextOutlined, title: 'Phiếu xuất thuốc',
    bg: '#f5f3ff', color: '#7c3aed',
    desc: 'Nhận đơn thuốc tự động qua RabbitMQ hoặc tạo thủ công.',
    items: ['Nhận event prescription.created', 'REST API fallback', 'Trừ kho tự động', 'Theo dõi trạng thái']
  },
  {
    icon: DollarOutlined, title: 'Thu viện phí',
    bg: '#f0fdf4', color: '#16a34a',
    desc: 'Tính toán và thu tiền viện phí với hỗ trợ bảo hiểm y tế.',
    items: ['Phí khám + tiền thuốc', 'Hỗ trợ BHYT', '4 hình thức thanh toán', 'In hóa đơn']
  },
  {
    icon: BarChartOutlined, title: 'Báo cáo & Thống kê',
    bg: '#fff7ed', color: '#d97706',
    desc: 'Dashboard thống kê tổng quan và báo cáo doanh thu chi tiết.',
    items: ['Dashboard real-time', 'Biểu đồ doanh thu', 'Báo cáo theo kỳ', 'Export dữ liệu']
  },
  {
    icon: SafetyOutlined, title: 'Bảo mật JWT',
    bg: '#fef2f2', color: '#dc2626',
    desc: 'Xác thực JWT với refresh token, rate limiting và logging.',
    items: ['JWT Access + Refresh token', 'RBAC 4 vai trò', 'Rate limiting', 'Audit log']
  },
  {
    icon: ApiOutlined, title: 'Microservices',
    bg: '#f8fafc', color: '#475569',
    desc: 'Tích hợp liền mạch với Appointment Service và Medical Record Service.',
    items: ['RabbitMQ messaging', 'REST API gateway', 'Docker container', 'Swagger OpenAPI']
  },
]

const roles = [
  {
    name: 'Admin', icon: SafetyOutlined, color: '#2563eb', bg: '#eff6ff',
    perms: ['Xem dashboard thống kê', 'CRUD kho thuốc đầy đủ', 'Nhập kho & kiểm kê', 'Quản lý phiếu xuất', 'Quản lý hóa đơn & thu tiền', 'Quản lý người dùng', 'Báo cáo doanh thu', 'Cấu hình hệ thống']
  },
  {
    name: 'Y tá / Tiếp tân', icon: TeamOutlined, color: '#16a34a', bg: '#f0fdf4',
    perms: ['Xem dashboard thống kê', 'Xem & nhập kho thuốc', 'Tạo phiếu xuất thuốc', 'Xử lý xuất thuốc', 'Tạo và thu hóa đơn', 'Xem báo cáo cơ bản']
  },
  {
    name: 'Bác sĩ', icon: UserOutlined, color: '#7c3aed', bg: '#f5f3ff',
    perms: ['Tra cứu danh mục thuốc', 'Xem phiếu xuất thuốc', 'Xem thông tin giá thuốc', 'Cập nhật hồ sơ cá nhân']
  },
  {
    name: 'Bệnh nhân', icon: UserOutlined, color: '#d97706', bg: '#fff7ed',
    perms: ['Xem hóa đơn của mình', 'Xem đơn thuốc của mình', 'Tra cứu danh mục thuốc', 'Cập nhật hồ sơ cá nhân']
  },
]

const techStack = [
  {
    title: 'Backend', icon: CloudServerOutlined,
    items: [
      { name: 'ASP.NET Core 9', desc: 'Web API framework', color: '#512BD4' },
      { name: 'Entity Framework Core', desc: 'ORM + Migrations', color: '#512BD4' },
      { name: 'SQL Server 2022', desc: 'Database per service', color: '#CC2927' },
      { name: 'RabbitMQ 3.13', desc: 'Message broker', color: '#FF6600' },
      { name: 'JWT Bearer', desc: 'Authentication', color: '#2563eb' },
    ]
  },
  {
    title: 'Frontend', icon: ApiOutlined,
    items: [
      { name: 'Vue 3 + Vite', desc: 'SPA framework', color: '#42b883' },
      { name: 'Ant Design Vue', desc: 'UI components', color: '#1677ff' },
      { name: 'Pinia', desc: 'State management', color: '#f7d336' },
      { name: 'TypeScript', desc: 'Type safety', color: '#3178c6' },
      { name: 'Chart.js', desc: 'Data visualization', color: '#ff6384' },
    ]
  },
  {
    title: 'DevOps', icon: CloudServerOutlined,
    items: [
      { name: 'Docker', desc: 'Containerization', color: '#2496ED' },
      { name: 'Docker Compose', desc: 'Multi-container', color: '#2496ED' },
      { name: 'Nginx', desc: 'Static file server', color: '#009900' },
      { name: 'Serilog', desc: 'Structured logging', color: '#333' },
      { name: 'Swagger', desc: 'API documentation', color: '#85EA2D' },
    ]
  },
]

const handleScroll = () => { isScrolled.value = window.scrollY > 20 }
onMounted(() => window.addEventListener('scroll', handleScroll))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>

<style scoped>
.home { min-height: 100vh; background: white; }

/* NAVBAR */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
  padding: 14px 0; transition: all 0.3s;
}
.navbar.scrolled {
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #f1f5f9;
  padding: 10px 0;
  box-shadow: 0 1px 20px rgba(0,0,0,0.06);
}
.nav-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; display: flex; align-items: center; gap: 32px; }
.nav-brand { display: flex; align-items: center; gap: 8px; cursor: pointer; text-decoration: none; }
.nav-logo { width: 32px; height: 32px; background: #2563eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.nav-name { font-size: 16px; font-weight: 700; color: #0f172a; }
.nav-links { display: flex; gap: 4px; flex: 1; }
.nav-link { padding: 7px 14px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #475569; text-decoration: none; transition: all 0.15s; }
.nav-link:hover { background: #f1f5f9; color: #0f172a; }
.nav-actions { display: flex; align-items: center; gap: 8px; }
.btn-ghost { padding: 7px 16px; border-radius: 8px; font-size: 14px; font-weight: 500; color: #475569; text-decoration: none; transition: all 0.15s; border: 1.5px solid #e2e8f0; }
.btn-ghost:hover { background: #f8fafc; color: #0f172a; }
.btn-primary-sm { padding: 8px 18px; background: #2563eb; color: white; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.2s; }
.btn-primary-sm:hover { background: #1d4ed8; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(37,99,235,0.35); }
.nav-mobile-btn { display: none; background: none; border: none; font-size: 18px; cursor: pointer; color: #0f172a; padding: 4px; }
.mobile-menu { display: flex; flex-direction: column; padding: 12px 24px; background: white; border-top: 1px solid #f1f5f9; }
.mobile-link { padding: 10px 0; font-size: 15px; font-weight: 500; color: #475569; text-decoration: none; border-bottom: 1px solid #f8fafc; }

/* HERO */
.hero {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #0f172a 100%);
  display: flex; align-items: center;
  position: relative; overflow: hidden;
  padding: 100px 24px 60px;
}
.hero-bg { position: absolute; inset: 0; z-index: 0; }
.hero-orb { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.3; }
.orb-1 { width: 600px; height: 600px; background: #3b82f6; top: -200px; right: -100px; animation: float 8s ease-in-out infinite; }
.orb-2 { width: 400px; height: 400px; background: #8b5cf6; bottom: -100px; left: -100px; animation: float 10s ease-in-out infinite reverse; }
.hero-grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
}
@keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-30px); } }
.hero-content { position: relative; z-index: 1; max-width: 560px; flex: 1; }
.hero-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 100px; padding: 6px 16px; font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.8); margin-bottom: 24px; backdrop-filter: blur(8px); }
.badge-dot { width: 6px; height: 6px; background: #4ade80; border-radius: 50%; animation: pulse 2s infinite; }
@keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
.hero-title { font-size: 54px; font-weight: 800; color: white; line-height: 1.1; letter-spacing: -2px; margin: 0 0 20px; }
.text-gradient { background: linear-gradient(135deg, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.hero-desc { font-size: 17px; color: rgba(255,255,255,0.6); line-height: 1.8; margin: 0 0 36px; }
.hero-btns { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 48px; }
.hero-btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; background: #2563eb; color: white; border-radius: 12px; font-size: 15px; font-weight: 600; text-decoration: none; transition: all 0.2s; box-shadow: 0 4px 20px rgba(37,99,235,0.4); }
.hero-btn-primary:hover { background: #1d4ed8; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(37,99,235,0.5); }
.hero-btn-ghost { display: inline-flex; align-items: center; padding: 14px 28px; background: rgba(255,255,255,0.08); border: 1.5px solid rgba(255,255,255,0.15); color: white; border-radius: 12px; font-size: 15px; font-weight: 600; text-decoration: none; transition: all 0.2s; backdrop-filter: blur(8px); }
.hero-btn-ghost:hover { background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.3); }
.hero-stats { display: flex; gap: 32px; padding-top: 32px; border-top: 1px solid rgba(255,255,255,0.1); }
.hstat-val { font-size: 28px; font-weight: 800; color: white; line-height: 1; }
.hstat-label { font-size: 12px; color: rgba(255,255,255,0.45); margin-top: 4px; }
.hero-visual { position: relative; z-index: 1; flex: 1; display: flex; justify-content: center; align-items: center; padding-left: 48px; }

/* Dashboard preview mockup */
.dashboard-preview { background: #1e293b; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; width: 100%; max-width: 480px; box-shadow: 0 40px 80px rgba(0,0,0,0.5); }
.dp-header { display: flex; align-items: center; gap: 6px; padding: 12px 16px; background: #0f172a; border-bottom: 1px solid rgba(255,255,255,0.06); }
.dp-dot { width: 10px; height: 10px; border-radius: 50%; }
.dp-dot.red { background: #ef4444; }
.dp-dot.yellow { background: #f59e0b; }
.dp-dot.green { background: #22c55e; }
.dp-url { flex: 1; text-align: center; font-size: 12px; color: rgba(255,255,255,0.3); }
.dp-body { display: flex; height: 320px; }
.dp-sidebar { width: 52px; background: #0f172a; border-right: 1px solid rgba(255,255,255,0.06); padding: 12px 8px; display: flex; flex-direction: column; gap: 6px; }
.dp-logo-mini { width: 36px; height: 22px; background: #2563eb; border-radius: 5px; margin-bottom: 8px; }
.dp-menu-item { height: 22px; background: rgba(255,255,255,0.06); border-radius: 5px; }
.dp-menu-item.active { background: rgba(37,99,235,0.4); }
.dp-main { flex: 1; padding: 12px; display: flex; flex-direction: column; gap: 10px; overflow: hidden; }
.dp-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.dp-card { padding: 10px; border-radius: 8px; }
.c1 { background: rgba(37,99,235,0.2); } .c2 { background: rgba(124,58,237,0.2); }
.c3 { background: rgba(249,115,22,0.2); } .c4 { background: rgba(22,163,74,0.2); }
.dc-num { font-size: 16px; font-weight: 700; color: white; }
.dc-lbl { font-size: 9px; color: rgba(255,255,255,0.4); margin-top: 2px; }
.dp-chart { display: flex; align-items: flex-end; gap: 3px; height: 60px; padding: 4px; background: rgba(255,255,255,0.03); border-radius: 8px; }
.dc-bar { flex: 1; background: linear-gradient(to top, #2563eb, #60a5fa); border-radius: 2px; min-height: 6px; opacity: 0.8; }
.dp-table { flex: 1; background: rgba(255,255,255,0.03); border-radius: 8px; overflow: hidden; }
.dt-row { display: grid; grid-template-columns: 1fr 2fr 1fr; gap: 8px; padding: 6px 10px; border-bottom: 1px solid rgba(255,255,255,0.04); }
.dt-row.header span { font-size: 9px; color: rgba(255,255,255,0.3); font-weight: 600; text-transform: uppercase; }
.dt-skeleton { height: 10px; background: rgba(255,255,255,0.08); border-radius: 3px; }
.dt-skeleton.long { width: 90%; }
.dt-skeleton.short { width: 60%; }

/* SECTIONS */
.section { padding: 96px 0; }
.section-gray { background: #f8fafc; }
.section-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.section-header { text-align: center; margin-bottom: 64px; }
.section-badge { display: inline-block; background: #eff6ff; color: #2563eb; font-size: 13px; font-weight: 600; padding: 5px 14px; border-radius: 100px; margin-bottom: 16px; }
.section-badge.light { background: rgba(255,255,255,0.15); color: rgba(255,255,255,0.8); }
.section-title { font-size: 40px; font-weight: 800; color: #0f172a; letter-spacing: -1px; margin: 0 0 12px; }
.section-sub { font-size: 17px; color: #64748b; max-width: 500px; margin: 0 auto; line-height: 1.7; }

/* FEATURES GRID */
.features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.feature-card { background: white; border: 1.5px solid #f1f5f9; border-radius: 16px; padding: 28px; transition: all 0.25s; }
.feature-card:hover { border-color: #bfdbfe; box-shadow: 0 8px 30px rgba(37,99,235,0.1); transform: translateY(-4px); }
.fc-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 22px; margin-bottom: 16px; }
.fc-title { font-size: 17px; font-weight: 700; color: #0f172a; margin: 0 0 8px; }
.fc-desc { font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 16px; }
.fc-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px; }
.fc-list li { font-size: 13px; color: #475569; display: flex; align-items: center; gap: 8px; }
.fc-check { color: #16a34a; font-size: 12px; }

/* ROLES */
.roles-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
.role-card { background: white; border: 2px solid #f1f5f9; border-radius: 16px; padding: 24px; cursor: pointer; transition: all 0.2s; }
.role-card.active { border-color: #bfdbfe; background: #f8faff; box-shadow: 0 4px 20px rgba(37,99,235,0.1); }
.role-card:hover { border-color: #cbd5e1; }
.rc-top { display: flex; align-items: center; gap: 14px; margin-bottom: 12px; }
.rc-icon { width: 44px; height: 44px; border-radius: 11px; display: flex; align-items: center; justify-content: center; font-size: 20px; }
.rc-name { font-size: 16px; font-weight: 700; color: #0f172a; }
.rc-count { font-size: 13px; color: #94a3b8; margin-top: 2px; }
.rc-perms { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 7px; }
.rc-perms li { font-size: 13px; color: #475569; display: flex; align-items: center; gap: 8px; }
.rc-hint { font-size: 13px; color: #94a3b8; padding: 4px 0; }

/* TECH */
.tech-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.tc-header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid #f1f5f9; }
.tc-icon { font-size: 18px; color: #2563eb; }
.tc-title { font-size: 15px; font-weight: 700; color: #0f172a; }
.tc-items { display: flex; flex-direction: column; gap: 14px; }
.tc-item { display: flex; align-items: flex-start; gap: 12px; }
.tc-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; margin-top: 5px; }
.tc-name { font-size: 14px; font-weight: 600; color: #1e293b; }
.tc-desc { font-size: 12px; color: #94a3b8; margin-top: 1px; }

/* CTA */
.cta-section { background: #0f172a; }
.cta-card { background: linear-gradient(135deg, #1e3a5f 0%, #1e1b4b 100%); border: 1px solid rgba(255,255,255,0.1); border-radius: 24px; padding: 64px; position: relative; overflow: hidden; }
.cta-orb { position: absolute; width: 400px; height: 400px; background: #3b82f6; border-radius: 50%; filter: blur(120px); opacity: 0.15; top: -100px; right: -100px; }
.cta-content { position: relative; z-index: 1; max-width: 600px; }
.cta-title { font-size: 38px; font-weight: 800; color: white; letter-spacing: -1px; margin: 12px 0 16px; }
.cta-desc { font-size: 16px; color: rgba(255,255,255,0.6); line-height: 1.8; margin-bottom: 28px; }
.cta-services { display: flex; flex-direction: column; gap: 8px; margin-bottom: 32px; }
.cs-item { font-size: 14px; font-weight: 500; padding: 10px 16px; border-radius: 10px; }
.cs-other { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.5); }
.cs-active { background: rgba(37,99,235,0.25); color: #93c5fd; border: 1px solid rgba(37,99,235,0.4); }

/* FOOTER */
.footer { background: #020617; padding: 48px 0 32px; }
.footer-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 16px; }
.footer-brand { display: flex; align-items: center; gap: 8px; }
.footer-logo { width: 28px; height: 28px; background: #2563eb; border-radius: 7px; display: flex; align-items: center; justify-content: center; }
.footer-brand span { font-size: 15px; font-weight: 700; color: white; }
.footer-links { display: flex; gap: 24px; }
.footer-links a { font-size: 14px; color: rgba(255,255,255,0.45); text-decoration: none; transition: color 0.15s; }
.footer-links a:hover { color: white; }
.footer-bottom { display: flex; justify-content: space-between; align-items: center; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.06); font-size: 13px; color: rgba(255,255,255,0.25); flex-wrap: wrap; gap: 8px; }

@media (max-width: 1024px) {
  .hero { flex-direction: column; text-align: center; }
  .hero-stats { justify-content: center; }
  .hero-btns { justify-content: center; }
  .hero-visual { padding-left: 0; margin-top: 48px; }
  .features-grid { grid-template-columns: repeat(2, 1fr); }
  .tech-grid { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .hero-title { font-size: 36px; }
  .features-grid, .roles-grid { grid-template-columns: 1fr; }
  .nav-links, .nav-actions { display: none; }
  .nav-mobile-btn { display: block; }
  .section { padding: 64px 0; }
  .cta-card { padding: 36px 24px; }
  .cta-title { font-size: 28px; }
}
</style>
