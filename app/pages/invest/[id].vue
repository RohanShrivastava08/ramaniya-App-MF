<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, ShieldCheck, PieChart, Info, Settings, FileText, CheckCircle2, ChevronDown, Activity, X, TrendingUp } from 'lucide-vue-next'
import VueApexCharts from 'vue3-apexcharts'
import { getFundDB } from '~/lib/liveData'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'
import MockRazorpay from '~/components/ui/MockRazorpay.vue'

const route = useRoute()
const router = useRouter()
const user = useUser()

const fundId = route.params.id as string
const FUND_DB = getFundDB()
const fund = computed(() => FUND_DB.find((f: any) => f.id === fundId))

const type = ref('SIP')
const amount = ref('5000')
const years = ref(10)

const isRazorpayOpen = ref(false)
const isSuccess = ref(false)

onMounted(() => {
  if (!fund.value) {
    console.warn("Fund not found.")
    router.replace('/funds')
  }
})

const handleInvest = () => {
  if (!user.value) {
    alert("Session expired. Please log in again.")
    router.push('/')
    return
  }
  
  const numAmount = Number(amount.value)
  if (!numAmount || isNaN(numAmount) || numAmount < 500) {
    alert("Security Error: Minimum investment amount is ₹500.")
    return
  }
  if (numAmount > 10000000) {
    alert("Security Error: Maximum single-tranche investment capped at ₹1,00,00,000.")
    return
  }
  
  isRazorpayOpen.value = true
}

const handlePaymentSuccess = async () => {
  isRazorpayOpen.value = false
  
  try {
    await $fetch('/api/transactions', {
      method: 'POST',
      body: {
        fundId: fund.value?.name,
        amount: Number(amount.value),
        type: type.value
      }
    })
    isSuccess.value = true
  } catch (e) {
    alert("Transaction processing failed across the secure network.")
  }
}

// Calculator Logic
const calculation = computed(() => {
  if (!fund.value) return { investedTotal: 0, estimatedTotal: 0, wealthGained: 0 }
  
  const cagr = Number(fund.value.cagr3Y) / 100
  const p = Number(amount.value) || 0
  let est = 0
  let inv = 0

  if (type.value === 'SIP') {
    const r = cagr / 12
    const n = years.value * 12
    inv = p * n
    est = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
  } else {
    inv = p
    est = p * Math.pow(1 + cagr, years.value)
  }
  
  return {
    investedTotal: inv,
    estimatedTotal: est,
    wealthGained: est - inv
  }
})

// ApexCharts Configuration translation from Recharts
const chartOptions = computed(() => ({
  chart: { 
    type: 'line' as const, 
    toolbar: { show: false }, 
    zoom: { enabled: false },
    fontFamily: 'inherit',
    parentHeightOffset: 0
  },
  colors: ['#16a34a'],
  stroke: { curve: 'monotoneCubic' as const, width: 3 },
  xaxis: { 
    categories: fund.value?.chartData.map((d: any) => d.name) || [], 
    labels: { style: { colors: '#94a3b8', fontSize: '10px', fontWeight: 'bold' } },
    axisBorder: { show: false },
    axisTicks: { show: false }
  },
  yaxis: { show: false },
  grid: { show: false, padding: { left: 0, right: 0, top: 0, bottom: 0 } },
  tooltip: { theme: 'light', x: { show: false }, style: { fontSize: '12px' } },
  markers: { size: 3, colors: ['#fff'], strokeColors: '#16a34a', strokeWidth: 2, hover: { size: 6 } }
}))

const chartSeries = computed(() => [{
  name: 'Historical NAV',
  data: fund.value?.chartData.map((d: any) => d.val) || []
}])
</script>

<template>
  <div v-if="isSuccess" class="min-h-screen bg-slate-50 flex items-center justify-center p-6">
    <Card class="max-w-md w-full text-center p-12 flex flex-col items-center shadow-lg border-slate-200">
      <div class="w-24 h-24 bg-fintech-green-100 text-fintech-green-600 rounded-full flex items-center justify-center mb-6 shadow-inner border-[6px] border-white ring-1 ring-slate-100">
        <CheckCircle2 :size="48" />
      </div>
      <h2 class="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Order Confirmed!</h2>
      <p class="text-slate-600 mb-8 leading-relaxed text-lg font-medium">
        You successfully initiated a {{ type }} mandate of <strong class="text-slate-900">₹{{ Number(amount).toLocaleString() }}</strong> in <br/>
        <span class="font-bold text-fintech-blue-600 mt-2 block">{{ fund?.name }}</span>
      </p>
      <Button @click="router.push('/dashboard')" class="w-full font-bold shadow-md rounded-xl transition-all hover:-translate-y-1" size="lg">Go to Dashboard Portfolio</Button>
    </Card>
  </div>

  <div v-else-if="fund" class="min-h-screen bg-slate-50 p-6 md:p-12 relative mb-20">
    <div class="max-w-5xl mx-auto">
      <button @click="router.back()" class="flex items-center gap-2 text-slate-500 hover:text-slate-800 mb-8 transition-colors font-bold uppercase tracking-wider text-sm">
        <ArrowLeft :size="16" /> Back to Selection
      </button>
      
      <h1 class="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 flex items-center gap-3 tracking-tight">
        <TrendingUp class="text-fintech-green-600" /> Fund Overview & Invest
      </h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <!-- Main Calculation Engine and Chart -->
        <div class="lg:col-span-3 space-y-6">
          <Card class="border-slate-200 overflow-hidden shadow-sm rounded-3xl p-8 bg-white h-fit">
            <div class="mb-6 border-b border-slate-100 pb-5">
              <h2 class="text-2xl font-bold text-slate-900 mb-3">{{ fund.name }}</h2>
              <div class="flex flex-wrap gap-3 text-sm font-semibold">
                <span class="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg uppercase tracking-wider text-[10px]">{{ fund.category }}</span>
                <span class="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg uppercase tracking-wider text-[10px]">{{ fund.risk }} Risk</span>
                <span class="bg-fintech-green-50 text-fintech-green-700 px-3 py-1 rounded-lg uppercase tracking-wider text-[10px] font-bold">+{{ fund.cagr3Y }}% CAGR (3Y)</span>
              </div>
            </div>

            <!-- LIVE GRAPH EMBED -->
            <div class="h-64 bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-8 relative">
              <div class="flex justify-between items-center mb-2 px-2 z-10 relative">
                <span class="text-[10px] font-bold text-slate-400 tracking-wider">HISTORICAL NAV SIMULATION</span>
                <span class="text-xs font-bold text-slate-900 bg-white px-2 py-1 rounded shadow-sm">₹{{ fund.nav }} NAV</span>
              </div>
              <ClientOnly>
                <div class="-mx-3 -mt-6">
                  <VueApexCharts type="line" height="240" :options="chartOptions" :series="chartSeries" />
                </div>
              </ClientOnly>
            </div>
            
            <div class="flex bg-slate-100 p-1.5 rounded-xl mb-6">
              <button 
                :class="`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${type === 'SIP' ? 'bg-white shadow text-slate-900 transform scale-100' : 'text-slate-500 hover:text-slate-700'}`"
                @click="type = 'SIP'"
              >
                Start SIP (Monthly)
              </button>
              <button 
                :class="`flex-1 py-3 text-sm font-bold rounded-lg transition-all ${type === 'ONETIME' ? 'bg-white shadow text-slate-900 transform scale-100' : 'text-slate-500 hover:text-slate-700'}`"
                @click="type = 'ONETIME'"
              >
                Lump Sum (One-Time)
              </button>
            </div>
            
            <div class="mb-6">
              <label class="block text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest pl-1">Investment Amount</label>
              <div class="relative">
                <span class="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">₹</span>
                <input 
                  type="number" 
                  v-model="amount"
                  class="w-full text-3xl font-black pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-fintech-green-500/20 focus:border-fintech-green-500 outline-none bg-slate-50 focus:bg-white transition-all shadow-sm"
                />
              </div>
            </div>

            <div class="mb-8">
              <div class="flex justify-between items-end mb-3">
                <label class="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Time Period</label>
                <div class="text-lg font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">{{ years }} Years</div>
              </div>
              <input 
                type="range" 
                min="1" max="30" 
                v-model.number="years" 
                class="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-fintech-green-600"
              />
              <div class="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase">
                <span>1 Yr</span>
                <span>30 Yrs</span>
              </div>
            </div>

            <div class="bg-fintech-blue-50/50 border border-fintech-blue-100 rounded-2xl p-6 mb-8">
              <h3 class="text-[10px] font-bold text-fintech-blue-800 uppercase tracking-widest mb-4 border-b border-fintech-blue-200/50 pb-2">Projection Results</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center text-fintech-blue-900">
                  <span class="font-semibold text-sm">Total Invested</span>
                  <span class="font-bold tracking-wider">₹{{ Math.round(calculation.investedTotal).toLocaleString() }}</span>
                </div>
                <div class="flex justify-between items-center text-fintech-blue-900">
                  <span class="font-semibold text-sm">Estimated Wealth Gain</span>
                  <span class="font-bold text-fintech-green-600 tracking-wider">+ ₹{{ Math.round(calculation.wealthGained).toLocaleString() }}</span>
                </div>
                <div class="border-t border-fintech-blue-200/50 pt-4 flex justify-between items-center">
                  <span class="font-bold text-slate-700">Expected Total Value</span>
                  <span class="text-2xl font-black text-slate-900 tracking-tight">₹{{ Math.round(calculation.estimatedTotal).toLocaleString() }}</span>
                </div>
                <p class="text-[10px] leading-relaxed text-fintech-blue-600/70 mt-4 font-medium bg-fintech-blue-100/30 p-2 rounded-md uppercase tracking-wider">
                  *Returns are strictly calculated based on historical 3Y CAGR of {{ fund.cagr3Y }}% dynamically and are purely illustrative.
                </p>
              </div>
            </div>
            
            <Button 
              @click="handleInvest" 
              size="lg" 
              class="w-full text-lg h-16 rounded-2xl shadow-lg font-bold tracking-wide transition-all hover:-translate-y-1 bg-slate-900 text-white hover:bg-slate-800"
            >
              Confirm Setup & Invest ₹{{ Number(amount).toLocaleString() }}
            </Button>
            <div class="flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-6">
               <ShieldCheck :size="16" /> Encrypted Bank Demo Mandate
            </div>
          </Card>
        </div>

        <!-- Fund Details Sidebar -->
        <div class="lg:col-span-2 space-y-6">
          <Card class="rounded-3xl border-slate-200 p-6 shadow-sm bg-white">
            <h3 class="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Info :size="18" class="text-fintech-blue-600" /> About the Fund
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                <p class="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">Fund Size</p>
                <p class="text-sm font-bold text-slate-900 tracking-wide">{{ fund.fundSize }}</p>
              </div>
              <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                <p class="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">Expense Ratio</p>
                <p class="text-sm font-bold text-slate-900 tracking-wide">{{ fund.expenseRatio }}</p>
              </div>
              <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                <p class="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">Inception</p>
                <p class="text-sm font-bold text-slate-900 tracking-wide">{{ fund.inceptionDate }}</p>
              </div>
              <div class="bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                <p class="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-widest">Manager</p>
                <p class="text-sm font-bold text-slate-900 tracking-wide">{{ fund.fundManager }}</p>
              </div>
            </div>
          </Card>

          <Card class="rounded-3xl border-slate-200 p-6 shadow-sm bg-white">
            <h3 class="text-lg font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Top Holdings Mapping</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="(h, i) in fund.topHoldings" :key="i" class="px-3 py-1.5 bg-fintech-green-50/50 border border-fintech-green-100 text-fintech-green-800 text-[10px] font-bold tracking-[0.05em] uppercase rounded-lg shadow-sm">
                {{ h }}
              </span>
            </div>
          </Card>
        </div>
      </div>
    </div>
    
    <!-- Dynamic Checkout Overlay Gateway -->
    <MockRazorpay 
      :is-open="isRazorpayOpen" 
      @close="isRazorpayOpen = false" 
      :amount="amount"
      :fund-name="fund.name"
      @success="handlePaymentSuccess"
    />
  </div>
</template>
