<template>
  <div class="auth-page">
    <!-- Left side -->
    <div class="auth-left">
      <div class="auth-left-inner">
        <div class="brand">
          <div class="brand-mark">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <span class="brand-name">MediCare</span>
        </div>

        <div class="hero-text">
          <h1>Quản lý phòng khám<br/><span class="gradient-text">thông minh hơn.</span></h1>
          <p>Hệ thống Pharmacy & Billing tích hợp đầy đủ — từ kho thuốc, xuất thuốc đến thu viện phí.</p>
        </div>

        <div class="feature-grid">
          <div class="feature-box" v-for="f in features" :key="f.label">
            <div class="feature-icon-wrap">
              <component :is="f.icon" />
            </div>
            <div>
              <div class="feature-label">{{ f.label }}</div>
              <div class="feature-desc">{{ f.desc }}</div>
            </div>
          </div>
        </div>

        <!-- Decorative blobs -->
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
      </div>
    </div>

    <!-- Right side -->
    <div class="auth-right">
      <div class="login-box">
        <!-- Header -->
        <div class="login-top">
          <div class="login-logo-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <span>MediCare</span>
        </div>

        <h2 class="login-title">Đăng nhập</h2>
        <p class="login-sub">Nhập thông tin tài khoản để tiếp tục</p>

        <a-form :model="form" layout="vertical" @finish="handleLogin" class="login-form">
          <a-form-item name="username" :rules="[{required:true, message:'Bắt buộc'}]">
            <label class="field-label">Tên đăng nhập</label>
            <a-input
              v-model:value="form.username"
              size="large"
              placeholder="Nhập username..."
              class="field-input"
            >
              <template #prefix>
                <UserOutlined class="field-prefix-icon" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item name="password" :rules="[{required:true, message:'Bắt buộc'}]">
            <div class="field-label-row">
              <label class="field-label">Mật khẩu</label>
            </div>
            <a-input-password
              v-model:value="form.password"
              size="large"
              placeholder="Nhập mật khẩu..."
              class="field-input"
            >
              <template #prefix>
                <LockOutlined class="field-prefix-icon" />
              </template>
            </a-input-password>
          </a-form-item>

          <a-button
            type="primary"
            html-type="submit"
            size="large"
            block
            :loading="authStore.loading"
            class="login-submit"
          >
            <template v-if="!authStore.loading">
              Đăng nhập &nbsp;
              <ArrowRightOutlined />
            </template>
          </a-button>
        </a-form>

        <!-- Demo section -->
        <div class="demo-section">
          <div class="demo-title">
            <span class="demo-line"></span>
            <span>Tài khoản thử nghiệm</span>
            <span class="demo-line"></span>
          </div>
          <div class="demo-grid">
            <button
              v-for="acc in demoAccounts"
              :key="acc.username"
              class="demo-btn"
              :class="`demo-${acc.color}`"
              @click="quickLogin(acc)"
            >
              <span class="demo-dot"></span>
              <div class="demo-info">
                <span class="demo-role">{{ acc.label }}</span>
                <span class="demo-username">{{ acc.username }}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  UserOutlined, LockOutlined, ArrowRightOutlined,
  MedicineBoxOutlined, SafetyOutlined, BarChartOutlined, TeamOutlined
} from '@ant-design/icons-vue'

const router = useRouter()
const route  = useRoute()
const authStore = useAuthStore()
const form = reactive({ username: '', password: '' })

const features = [
  { icon: MedicineBoxOutlined, label: 'Kho thuốc thông minh',    desc: 'Quản lý tồn kho, cảnh báo sắp hết' },
  { icon: SafetyOutlined,      label: 'Phân quyền 4 vai trò',    desc: 'Admin, Bác sĩ, Y tá, Bệnh nhân' },
  { icon: BarChartOutlined,    label: 'Báo cáo doanh thu',       desc: 'Thống kê theo ngày, tháng, kỳ' },
  { icon: TeamOutlined,        label: 'Kết nối đa dịch vụ',      desc: 'RabbitMQ + REST API integration' },
]

const demoAccounts = [
  { username: 'admin',    password: 'Admin@123',   label: 'Admin',     color: 'blue'   },
  { username: 'nurse1',   password: 'Nurse@123',   label: 'Y tá',      color: 'green'  },
  { username: 'doctor1',  password: 'Doctor@123',  label: 'Bác sĩ',    color: 'purple' },
  { username: 'patient1', password: 'Patient@123', label: 'Bệnh nhân', color: 'orange' },
]

const quickLogin = async (acc: any) => {
  form.username = acc.username
  form.password = acc.password
  const ok = await authStore.login({ username: acc.username, password: acc.password })
  if (ok) router.push((route.query.redirect as string) || '/app/dashboard')
}

const handleLogin = async () => {
  const ok = await authStore.login({ username: form.username, password: form.password })
  if (ok) router.push((route.query.redirect as string) || '/app/dashboard')
}
</script>

<style scoped>
.auth-page {
  display: flex;
  min-height: 100vh;
}

/* LEFT */
.auth-left {
  flex: 1;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1e40af 100%);
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.auth-left-inner {
  position: relative;
  z-index: 2;
  padding: 60px;
  max-width: 520px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 56px;
}
.brand-mark {
  width: 44px; height: 44px;
  background: rgba(255,255,255,0.15);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(8px);
}
.brand-name {
  font-size: 20px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.3px;
}
.hero-text { margin-bottom: 48px; }
.hero-text h1 {
  font-size: 42px;
  font-weight: 800;
  color: white;
  line-height: 1.15;
  letter-spacing: -1.5px;
  margin: 0 0 16px;
}
.gradient-text {
  background: linear-gradient(135deg, #60a5fa, #93c5fd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-text p {
  font-size: 16px;
  color: rgba(255,255,255,0.6);
  line-height: 1.7;
  margin: 0;
}
.feature-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}
.feature-box {
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 14px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  backdrop-filter: blur(8px);
  transition: background 0.2s;
}
.feature-box:hover { background: rgba(255,255,255,0.12); }
.feature-icon-wrap {
  width: 34px; height: 34px;
  background: rgba(96,165,250,0.2);
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: #93c5fd;
  font-size: 16px;
  flex-shrink: 0;
}
.feature-label { font-size: 13px; font-weight: 600; color: white; line-height: 1.3; }
.feature-desc  { font-size: 11px; color: rgba(255,255,255,0.45); margin-top: 2px; }

/* Blobs */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.15;
  pointer-events: none;
}
.blob-1 { width: 400px; height: 400px; background: #3b82f6; top: -100px; right: -100px; }
.blob-2 { width: 300px; height: 300px; background: #8b5cf6; bottom: -80px; left: -80px; }

/* RIGHT */
.auth-right {
  width: 480px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
}
.login-box { width: 100%; max-width: 380px; }

.login-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 36px;
  color: var(--gray-400);
  font-size: 13px;
  font-weight: 500;
}
.login-logo-sm {
  width: 28px; height: 28px;
  background: var(--primary);
  border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
}

.login-title {
  font-size: 28px;
  font-weight: 800;
  color: var(--gray-900);
  margin: 0 0 6px;
  letter-spacing: -0.5px;
}
.login-sub {
  font-size: 14px;
  color: var(--gray-400);
  margin: 0 0 28px;
}

/* Form */
.login-form { }
.field-label { font-size: 13px; font-weight: 600; color: var(--gray-700); display: block; margin-bottom: 6px; }
.field-label-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.field-input :deep(.ant-input) { background: var(--gray-50) !important; }
.field-input :deep(.ant-input:focus) { background: white !important; }
.field-prefix-icon { color: var(--gray-400); font-size: 14px; }

.login-submit {
  height: 48px !important;
  border-radius: 12px !important;
  font-size: 15px !important;
  font-weight: 600 !important;
  background: var(--primary) !important;
  border: none !important;
  box-shadow: 0 4px 14px rgba(37,99,235,0.4) !important;
  transition: all 0.2s !important;
  margin-top: 4px;
}
.login-submit:hover {
  background: var(--primary-dark) !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 6px 20px rgba(37,99,235,0.5) !important;
}

/* Demo */
.demo-section { margin-top: 28px; }
.demo-title {
  display: flex; align-items: center; gap: 10px;
  font-size: 12px; font-weight: 500; color: var(--gray-400);
  margin-bottom: 14px;
}
.demo-line { flex: 1; height: 1px; background: var(--gray-100); }
.demo-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.demo-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--gray-50);
  border: 1.5px solid var(--gray-200);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
  width: 100%;
}
.demo-btn:hover { border-color: var(--primary-light); background: var(--primary-bg); transform: translateY(-1px); box-shadow: var(--shadow-sm); }
.demo-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.demo-blue   .demo-dot { background: var(--primary); }
.demo-green  .demo-dot { background: var(--success); }
.demo-purple .demo-dot { background: var(--purple); }
.demo-orange .demo-dot { background: var(--warning); }
.demo-info { display: flex; flex-direction: column; }
.demo-role     { font-size: 13px; font-weight: 600; color: var(--gray-800); line-height: 1.3; }
.demo-username { font-size: 11px; color: var(--gray-400); }

@media (max-width: 960px) {
  .auth-left { display: none; }
  .auth-right { width: 100%; }
}
</style>
