<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Heart, Loader2, Sparkles } from 'lucide-vue-next'
import { fetchLiveFunds } from '~/lib/liveData'

const router = useRouter()
const user = useUser()
const catalog = ref<any[]>([])
const loading = ref(true)
const watchlist = ref<string[]>([])

onMounted(async () => {
  if (!user.value) {
    router.replace('/')
    return
  }

  try {
    const watchlistData = await $fetch<string[]>('/api/watchlist')
    watchlist.value = watchlistData
    
    // Fetch live funds and filter by watchlist
    const allFunds = await fetchLiveFunds()
    catalog.value = allFunds.filter(f => watchlist.value.includes(f.id))
  } catch(e) {
    console.error("Failed to fetch watchlist", e)
  }
  
  loading.value = false
})

const removeFromWatchlist = async (e: Event, fundId: string) => {
  e.stopPropagation()
  try {
    await $fetch('/api/watchlist/toggle', {
      method: 'POST',
      body: { fundId }
    })
    watchlist.value = watchlist.value.filter(id => id !== fundId)
    catalog.value = catalog.value.filter(f => f.id !== fundId)
  } catch (e) {
    console.error("Failed to remove from watchlist", e)
  }
}
</script>

<template>
  <div class="min-h-screen bg-white p-4 md:p-8 mb-20 pt-24 font-sans antialiased text-slate-900">
    <div class="max-w-[1280px] mx-auto">
      
      <div class="mb-10">
        <button @click="router.back()" class="text-slate-500 hover:text-emerald-600 transition-colors flex items-center gap-2 group">
          <ArrowLeft :size="18" class="group-hover:-translate-x-1 transition-transform" />
          <span class="text-xs font-bold uppercase tracking-widest">Back</span>
        </button>
      </div>

      <div class="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div class="flex items-center gap-3 mb-4">
            <div class="w-10 h-10 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 border border-rose-100">
              <Heart :size="20" class="fill-rose-500" />
            </div>
            <h1 class="text-4xl font-extrabold text-[#111827] tracking-tight">Your Watchlist</h1>
          </div>
          <p class="text-slate-500 text-lg font-medium leading-relaxed">
            Quick access to the mutual funds you're tracking.
          </p>
        </div>
        <div v-if="catalog.length > 0" class="bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100 h-fit">
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Tracked</p>
          <p class="text-xl font-bold text-slate-900">{{ catalog.length }} Funds</p>
        </div>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center p-32 text-emerald-600">
         <Loader2 :size="48" class="animate-spin mb-4" />
         <p class="font-bold text-slate-400 tracking-widest uppercase text-xs">Loading Watchlist</p>
      </div>

      <div v-else-if="catalog.length === 0" class="flex flex-col items-center justify-center p-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200">
        <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-slate-200 mb-6 shadow-sm">
          <Heart :size="32" />
        </div>
        <h3 class="text-xl font-bold text-slate-900 mb-2">Your watchlist is empty</h3>
        <p class="text-slate-500 mb-8 text-center max-w-sm">Start exploring top-rated mutual funds and save the ones you like for quick tracking.</p>
        <button @click="router.push('/funds')" class="flex items-center gap-2 bg-[#111827] text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-emerald-600 transition-all hover:-translate-y-1 shadow-lg shadow-emerald-500/10">
          <Sparkles :size="18" />
          Explore All Funds
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
        <div 
          v-for="fund in catalog" 
          :key="fund.id" 
          class="relative bg-white border border-slate-100 p-6 rounded-2xl hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all cursor-pointer group flex flex-col h-full ring-1 ring-slate-100/50" 
          @click="router.push(`/invest/${fund.id}`)"
        >
          <!-- Remove from Watchlist -->
          <button 
            @click="(e) => removeFromWatchlist(e, fund.id)"
            class="absolute top-4 right-4 p-2.5 rounded-full bg-rose-50 border border-rose-100 text-rose-500 hover:bg-rose-100 transition-all z-10 hover:scale-110"
          >
            <Heart :size="18" class="fill-rose-500" />
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
  </div>
</template>
