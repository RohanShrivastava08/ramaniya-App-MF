<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '~/components/layout/Navbar.vue'
import Footer from '~/components/layout/Footer.vue'
import AuthModal from '~/components/ui/AuthModal.vue'

const user = useUser()
const isAuthOpen = useAuthModal()
const router = useRouter()

// Toast notification state
const toast = ref<{ message: string; type: 'success' | 'error' } | null>(null)
let toastTimer: ReturnType<typeof setTimeout> | null = null

const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  if (toastTimer) clearTimeout(toastTimer)
  toast.value = { message, type }
  toastTimer = setTimeout(() => { toast.value = null }, 3000)
}

// On every page load, silently check if the user's session cookie is still valid
onMounted(async () => {
  await useFetchUser()
})

const handleLogout = async () => {
  try {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
    isAuthOpen.value = false
    showToast('You have been logged out successfully.')
    router.push('/')
  } catch (e) {
    showToast('Logout failed. Please try again.', 'error')
  }
}

const handleLogin = async () => {
  // Called by AuthModal after successful register or login
  await useFetchUser()
  showToast(`Welcome back, ${user.value?.name || 'there'}! 👋`)
}
</script>

<template>
  <div class="min-h-screen flex flex-col">

    <Navbar
      :user="user"
      @loginClick="isAuthOpen = true"
      @logoutClick="handleLogout"
    />

    <main class="flex-grow pt-16">
      <slot />
    </main>

    <Footer />

    <!-- Global Auth Modal -->
    <AuthModal
      :isOpen="isAuthOpen"
      @close="isAuthOpen = false"
      @login="handleLogin"
    />

    <!-- Toast Notification -->
    <Transition name="toast">
      <div
        v-if="toast"
        :class="[
          'fixed bottom-6 left-1/2 -translate-x-1/2 z-[300] px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2 max-w-sm text-center',
          toast.type === 'success'
            ? 'bg-green-600 text-white'
            : 'bg-red-600 text-white'
        ]"
      >
        <span>{{ toast.type === 'success' ? '✅' : '❌' }}</span>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from, .toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(16px);
}
</style>
