<template>
  <div>
    <a-page-header title="Báo cáo doanh thu" />
    <a-card style="margin-bottom:16px">
      <a-space>
        <a-range-picker v-model:value="dateRange" :default-value="defaultRange" @change="fetchReport" />
        <a-button type="primary" @click="fetchReport"><BarChartOutlined /> Xem báo cáo</a-button>
      </a-space>
    </a-card>

    <a-spin :spinning="loading">
      <a-row :gutter="16">
        <a-col :span="8">
          <a-card>
            <a-statistic title="Tổng doanh thu kỳ" :value="reportData?.totalRevenue ?? 0"
              :formatter="(v: any) => formatCurrency(Number(v))" :value-style="{ color:'#52c41a', fontSize:'22px' }">
              <template #prefix><RiseOutlined /></template>
            </a-statistic>
          </a-card>
        </a-col>
        <a-col :span="16">
          <a-card title="Biểu đồ doanh thu theo ngày">
            <Bar v-if="chartData" :data="chartData" :options="chartOptions" style="height:260px" />
            <a-empty v-else description="Chọn khoảng thời gian để xem báo cáo" />
          </a-card>
        </a-col>
      </a-row>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { invoiceService } from '@/services/invoiceService'
import { formatCurrency } from '@/utils/format'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js'
import { BarChartOutlined, RiseOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

const loading = ref(false)
const reportData = ref<any>(null)
const dateRange = ref<any>(null)
const defaultRange: [any, any] = [dayjs().subtract(30, "day"), dayjs()]

const chartData = computed(() => {
  if (!reportData.value?.byDate) return null
  const entries = Object.entries(reportData.value.byDate as Record<string, number>).sort((a, b) => a[0].localeCompare(b[0]))
  return {
    labels: entries.map(([d]) => d.slice(5)),
    datasets: [{ label: 'Doanh thu (VNĐ)', data: entries.map(([, v]) => v), backgroundColor: 'rgba(24,144,255,0.7)', borderRadius: 4 }]
  }
})

const chartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: { y: { ticks: { callback: (v: number | string) => new Intl.NumberFormat('vi-VN', { notation: 'compact' }).format(Number(v)) } } }
}

const fetchReport = async () => {
  const range = dateRange.value || defaultRange
  loading.value = true
  try {
    const res = await invoiceService.getRevenueReport(dayjs(range[0]).toISOString(), dayjs(range[1]).toISOString())
    if (res.success) reportData.value = res.data
  } finally { loading.value = false }
}
</script>
