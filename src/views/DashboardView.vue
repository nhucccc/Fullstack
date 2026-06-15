<template>
  <div>
    <a-page-header title="Tổng quan" sub-title="Thống kê hệ thống hôm nay" />

    <a-spin :spinning="loading">
      <!-- Stat Cards -->
      <a-row :gutter="[16, 16]">
        <a-col :xs="24" :sm="12" :lg="6">
          <a-card hoverable>
            <a-statistic title="Tổng số thuốc" :value="stats?.totalMedicines ?? 0"
              :value-style="{ color: '#1890ff' }">
              <template #prefix><MedicineBoxOutlined /></template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :lg="6">
          <a-card hoverable :style="stats?.lowStockCount ? 'border-color: #ff4d4f' : ''">
            <a-statistic title="Thuốc sắp hết" :value="stats?.lowStockCount ?? 0"
              :value-style="{ color: stats?.lowStockCount ? '#ff4d4f' : '#52c41a' }">
              <template #prefix><WarningOutlined /></template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :lg="6">
          <a-card hoverable>
            <a-statistic title="Xuất thuốc hôm nay" :value="stats?.todayDispensations ?? 0"
              :value-style="{ color: '#722ed1' }">
              <template #prefix><FileTextOutlined /></template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :xs="24" :sm="12" :lg="6">
          <a-card hoverable>
            <a-statistic title="Doanh thu hôm nay"
              :value="stats?.todayRevenue ?? 0"
              :formatter="(v: any) => formatCurrency(Number(v))"
              :value-style="{ color: '#52c41a' }">
              <template #prefix><DollarOutlined /></template>
            </a-statistic>
          </a-card>
        </a-col>
      </a-row>

      <a-row :gutter="[16, 16]" style="margin-top: 16px">
        <!-- Revenue chart -->
        <a-col :xs="24" :lg="16">
          <a-card title="Doanh thu 30 ngày gần đây">
            <Line v-if="chartData" :data="chartData" :options="chartOptions" style="height: 280px" />
            <a-empty v-else description="Chưa có dữ liệu" />
          </a-card>
        </a-col>

        <!-- Quick stats -->
        <a-col :xs="24" :lg="8">
          <a-card title="Trạng thái hệ thống" style="height: 100%">
            <a-list size="small">
              <a-list-item>
                <span>Chờ xuất thuốc</span>
                <a-badge :count="stats?.pendingDispensations ?? 0" show-zero
                  :color="stats?.pendingDispensations ? 'orange' : 'green'" />
              </a-list-item>
              <a-list-item>
                <span>Chờ thanh toán</span>
                <a-badge :count="stats?.pendingInvoices ?? 0" show-zero
                  :color="stats?.pendingInvoices ? 'orange' : 'green'" />
              </a-list-item>
              <a-list-item>
                <span>Doanh thu tháng này</span>
                <strong style="color: #52c41a">{{ formatCurrency(stats?.monthRevenue ?? 0) }}</strong>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
      </a-row>

      <!-- Low stock alert -->
      <a-row style="margin-top: 16px" v-if="stats?.lowStockMedicines?.length">
        <a-col :span="24">
          <a-card title="⚠️ Thuốc sắp hết kho" extra="Cần nhập hàng">
            <a-table :dataSource="stats.lowStockMedicines" :columns="lowStockColumns"
              size="small" :pagination="false" row-key="id">
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'stock'">
                  <a-tag :color="record.stock <= record.minimumStock / 2 ? 'red' : 'orange'">
                    {{ record.stock }} / {{ record.minimumStock }}
                  </a-tag>
                </template>
                <template v-if="column.key === 'action'">
                  <a-button type="link" size="small" @click="router.push(`/medicines/${record.id}`)">
                    Nhập kho
                  </a-button>
                </template>
              </template>
            </a-table>
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
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

const router = useRouter()
const loading = ref(false)
const stats = ref<DashboardStats | null>(null)

const lowStockColumns = [
  { title: 'Mã thuốc', dataIndex: 'medicineCode', key: 'medicineCode', width: 120 },
  { title: 'Tên thuốc', dataIndex: 'name', key: 'name' },
  { title: 'Tồn kho / Tối thiểu', key: 'stock' },
  { title: '', key: 'action', width: 80 }
]

const chartData = computed(() => {
  if (!stats.value?.revenueByDate?.length) return null
  const sorted = [...stats.value.revenueByDate].sort((a, b) => a.date.localeCompare(b.date))
  return {
    labels: sorted.map(d => d.date.slice(5)), // MM-DD
    datasets: [{
      label: 'Doanh thu (VNĐ)',
      data: sorted.map(d => d.amount),
      borderColor: '#1890ff',
      backgroundColor: 'rgba(24,144,255,0.1)',
      fill: true,
      tension: 0.4
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: {
      ticks: {
        callback: (v: number | string) => new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(Number(v))
      }
    }
  }
}

onMounted(async () => {
  loading.value = true
  try {
    const res = await dashboardService.getStats()
    if (res.success) stats.value = res.data ?? null
  } finally {
    loading.value = false
  }
})
</script>
