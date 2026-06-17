# 🏥 Frontend chung — Đề tài 05: Hệ thống Đặt lịch & Quản lý Phòng khám

> **Vue 3 + Vite + TypeScript + Ant Design Vue + Pinia**  
> Frontend dùng chung cho **3 nhóm** — mỗi nhóm làm việc trên nhánh riêng.

---

## 🌿 Cấu trúc nhánh Git

```
main                          ← Bản ổn định, đầy đủ — clone về dùng ngay
develop                       ← Nhóm 3 (Pharmacy) tiếp tục phát triển
feature/nhom1-appointment     ← Nhóm 1 thêm pages của mình tại đây
feature/nhom2-medical-record  ← Nhóm 2 thêm pages của mình tại đây
```

---

## 🚀 Hướng dẫn từng nhóm

### Nhóm 1 — Appointment Service
```bash
git clone https://github.com/nhucccc/Fullstack.git
cd Fullstack
git checkout feature/nhom1-appointment
npm install
npm run dev
```
Tạo file `.env.local`:
```env
VITE_APPOINTMENT_API_URL=http://localhost:5001/api
VITE_API_URL=http://localhost:5000/api
```

### Nhóm 2 — Medical Record Service
```bash
git clone https://github.com/nhucccc/Fullstack.git
cd Fullstack
git checkout feature/nhom2-medical-record
npm install
npm run dev
```
Tạo file `.env.local`:
```env
VITE_MEDICAL_API_URL=http://localhost:5002/api
VITE_API_URL=http://localhost:5000/api
```

### Nhóm 3 — Pharmacy & Billing (nhóm làm frontend)
```bash
git clone https://github.com/nhucccc/Fullstack.git
cd Fullstack
git checkout develop
npm install
npm run dev
```

---

## 📁 Cấu trúc thư mục — chỗ các nhóm cần thêm code

```
src/
├── views/
│   ├── auth/           ← Login, Register (dùng chung)
│   ├── medicines/      ← Nhóm 3: Kho thuốc
│   ├── dispensations/  ← Nhóm 3: Phiếu xuất thuốc
│   ├── invoices/       ← Nhóm 3: Hóa đơn viện phí
│   ├── patient/        ← Nhóm 3: Bệnh nhân xem đơn
│   │
│   ├── appointments/   ← 📌 NHÓM 1 thêm vào đây
│   └── medical/        ← 📌 NHÓM 2 thêm vào đây
│
├── services/
│   ├── authService.ts        ← Auth (dùng chung)
│   ├── medicineService.ts    ← Nhóm 3
│   ├── dispensationService.ts← Nhóm 3
│   │
│   ├── appointmentService.ts ← 📌 NHÓM 1 tạo file này
│   └── medicalService.ts     ← 📌 NHÓM 2 tạo file này
│
└── router/index.ts     ← Thêm routes của nhóm mình vào đây
```

---

## ⚙️ API URL Configuration

Tạo file `.env.local` (KHÔNG commit lên git):

```env
# Nhóm 3 - Pharmacy & Billing (port mặc định)
VITE_API_URL=http://localhost:5000/api

# Nhóm 1 - Appointment Service
VITE_APPOINTMENT_API_URL=http://localhost:5001/api

# Nhóm 2 - Medical Record Service
VITE_MEDICAL_API_URL=http://localhost:5002/api
```

---

## 👤 Tài khoản demo (JWT do Nhóm 3 cấp)

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `Admin@123` |
| Y tá | `nurse1` | `Nurse@123` |
| Bác sĩ | `doctor1` | `Doctor@123` |
| Bệnh nhân | `patient1` | `Patient@123` |

---

## 🔄 Quy trình làm việc nhóm

```bash
# 1. Lấy code mới nhất từ main về nhánh của mình
git fetch origin
git merge origin/main

# 2. Làm việc bình thường
git add .
git commit -m "feat: thêm tính năng X"
git push

# 3. Khi xong tính năng → tạo Pull Request vào main
#    (qua GitHub UI)
```

**Nguyên tắc:**
- ✅ Mỗi nhóm chỉ push lên nhánh của mình
- ✅ Không push thẳng lên `main`
- ✅ Tạo Pull Request khi muốn merge vào `main`

---

## 📦 Build production

```bash
npm run build
# Output: dist/
```

## 🐳 Chạy bằng Docker

```bash
# Từ thư mục frontend
docker build -t clinic-frontend .
docker run -p 3000:80 clinic-frontend
```

---

## 🌐 Ports mặc định

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Pharmacy API (N3) | 5000 | http://localhost:5000/swagger |
| Appointment API (N1) | 5001 | http://localhost:5001/swagger |
| Medical API (N2) | 5002 | http://localhost:5002/swagger |
| RabbitMQ UI | 15672 | http://localhost:15672 |
