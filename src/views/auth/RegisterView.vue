<template>
  <div class="reg-page">
    <!-- Left -->
    <div class="reg-left">
      <div class="reg-left-inner">
        <div class="rl-brand" @click="router.push('/')">
          <div class="rl-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <span>MediCare</span>
        </div>
        <h2 class="rl-title">Đăng ký<br/>tài khoản<br/><span class="rl-accent">bệnh nhân</span></h2>
        <p class="rl-sub">Tạo tài khoản để xem lịch sử khám bệnh, đơn thuốc và hóa đơn viện phí của bạn.</p>
        <div class="rl-steps">
          <div class="rl-step" v-for="(s, i) in steps" :key="i" :class="{ active: currentStep === i, done: currentStep > i }">
            <div class="step-dot">{{ currentStep > i ? '✓' : i + 1 }}</div>
            <span>{{ s }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Right -->
    <div class="reg-right">
      <div class="reg-box">
        <div class="reg-header">
          <h3>Tạo tài khoản mới</h3>
          <p>Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link></p>
        </div>

        <a-form :model="form" layout="vertical" @finish="handleRegister" class="reg-form">

          <!-- Step 1: Thông tin đăng nhập -->
          <div v-show="currentStep === 0">
            <div class="step-title">Thông tin đăng nhập</div>
            <a-form-item name="username" :rules="[{required:true, min:3, message:'Tối thiểu 3 ký tự'}]">
              <label class="field-label">Tên đăng nhập *</label>
              <a-input v-model:value="form.username" size="large" placeholder="vd: nguyenvana123">
                <template #prefix><UserOutlined style="color:#94a3b8" /></template>
              </a-input>
            </a-form-item>
            <a-row :gutter="12">
              <a-col :span="12">
                <a-form-item name="password" :rules="[{required:true, min:8, message:'Tối thiểu 8 ký tự'}]">
                  <label class="field-label">Mật khẩu *</label>
                  <a-input-password v-model:value="form.password" size="large" placeholder="Tối thiểu 8 ký tự">
                    <template #prefix><LockOutlined style="color:#94a3b8" /></template>
                  </a-input-password>
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item name="confirmPassword" :rules="confirmRules">
                  <label class="field-label">Xác nhận mật khẩu *</label>
                  <a-input-password v-model:value="form.confirmPassword" size="large" placeholder="Nhập lại mật khẩu">
                    <template #prefix><LockOutlined style="color:#94a3b8" /></template>
                  </a-input-password>
                </a-form-item>
              </a-col>
            </a-row>
            <a-button type="primary" size="large" block @click="nextStep" class="reg-btn">
              Tiếp theo <ArrowRightOutlined />
            </a-button>
          </div>

          <!-- Step 2: Thông tin cá nhân -->
          <div v-show="currentStep === 1">
            <div class="step-title">Thông tin cá nhân</div>
            <a-row :gutter="12">
              <a-col :span="12">
                <a-form-item name="fullName" :rules="[{required:true, message:'Bắt buộc'}]">
                  <label class="field-label">Họ và tên *</label>
                  <a-input v-model:value="form.fullName" size="large" placeholder="Nguyễn Văn A" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item name="email" :rules="[{required:true, type:'email', message:'Email không hợp lệ'}]">
                  <label class="field-label">Email *</label>
                  <a-input v-model:value="form.email" size="large" placeholder="email@gmail.com" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item>
                  <label class="field-label">Số điện thoại</label>
                  <a-input v-model:value="form.phoneNumber" size="large" placeholder="0901234567" />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item>
                  <label class="field-label">Giới tính</label>
                  <a-select v-model:value="form.gender" size="large" style="width:100%" placeholder="Chọn">
                    <a-select-option value="Nam">Nam</a-select-option>
                    <a-select-option value="Nữ">Nữ</a-select-option>
                    <a-select-option value="Khác">Khác</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-form-item>
              <label class="field-label">Địa chỉ</label>
              <a-input v-model:value="form.address" size="large" placeholder="Số nhà, đường, phường, quận, thành phố" />
            </a-form-item>
            <a-form-item>
              <label class="field-label">Số Bảo hiểm Y tế (BHYT)</label>
              <a-input v-model:value="form.insuranceNumber" size="large" placeholder="HS4012345678 (nếu có)" />
            </a-form-item>
            <a-space style="width:100%">
              <a-button size="large" @click="currentStep = 0">← Quay lại</a-button>
              <a-button type="primary" size="large" html-type="submit"
                :loading="authStore.loading" class="reg-btn" style="flex:1">
                <CheckCircleOutlined /> Đăng ký ngay
              </a-button>
            </a-space>
          </div>

        </a-form>

        <!-- Info box -->
        <div class="reg-info">
          <InfoCircleOutlined style="color:#2563eb; flex-shrink:0" />
          <div>
            <div style="font-weight:600; font-size:13px">Lưu ý</div>
            <div style="font-size:12px; color:#64748b; margin-top:2px">
              Tài khoản bệnh nhân chỉ dùng để xem thông tin cá nhân. Tài khoản nhân viên do Admin cung cấp.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { UserRole } from '@/types'
import { UserOutlined, LockOutlined, ArrowRightOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons-vue'

const router = useRouter()
const authStore = useAuthStore()
const currentStep = ref(0)
const steps = ['Thông tin đăng nhập', 'Thông tin cá nhân']

const form = reactive({
  username: '', password: '', confirmPassword: '',
  fullName: '', email: '', phoneNumber: '',
  gender: '', address: '', insuranceNumber: '',
  role: UserRole.Patient
})

const confirmRules = [
  { required: true, message: 'Vui lòng xác nhận mật khẩu' },
  {
    validator: (_: any, value: string) =>
      value === form.password ? Promise.resolve() : Promise.reject('Mật khẩu không khớp')
  }
]

const nextStep = () => {
  if (!form.username || form.username.length < 3) return
  if (!form.password || form.password.length < 8) return
  if (form.password !== form.confirmPassword) return
  currentStep.value = 1
}

const handleRegister = async () => {
  const ok = await authStore.register({ ...form })
  if (ok) {
    // Bệnh nhân về trang my-invoices sau đăng ký
    router.push('/app/my-invoices')
  }
}
</script>

<style scoped>
.reg-page { display: flex; min-height: 100vh; }

/* LEFT */
.reg-left {
  width: 380px;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
  display: flex; align-items: center; justify-content: center;
  padding: 48px;
}
.reg-left-inner { color: white; }
.rl-brand { display: flex; align-items: center; gap: 8px; cursor: pointer; margin-bottom: 48px; }
.rl-logo { width: 32px; height: 32px; background: #2563eb; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
.rl-brand span { font-size: 16px; font-weight: 700; }
.rl-title { font-size: 36px; font-weight: 800; line-height: 1.2; letter-spacing: -1px; margin: 0 0 16px; }
.rl-accent { background: linear-gradient(135deg, #60a5fa, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.rl-sub { font-size: 14px; color: rgba(255,255,255,0.55); line-height: 1.7; margin: 0 0 40px; }

.rl-steps { display: flex; flex-direction: column; gap: 12px; }
.rl-step { display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.4); font-size: 14px; transition: all 0.2s; }
.rl-step.active { color: white; font-weight: 600; }
.rl-step.done { color: #4ade80; }
.step-dot {
  width: 28px; height: 28px; border-radius: 50%;
  background: rgba(255,255,255,0.1);
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600; flex-shrink: 0;
  transition: all 0.2s;
}
.rl-step.active .step-dot { background: #2563eb; color: white; }
.rl-step.done .step-dot { background: #16a34a; color: white; }

/* RIGHT */
.reg-right { flex: 1; background: #f8fafc; display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
.reg-box { width: 100%; max-width: 500px; background: white; border-radius: 20px; padding: 36px; box-shadow: 0 4px 30px rgba(0,0,0,0.08); }
.reg-header { margin-bottom: 24px; }
.reg-header h3 { font-size: 22px; font-weight: 700; color: #0f172a; margin: 0 0 4px; }
.reg-header p { font-size: 14px; color: #64748b; margin: 0; }
.reg-header a { color: #2563eb; font-weight: 600; text-decoration: none; }
.reg-header a:hover { text-decoration: underline; }

.step-title { font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #f1f5f9; }

.field-label { font-size: 13px; font-weight: 600; color: #374151; display: block; margin-bottom: 6px; }
.reg-form :deep(.ant-form-item) { margin-bottom: 16px; }

.reg-btn { border-radius: 10px !important; font-weight: 600 !important; }

.reg-info {
  display: flex; align-items: flex-start; gap: 10px;
  margin-top: 20px; padding: 12px 14px;
  background: #eff6ff; border-radius: 10px;
  border: 1px solid #bfdbfe;
}

@media (max-width: 768px) {
  .reg-left { display: none; }
}
</style>
