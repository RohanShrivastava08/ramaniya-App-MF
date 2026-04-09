<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, TrendingUp, Landmark, Activity, Loader2, Heart } from 'lucide-vue-next'
import { fetchLiveFunds } from '~/lib/liveData'
import Button from '~/components/ui/Button.vue'
import Card from '~/components/ui/Card.vue'

const router = useRouter()
const user = useUser()
const isOnboarding = ref(false)
const catalog = ref<any[]>([])
const loading = ref(true)
const watchlist = ref<string[]>([])

onMounted(async () => {
  try {
    const [transactions, watchlistData] = await Promise.all([
      user.value ? $fetch<any[]>('/api/transactions') : Promise.resolve([]),
      user.value ? $fetch<string[]>('/api/watchlist') : Promise.resolve([])
    ])
    isOnboarding.value = user.value ? transactions.length === 0 : true
    watchlist.value = watchlistData
  } catch(e) {
    isOnboarding.value = true
  }
  
  catalog.value = await fetchLiveFunds()
  loading.value = false
})

const toggleWatchlist = async (e: Event, fundId: string) => {
  e.stopPropagation() // Prevent card click (router navigation)
  if (!user.value) {
    alert("Please log in to save funds to your watchlist.")
    return
  }

  try {
    const res = await $fetch<{action: string}>('/api/watchlist/toggle', {
      method: 'POST',
      body: { fundId }
    })
    
    if (res.action === 'added') {
      watchlist.value.push(fundId)
    } else {
      watchlist.value = watchlist.value.filter(id => id !== fundId)
    }
  } catch (e) {
    console.error("Failed to toggle watchlist", e)
  }
}

const isInWatchlist = (fundId: string) => watchlist.value.includes(fundId)

const categories = [
  { id: 'Equity', icon: TrendingUp, iconClass: "text-emerald-600", desc: "High growth potential over long term horizons." },
  { id: 'Debt', icon: Landmark, iconClass: "text-purple-600", desc: "Stable returns, safe fixed-income assets." },
  { id: 'Hybrid', icon: Activity, iconClass: "text-blue-600", desc: "Optimized balanced portfolio buffering equity volatility." }
]
</script>

<template>
  <div class="min-h-screen bg-white p-4 md:p-8 mb-20 pt-24 font-sans antialiased text-slate-900">
    <div class="max-w-[1280px] mx-auto">
      
      <!-- Header Navigation -->
      <div v-if="user" class="mb-10 flex items-center justify-between">
        <button @click="router.push('/dashboard')" class="text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-2 group">
          <ArrowLeft :size="18" class="group-hover:-translate-x-1 transition-transform" />
          <span class="text-xs font-bold uppercase tracking-widest">Back to Portfolio</span>
        </button>
        <NuxtLink v-if="user" to="/watchlist" class="flex items-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 hover:bg-emerald-100 transition-colors">
          <Heart :size="14" class="fill-emerald-600" />
          View Watchlist
        </NuxtLink>
      </div>
      
      <div class="mb-16">
        <h1 class="text-4xl md:text-5xl font-extrabold text-[#111827] mb-5 tracking-tight leading-tight">
          Explore Mutual Funds
        </h1>
        <p class="text-slate-500 text-lg font-medium max-w-2xl leading-relaxed">
          Discover a curated list of top-performing mutual funds in India. Minimal risk, maximum growth.
        </p>
      </div>
      
      <div class="space-y-20">
        <div v-if="loading" class="flex flex-col items-center justify-center p-32 text-emerald-600">
           <Loader2 :size="48" class="animate-spin mb-4" />
           <p class="font-bold text-slate-400 tracking-widest uppercase text-xs">Syncing Market NAVs</p>
        </div>
        
        <template v-else>
          <template v-for="cat in categories" :key="cat.id">
            <div v-if="catalog.filter(f => f.category === cat.id).length > 0" class="animate-fade-in-up">
              <div class="mb-8 flex items-baseline gap-4">
                <h2 class="text-2xl font-bold text-slate-900">{{ cat.id }} Funds</h2>
                <p class="text-slate-400 text-sm font-medium">{{ catalog.filter(f => f.category === cat.id).length }} funds found</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div 
                  v-for="fund in catalog.filter(f => f.category === cat.id)" 
                  :key="fund.id" 
                  class="relative bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all cursor-pointer group flex flex-col h-full ring-1 ring-slate-100/50" 
                  @click="router.push(`/invest/${fund.id}`)"
                >
                  <!-- Heart Button -->
                  <button 
                    @click="(e) => toggleWatchlist(e, fund.id)"
                    class="absolute top-4 right-4 p-2.5 rounded-full bg-slate-50 border border-slate-100 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all z-10 hover:scale-110 active:scale-95"
                  >
                    <Heart :size="18" :class="isInWatchlist(fund.id) ? 'fill-rose-500 text-rose-500' : ''" />
                  </button>

                  <div class="flex items-center gap-2 mb-6">
                    <div class="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-sm font-bold text-slate-400 border border-slate-100">
                      {{ fund.name.charAt(0) }}
                    </div>
                    <div>
                      <span class="text-[10px] font-black px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-md uppercase tracking-wider border border-emerald-100">{{ fund.risk }}</span>
                    </div>
                  </div>
                  
                  <h3 class="text-[17px] font-bold text-slate-800 mb-8 leading-snug group-hover:text-emerald-600 transition-colors line-clamp-2 min-h-[3rem]">
                    {{ fund.name }}
                  </h3>
                  
                  <div class="flex items-end justify-between mt-auto pt-6 border-t border-slate-50">
                    <div>
                      <p class="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">3Y Returns</p>
                      <p class="text-lg font-black text-emerald-600 tracking-tight">{{ fund.cagr3Y }}%</p>
                    </div>
                    <div class="text-right">
                      <p class="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-widest">NAV</p>
                      <p class="text-lg font-bold text-slate-800 tracking-tight">₹{{ fund.nav }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.grid > div {
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>

