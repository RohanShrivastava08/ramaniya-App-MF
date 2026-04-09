<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  TrendingUp, 
  Wallet, 
  PieChart, 
  Trash2,
  CheckCircle2,
  LogOut,
  ChevronRight,
  TrendingDown
} from 'lucide-vue-next'
import { getFundDB } from '~/lib/liveData'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'

definePageMeta({
  layout: false // Disables the default layout to use the custom Dashboard Nav
})

const router = useRouter()
const user = useUser()

const investments = ref<any[]>([])
const kycDone = ref(false)
const FUND_DB = getFundDB()

onMounted(async () => {
  if (!user.value) {
    router.replace('/')
    return
  }
  
  kycDone.value = localStorage.getItem('ramaniya_kyc') === 'true'
  
  try {
    const data = await $fetch<any[]>('/api/transactions')
    // We map transaction payload safely to local matching structs
    investments.value = data.map(tx => ({
       id: tx.id,
       fundName: tx.fundId, // we saved the exact semantic name as fundId mapped inside schema
       amount: tx.amount,
       type: tx.type,
       date: tx.createdAt
    }))
  } catch(e) {
    console.warn("Failed fetching investments.", e)
  }
})

const handleLogout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  localStorage.removeItem('ramaniya_kyc')
  user.value = null
  router.replace('/')
}

const deleteInvestment = async (id: string) => {
  try {
    await $fetch(`/api/transactions/${id}`, { method: 'DELETE' })
    investments.value = investments.value.filter(inv => inv.id !== id)
  } catch(e) {
    alert("Withdrawal execution failed securely.")
  }
}

// Math Setup Computed
const portfolioStats = computed(() => {
  let totalInvested = 0
  let currentValue = 0
  const allocation: { [key: string]: number } = { Equity: 0, Debt: 0, Hybrid: 0 }

  investments.value.forEach((inv: any) => {
    totalInvested += inv.amount
    const fundDetails = FUND_DB.find((f: any) => f.name === inv.fundName)
    const simulatedReturn = fundDetails ? (inv.amount * (Number(fundDetails.currentReturn) / 100)) : (inv.amount * 0.05)
    currentValue += inv.amount + simulatedReturn
    
    if (fundDetails && allocation[fundDetails.category] !== undefined) {
      allocation[fundDetails.category] += inv.amount
    }
  })

  const totalReturn = currentValue - totalInvested
  const returnPercentage = totalInvested > 0 ? (totalReturn / totalInvested) * 100 : 0
  
  return {
    totalInvested,
    currentValue,
    totalReturn,
    returnPercentage,
    eqPct: totalInvested > 0 ? ((allocation.Equity || 0) / totalInvested) * 100 : 0,
    dtPct: totalInvested > 0 ? ((allocation.Debt || 0) / totalInvested) * 100 : 0,
    hbPct: totalInvested > 0 ? ((allocation.Hybrid || 0) / totalInvested) * 100 : 0,
  }
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 flex flex-col" v-if="user">
    <!-- Navbar -->
    <nav class="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
      <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div class="flex items-center gap-3 cursor-pointer" @click="router.push('/')">
          <div class="bg-fintech-green-600 p-2 rounded-xl text-white shadow-md">
            <TrendingUp :size="22" :stroke-width="2.5" />
          </div>
          <span class="text-xl font-black text-slate-900 tracking-tight">Ramaniya</span>
        </div>
        <button 
          @click="handleLogout"
          class="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors font-bold text-sm tracking-widest uppercase bg-slate-100 hover:bg-red-50 px-4 py-2 rounded-lg"
        >
          <LogOut :size="16" /> Logout
        </button>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-16">
      <div class="mb-12">
        <h1 class="text-4xl md:text-5xl font-black text-slate-900 mb-3 tracking-tight">
          Welcome back, <span class="text-fintech-green-600">{{ user.name.split(' ')[0] }}</span>!
        </h1>
        <p class="text-xl text-slate-500 font-medium">Here is the real-time overview of your wealth portfolio.</p>
      </div>

      <div v-if="investments.length === 0" class="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200 max-w-3xl">
        <!-- Empty State / Getting Started -->
        <h2 class="text-2xl font-bold text-slate-900 mb-8 border-b border-slate-100 pb-4">Getting Started Checklist</h2>
        
        <div class="space-y-6">
          <div :class="`p-6 rounded-2xl border-2 flex items-center gap-6 transition-all ${kycDone ? 'border-fintech-green-100 bg-fintech-green-50/30' : 'border-slate-200 bg-white hover:border-fintech-blue-300'}`">
            <div :class="`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm ${kycDone ? 'bg-fintech-green-500 text-white' : 'bg-slate-100 text-slate-400'}`">
              <CheckCircle2 v-if="kycDone" :size="24" /> 
              <span v-else class="font-bold">1</span>
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-slate-900">Complete CKYC & PAN Status</h3>
              <p class="text-slate-500 text-sm font-medium mt-1">Legally required verified routing.</p>
            </div>
            <Button v-if="!kycDone" @click="router.push('/onboarding')" class="shrink-0 bg-slate-900 text-white rounded-xl font-bold shadow-md">Complete Setup</Button>
          </div>

          <div class="p-6 rounded-2xl border-2 flex items-center gap-6 transition-all border-slate-200 bg-white hover:border-fintech-blue-300">
            <div class="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-slate-100 text-slate-400 font-bold">2</div>
            <div class="flex-1">
              <h3 class="text-lg font-bold text-slate-900">Explore Mutual Funds</h3>
              <p class="text-slate-500 text-sm font-medium mt-1">Browse high-return categorized indices.</p>
            </div>
            <Button @click="router.push('/funds')" class="shrink-0 font-bold shadow-md rounded-xl" :disabled="!kycDone">Explore Catalog</Button>
          </div>
        </div>
      </div>
      
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Active Portfolio Grid -->
        
        <!-- Left Column: Metrics & Graphics -->
        <div class="lg:col-span-1 space-y-8">
           <Card class="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl overflow-hidden relative border-none">
             <div class="absolute top-0 right-0 w-64 h-64 bg-fintech-green-500/10 rounded-full blur-3xl"></div>
             <div class="absolute -bottom-10 -left-10 w-48 h-48 bg-fintech-blue-500/20 rounded-full blur-2xl"></div>
             
             <p class="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-3 relative z-10 flex items-center gap-2">
               <Wallet :size="14"/> Current Value
             </p>
             <h2 class="text-5xl font-black mb-10 tracking-tighter relative z-10">
               <span class="text-slate-500 text-3xl mr-1">₹</span>
               {{ Math.round(portfolioStats.currentValue).toLocaleString() }}
             </h2>

             <div class="space-y-6 relative z-10">
               <div>
                 <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Invested</p>
                 <p class="text-xl font-bold">₹{{ Math.round(portfolioStats.totalInvested).toLocaleString() }}</p>
               </div>
               <div class="border-t border-slate-800 pt-6">
                 <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Absolute Returns</p>
                 <div class="flex items-center gap-3">
                   <p :class="`text-2xl font-black tracking-tight ${portfolioStats.totalReturn >= 0 ? 'text-fintech-green-400' : 'text-red-400'}`">
                     {{ portfolioStats.totalReturn >= 0 ? '+' : '-' }}₹{{ Math.abs(Math.round(portfolioStats.totalReturn)).toLocaleString() }}
                   </p>
                   <span :class="`px-2.5 py-1 text-xs font-black rounded-lg ${portfolioStats.totalReturn >= 0 ? 'bg-fintech-green-500/20 text-fintech-green-400' : 'bg-red-500/20 text-red-400'}`">
                     {{ portfolioStats.totalReturn >= 0 ? '+' : '' }}{{ portfolioStats.returnPercentage.toFixed(2) }}%
                   </span>
                 </div>
               </div>
             </div>
           </Card>

           <Card class="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
             <h3 class="text-sm font-black text-slate-900 mb-6 uppercase tracking-widest flex items-center gap-2">
               <PieChart :size="18" class="text-fintech-blue-600" /> Asset Allocation
             </h3>

             <!-- Bar Chart mapping -->
             <div class="w-full h-4 rounded-full flex overflow-hidden mb-6 bg-slate-100">
               <div v-if="portfolioStats.eqPct > 0" :style="`width: ${portfolioStats.eqPct}%`" class="bg-fintech-green-500 h-full"></div>
               <div v-if="portfolioStats.dtPct > 0" :style="`width: ${portfolioStats.dtPct}%`" class="bg-purple-500 h-full"></div>
               <div v-if="portfolioStats.hbPct > 0" :style="`width: ${portfolioStats.hbPct}%`" class="bg-fintech-blue-500 h-full"></div>
             </div>

             <div class="space-y-4">
               <div class="flex justify-between items-center text-sm font-bold">
                 <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-fintech-green-500"></div> Equity</div>
                 <span class="text-slate-900">{{ portfolioStats.eqPct.toFixed(1) }}%</span>
               </div>
               <div class="flex justify-between items-center text-sm font-bold">
                 <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-purple-500"></div> Debt</div>
                 <span class="text-slate-900">{{ portfolioStats.dtPct.toFixed(1) }}%</span>
               </div>
               <div class="flex justify-between items-center text-sm font-bold">
                 <div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full bg-fintech-blue-500"></div> Hybrid</div>
                 <span class="text-slate-900">{{ portfolioStats.hbPct.toFixed(1) }}%</span>
               </div>
             </div>
           </Card>
        </div>

        <!-- Right Column: Ledger Log -->
        <div class="lg:col-span-2 space-y-6">
          <div class="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h3 class="font-black text-xl text-slate-900">Your Active Holdings</h3>
            <Button @click="router.push('/funds')" class="gap-2 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold shadow-none rounded-xl">
              Invest More <ChevronRight :size="16"/>
            </Button>
          </div>

          <div class="space-y-4">
            <template v-for="inv in investments" :key="inv.id">
              <Card class="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow">
                <div class="flex-1 w-full">
                  <div class="flex justify-between items-start mb-2">
                    <span class="px-3 py-1 bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-bold rounded-lg uppercase tracking-widest">Mandate</span>
                    <span class="text-[10px] font-bold text-slate-400 tracking-wider">{{ new Date(inv.date).toLocaleDateString() }}</span>
                  </div>
                  <h4 class="text-xl font-black text-slate-900 mb-6 tracking-tight line-clamp-1">{{ inv.fundName }}</h4>
                  
                  <div class="flex flex-wrap gap-8 md:gap-12">
                    <div>
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Invested</p>
                      <p class="text-xl font-bold text-slate-900">₹{{ inv.amount.toLocaleString() }}</p>
                    </div>
                    <div class="border-l border-slate-100 pl-8 md:pl-12">
                      <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Unrealized P&L</p>
                      <div class="flex items-center gap-2">
                        <p :class="`text-xl font-black tracking-tight ${Number(FUND_DB.find((f: any) => f.name === inv.fundName)?.currentReturn || 5) > 0 ? 'text-fintech-green-600' : 'text-red-500'}`">
                          {{ Number(FUND_DB.find((f: any) => f.name === inv.fundName)?.currentReturn || 5) > 0 ? '+' : '' }}{{ FUND_DB.find((f: any) => f.name === inv.fundName)?.currentReturn || 5 }}%
                        </p>
                        <TrendingUp v-if="Number(FUND_DB.find((f: any) => f.name === inv.fundName)?.currentReturn || 5) > 0" :size="16" class="text-fintech-green-500"/>
                        <TrendingDown v-else :size="16" class="text-red-500"/>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div class="w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6">
                  <button 
                    @click="deleteInvestment(inv.id)"
                    class="flex w-full md:w-auto items-center justify-center gap-2 text-red-500 hover:text-white hover:bg-red-500 px-4 py-3 rounded-xl transition-colors font-bold text-xs uppercase tracking-widest"
                  >
                    <Trash2 :size="16" /> Withdraw
                  </button>
                </div>
              </Card>
            </template>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>
