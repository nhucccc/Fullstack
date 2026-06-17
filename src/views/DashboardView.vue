<template>
  <div class="dashboard">
    <!-- Stat cards -->
    <a-row :gutter="[16,16]">
      <a-col :xs="24" :sm="12" :xl="6" v-for="card in statCards" :key="card.key">
        <div class="stat-card" :style="{ '--color': card.color, '--bg': card.bg }">
          <div class="stat-icon">
            <component :is="card.icon" />
          </div>
          <div class="stat-body">
            <div class="stat-label">{{ card.label }}</div>
            <div class="stat-value">{{ card.value }}</div>
            <div class="stat-sub" v-if="card.sub">{{ card.sub }}</div>
          </div>
        </div>
      </a-col>
    </a-row>

    <a-row :gutter="[16,16]" style="margin-top:16px">
      <!-- Revenue chart -->
      <a-col :xs="24" :xl="16">
        <div class="chart-card">
          <div class="card-header">
            <div>
              <div class="card-title">Doanh thu 30 ngày</div>
              <div class="card-sub">Theo ngày thanh toán</div>
            </div>
            <div class="total-revenue">
              {{ formatCurrency(stats?.monthRevenue ?? 0) }}
              <span class="revenue-label">tháng này</span>
            </div>
          </div>
          <div class="chart-wrap">
            <Line v-if="chartData" :data="chartData" :options="chartOptions" />
            <a-empty v-else description="Chưa có dữ liệu doanh thu" style="padding:40px 0" />
          </div>
        </div>
      </a-col>

      <!-- Status panel -->
      <a-col :xs="24" :xl="8">
        <div class="status-card">
          <div class="card-header">
            <div class="card-title">Trạng thái hôm nay</div>
          </div>
          <div class="status-list">
            <div class="status-item" v-for="s in statusItems" :key="s.label">
              <div class="status-info">
                <div class="status-dot" :style="{ background: s.color }"></div>
                <span class="status-label">{{ s.label }}</span>
              </div>
              <div class="status-val" :style="{ color: s.color }">{{ s.value }}</div>
            </div>
          </div>
          <a-divider style="margin:16px 0" />
          <div class="quick-actions">
            <div class="qa-title">Thao tác nhanh</div>
            <a-space wrap>
              <a-button type="primary" size="small" ghost @click="$router.push('/app/dispensations/create')">
                + Phiếu xuất
              </a-button>
              <a-button size="small" ghost @click="$router.push('/app/invoices/create')">
                + Hóa đơn
              </a-button>
              <a-button size="small" ghost @click="$router.push('/app/medicines')">
                Kho thuốc
              </a-button>
            </a-space>
          </div>
        </div>
      </a-col>
    </a-row>

    <!-- Low stock table -->
    <div class="low-stock-card" v-if="stats?.lowStockMedicines?.length" style="margin-top:16px">
      <div class="card-header">
        <div>
          <div class="card-title">⚠️ Thuốc sắp hết kho</div>
          <div class="card-sub">Cần nhập hàng sớm</div>
        </div>
        <a-button type="link" @click="$router.push('/app/medicines')">Xem tất cả →</a-button>
      </div>
      <a-table
        :dataSource="stats.lowStockMedicines"
        :columns="lowStockCols"
        size="small"
        :pagination="false"
        row-key="id"
        :scroll="{ x: 500 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'stock'">
            <a-progress
              :percent="Math.round(record.stock / record.minimumStock * 100)"
              :stroke-color="record.stock <= record.minimumStock / 2 ? '#ff4d4f' : '#fa8c16'"
              :show-info="false"
              size="small"
              style="width:80px; display:inline-block; margin-right:8px"
            />
            <a-tag :color="record.stock <= record.minimumStock / 2 ? 'red' : 'orange'" style="font-size:12px">
              {{ record.stock }} / {{ record.minimumStock }}
            </a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-button type="link" size="small" @click="$router.push(`/app/medicines/${record.id}`)">
              Nhập kho
            </a-button>
          </template>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { dashboardService } from '@/services/dashboardService'
import { formatCurrency } from '@/utils/format'
import type { DashboardStats } from '@/types'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js'
import {
  MedicineBoxOutlined, WarningOutlined,
  FileTextOutlined, DollarOutlined
} from '@ant-design/icons-vue'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const loading = ref(false)
const stats = ref<DashboardStats | null>(null)

const statCards = computed(() => [
  {
    key: 'medicines', label: 'Tổng số thuốc', icon: MedicineBoxOutlined,
    value: stats.value?.totalMedicines ?? 0,
    sub: `${stats.value?.lowStockCount ?? 0} sắp hết kho`,
    color: '#1677ff', bg: '#e6f4ff'
  },
  {
    key: 'dispensations', label: 'Xuất thuốc hôm nay', icon: FileTextOutlined,
    value: stats.value?.todayDispensations ?? 0,
    sub: `${stats.value?.pendingDispensations ?? 0} chờ xử lý`,
    color: '#722ed1', bg: '#f9f0ff'
  },
  {
    key: 'invoices', label: 'Chờ thanh toán', icon: DollarOutlined,
    value: stats.value?.pendingInvoices ?? 0,
    sub: 'hóa đơn',
    color: '#fa8c16', bg: '#fff7e6'
  },
  {
    key: 'revenue', label: 'Doanh thu hôm nay', icon: DollarOutlined,
    value: formatCurrency(stats.value?.todayRevenue ?? 0),
    sub: 'đã thu',
    color: '#52c41a', bg: '#f6ffed'
  },
])

const statusItems = computed(() => [
  { label: 'Thuốc sắp hết kho',   value: stats.value?.lowStockCount ?? 0,        color: '#ff4d4f' },
  { label: 'Phiếu chờ xuất',      value: stats.value?.pendingDispensations ?? 0,  color: '#fa8c16' },
  { label: 'Hóa đơn chờ thu',     value: stats.value?.pendingInvoices ?? 0,       color: '#1677ff' },
  { label: 'Doanh thu tháng',     value: formatCurrency(stats.value?.monthRevenue ?? 0), color: '#52c41a' },
])

const chartData = computed(() => {
  if (!stats.value?.revenueByDate?.length) return null
  const sorted = [...stats.value.revenueByDate].sort((a, b) => a.date.localeCompare(b.date))
  return {
    labels: sorted.map(d => d.date.slice(5)),
    datasets: [{
      label: 'Doanh thu',
      data: sorted.map(d => d.amount),
      borderColor: '#1677ff',
      backgroundColor: 'rgba(22,119,255,0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 3,
      pointBackgroundColor: '#1677ff',
      borderWidth: 2,
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx: any) => ` ${new Intl.NumberFormat('vi-VN').format(ctx.raw)} ₫`
      }
    }
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      grid: { color: '#f0f0f0' },
      ticks: { callback: (v: any) => new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(v) }
    }
  }
}

const lowStockCols = [
  { title: 'Mã', dataIndex: 'medicineCode', key: 'code', width: 130 },
  { title: 'Tên thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Tồn / Tối thiểu', key: 'stock', width: 200 },
  { title: '', key: 'action', width: 100 }
]

onMounted(async () => {
  loading.value = true
  try {
    const res = await dashboardService.getStats()
    if (res.success) stats.value = res.data ?? null
  } finally { loading.value = false }
})
</script>

<style scoped>
.dashboard { }

/* Stat cards */
.stat-card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #f0f0f0;
  transition: box-shadow 0.2s, transform 0.2s;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
}
.stat-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.1); transform: translateY(-2px); }

.stat-icon {
  width: 52px; height: 52px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px;
  background: var(--bg);
  color: var(--color);
  flex-shrink: 0;
}
.stat-label { font-size: 13px; color: #8c8c8c; margin-bottom: 4px; }
.stat-value { font-size: 22px; font-weight: 700; color: #141414; line-height: 1.2; }
.stat-sub { font-size: 12px; color: #8c8c8c; margin-top: 2px; }

/* Chart card */
.chart-card, .status-card, .low-stock-card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  height: 100%;
}
.card-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 16px;
}
.card-title { font-size: 15px; font-weight: 600; color: #141414; }
.card-sub { font-size: 12px; color: #8c8c8c; margin-top: 2px; }
.chart-wrap { height: 260px; }

.total-revenue { text-align: right; }
.total-revenue > span:first-child { font-size: 20px; font-weight: 700; color: #52c41a; }
.revenue-label { display: block; font-size: 12px; color: #8c8c8c; }

/* Status card */
.status-list { display: flex; flex-direction: column; gap: 14px; }
.status-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 10px 14px;
  background: #fafafa;
  border-radius: 10px;
}
.status-info { display: flex; align-items: center; gap: 10px; }
.status-dot { width: 8px; height: 8px; border-radius: 50%; }
.status-label { font-size: 13px; color: #595959; }
.status-val { font-size: 15px; font-weight: 700; }

.quick-actions .qa-title { font-size: 12px; color: #8c8c8c; margin-bottom: 10px; }
</style>
