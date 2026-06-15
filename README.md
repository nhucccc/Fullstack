# 🏥 Frontend - Hệ thống Đặt lịch & Quản lý Phòng khám

> **Đề tài 05** — Frontend dùng chung cho 3 nhóm  
> Tech stack: **Vue 3 + Vite + Ant Design Vue + Pinia + TypeScript**

---

## 📁 Cấu trúc

```
src/
├── views/          # Các trang UI
├── components/     # Component tái sử dụng
├── services/       # Gọi API từng service
├── stores/         # Pinia state management
├── router/         # Vue Router + RBAC guard
├── types/          # TypeScript types
└── utils/          # http.ts (axios), format.ts
```

---

## 🚀 Cài đặt & Chạy

```bash
# 1. Clone về
git clone <repo-url>
cd frontend

# 2. Cài packages
npm install

# 3. Cấu hình API URL (xem mục bên dưới)

# 4. Chạy dev server
npm run dev
# → http://localhost:3000
```

---

## ⚙️ Cấu hình API URL

Tạo file `.env.local` (không commit lên git):

```env
# Nhóm 1 - Appointment Service
VITE_APPOINTMENT_API_URL=http://localhost:5001/api

# Nhóm 2 - Medical Record Service  
VITE_MEDICAL_API_URL=http://localhost:5002/api

# Nhóm 3 - Pharmacy & Billing Service
VITE_API_URL=http://localhost:5000/api
```

File `.env.development` mặc định đã có:
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 👤 Tài khoản demo

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `Admin@123` |
| Y tá / Tiếp tân | `nurse1` | `Nurse@123` |
| Bác sĩ | `doctor1` | `Doctor@123` |
| Bệnh nhân | `patient1` | `Patient@123` |

---

## 🔗 Các Service Backend

| Service | Port | Nhóm |
|---------|------|-------|
| Pharmacy & Billing | `5000` | Nhóm 3 |
| Appointment Service | `5001` | Nhóm 1 |
| Medical Record Service | `5002` | Nhóm 2 |

---

## 📦 Build production

```bash
npm run build
# Output: dist/
```
