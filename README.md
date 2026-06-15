# 🏥 Frontend chung — Đề tài 05: Hệ thống Đặt lịch & Quản lý Phòng khám

> Vue 3 + Vite + Ant Design Vue + Pinia + TypeScript

---

## 🌿 Cấu trúc nhánh Git

```
main                        ← Nhánh chính, code ổn định, merge từ các nhóm
├── feature/nhom1-appointment      ← Nhóm 1 làm việc ở đây
├── feature/nhom2-medical-record   ← Nhóm 2 làm việc ở đây
└── master (nhom3-pharmacy)        ← Nhóm 3 làm việc ở đây
```

**Quy tắc:**
- Mỗi nhóm chỉ làm việc trên nhánh của mình
- Muốn lấy code mới nhất từ nhóm khác → merge từ `main`
- Hoàn thành tính năng → tạo Pull Request vào `main`

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

### Nhóm 2 — Medical Record Service
```bash
git clone https://github.com/nhucccc/Fullstack.git
cd Fullstack
git checkout feature/nhom2-medical-record
npm install
npm run dev
```

### Nhóm 3 — Pharmacy & Billing (nhóm tao)
```bash
git clone https://github.com/nhucccc/Fullstack.git
cd Fullstack
git checkout main   # hoặc master
npm install
npm run dev
```

---

## ⚙️ Cấu hình API — tạo file `.env.local`

```env
# Nhóm 1 - Appointment Service (port 5001)
VITE_APPOINTMENT_API_URL=http://localhost:5001/api

# Nhóm 2 - Medical Record Service (port 5002)
VITE_MEDICAL_API_URL=http://localhost:5002/api

# Nhóm 3 - Pharmacy & Billing (port 5000) — mặc định
VITE_API_URL=http://localhost:5000/api
```

> File `.env.local` KHÔNG được commit lên git (đã có trong .gitignore)

---

## 👤 Tài khoản demo

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `Admin@123` |
| Y tá | `nurse1` | `Nurse@123` |
| Bác sĩ | `doctor1` | `Doctor@123` |
| Bệnh nhân | `patient1` | `Patient@123` |

---

## 🔄 Workflow cộng tác

```bash
# Lấy code mới nhất từ nhóm khác (qua main)
git fetch origin
git merge origin/main

# Commit và push code của nhóm mình
git add .
git commit -m "feat: mô tả tính năng"
git push

# Khi xong tính năng → tạo Pull Request vào main trên GitHub
```

---

## 📦 Build

```bash
npm run build   # Output: dist/
```
