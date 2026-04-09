<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Menu, X, TrendingUp, Heart } from 'lucide-vue-next'
import Button from '~/components/ui/Button.vue'

interface Props {
  user?: { name: string } | null
}
defineProps<Props>()
const emit = defineEmits(['loginClick', 'logoutClick'])

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 10
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header 
    :class="`fixed top-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/50 py-3' : 'bg-transparent py-5'
    }`"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
      <!-- Logo -->
      <div class="flex items-center gap-2">
        <div class="bg-fintech-green-600 p-2 rounded-xl text-white">
          <TrendingUp :size="24" />
        </div>
        <span class="text-xl font-bold tracking-tight text-slate-900">Ramaniya</span>
      </div>

      <!-- Desktop Nav -->
      <nav class="hidden md:flex items-center gap-8 font-medium text-slate-600">
        <a href="/#how-it-works" class="hover:text-fintech-green-600 transition-colors">How it Works</a>
        <a href="/#features" class="hover:text-fintech-green-600 transition-colors">Features</a>
        <NuxtLink to="/news" class="hover:text-fintech-green-600 transition-colors flex items-center gap-1">
            News <span class="bg-fintech-blue-50 text-fintech-blue-600 text-[8px] uppercase tracking-widest font-black px-1.5 py-0.5 rounded shadow-sm">Live</span>
        </NuxtLink>
        <a href="/#funds" class="hover:text-fintech-green-600 transition-colors">Funds</a>
        <NuxtLink v-if="user" to="/watchlist" class="hover:text-fintech-green-600 transition-colors flex items-center gap-1.5">
            <Heart :size="14" /> Watchlist
        </NuxtLink>
      </nav>

      <!-- Desktop Actions -->
      <div class="hidden md:flex items-center gap-4">
        <template v-if="user">
          <span class="text-sm font-semibold text-fintech-green-700 bg-fintech-green-50 px-3 py-1.5 rounded-full">Hi, {{ user.name.split(' ')[0] }}</span>
          <Button variant="ghost" @click="emit('logoutClick')">Log Out</Button>
        </template>
        <template v-else>
          <Button variant="ghost" @click="emit('loginClick')">Log In</Button>
          <Button variant="primary" @click="emit('loginClick')">Start Investing</Button>
        </template>
      </div>

      <!-- Mobile menu toggle -->
      <button 
        class="md:hidden text-slate-900 p-2"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <X v-if="isMobileMenuOpen" :size="24" />
        <Menu v-else :size="24" />
      </button>
    </div>

    <!-- Mobile Nav -->
    <div v-if="isMobileMenuOpen" class="md:hidden absolute top-full left-0 w-full bg-white border-b border-slate-200 shadow-lg py-4 px-4 flex flex-col gap-4">
      <a href="/#how-it-works" class="block font-medium text-slate-700 py-2">How it Works</a>
      <a href="/#features" class="block font-medium text-slate-700 py-2">Features</a>
      <NuxtLink to="/news" class="block font-medium text-slate-700 py-2 flex items-center gap-2">
          News <span class="bg-fintech-blue-50 text-fintech-blue-600 text-[8px] uppercase tracking-widest font-black px-1.5 py-0.5 rounded shadow-sm">Live</span>
      </NuxtLink>
      <a href="/#funds" class="block font-medium text-slate-700 py-2">Funds</a>
      <NuxtLink v-if="user" to="/watchlist" class="block font-medium text-slate-700 py-2 flex items-center gap-2">
          <Heart :size="16" /> Watchlist
      </NuxtLink>
      <div class="pt-4 border-t border-slate-100 flex flex-col gap-3">
        <template v-if="user">
          <div class="text-center text-sm font-semibold text-fintech-green-700 bg-fintech-green-50 py-2 rounded-lg">Welcome, {{ user.name }}</div>
          <Button variant="outline" class="w-full justify-center" @click="emit('logoutClick')">Log Out</Button>
        </template>
        <template v-else>
          <Button variant="outline" class="w-full justify-center" @click="emit('loginClick')">Log In</Button>
          <Button variant="primary" class="w-full justify-center" @click="emit('loginClick')">Start Investing</Button>
        </template>
      </div>
    </div>
  </header>
</template>
