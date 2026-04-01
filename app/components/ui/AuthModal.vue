<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { X, AlertCircle, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-vue-next'

interface Props {
  isOpen: boolean
}
const props = defineProps<Props>()
const emit = defineEmits(['close', 'login'])

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const isLoginMode = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')
const showPassword = ref(false)

// Clear form + error whenever the modal opens or mode switches
watch(() => props.isOpen, (open) => {
  if (open) resetForm()
})
watch(isLoginMode, () => {
  errorMsg.value = ''
})

const resetForm = () => {
  name.value = ''
  email.value = ''
  password.value = ''
  errorMsg.value = ''
  isLoading.value = false
  isLoginMode.value = false
  showPassword.value = false
}

// Parse Nuxt $fetch errors reliably — they can be nested differently
const parseError = (e: any): string => {
  // Nuxt FetchError has e.data.statusMessage or e.data.message
  if (e?.data?.statusMessage) return e.data.statusMessage
  if (e?.data?.message) return e.data.message
  if (e?.statusMessage) return e.statusMessage
  if (e?.message) return e.message
  return 'Something went wrong. Please try again.'
}

const handleSubmit = async () => {
  errorMsg.value = ''

  // Client-side validation before hitting the server
  if (!email.value.trim()) {
    errorMsg.value = 'Please enter your email address.'
    return
  }
  if (!password.value) {
    errorMsg.value = 'Please enter your password.'
    return
  }
  if (!isLoginMode.value && !name.value.trim()) {
    errorMsg.value = 'Please enter your full name.'
    return
  }
  if (password.value.length < 6) {
    errorMsg.value = 'Password must be at least 6 characters.'
    return
  }

  try {
    isLoading.value = true

    if (isLoginMode.value) {
      await $fetch('/api/auth/login', {
        method: 'POST',
        body: { email: email.value.trim(), password: password.value }
      })
    } else {
      await $fetch('/api/auth/register', {
        method: 'POST',
        body: { name: name.value.trim(), email: email.value.trim(), password: password.value }
      })
    }

    // Success — close modal, update global user state, redirect
    emit('login')
    emit('close')
    router.push('/onboarding')

  } catch (e: any) {
    errorMsg.value = parseError(e)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"
          @click="emit('close')"
        />

        <!-- Modal card -->
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 z-10 overflow-hidden">

          <!-- Close button -->
          <button
            @click="emit('close')"
            class="absolute top-5 right-5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X :size="18" />
          </button>

          <!-- Header -->
          <div class="mb-7">
            <div class="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
              <span class="text-2xl">💰</span>
            </div>
            <h2 class="text-2xl font-bold text-slate-900">
              {{ isLoginMode ? 'Welcome back!' : 'Create your account' }}
            </h2>
            <p class="text-slate-500 text-sm mt-1">
              {{ isLoginMode ? 'Login to access your portfolio.' : 'Start investing in top Indian mutual funds.' }}
            </p>
          </div>

          <!-- Error banner -->
          <div
            v-if="errorMsg"
            class="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm"
          >
            <AlertCircle :size="16" class="mt-0.5 shrink-0" />
            <span>{{ errorMsg }}</span>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-4" novalidate>

            <!-- Name (register only) -->
            <div v-if="!isLoginMode">
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                v-model="name"
                type="text"
                autocomplete="name"
                placeholder="e.g. Rohan Shrivastava"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-slate-900 placeholder-slate-400"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                v-model="email"
                type="email"
                autocomplete="email"
                placeholder="you@example.com"
                class="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-slate-900 placeholder-slate-400"
              />
            </div>

            <!-- Password -->
            <div>
              <label class="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div class="relative">
                <input
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="current-password"
                  placeholder="Minimum 6 characters"
                  class="w-full px-4 py-3 pr-11 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-slate-900 placeholder-slate-400"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  @click="showPassword = !showPassword"
                >
                  <Eye v-if="!showPassword" :size="18" />
                  <EyeOff v-else :size="18" />
                </button>
              </div>
            </div>

            <!-- Submit button -->
            <button
              type="submit"
              :disabled="isLoading"
              class="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-colors mt-2"
            >
              <Loader2 v-if="isLoading" :size="18" class="animate-spin" />
              <span>{{ isLoading ? 'Please wait...' : (isLoginMode ? 'Login to Account' : 'Create Account') }}</span>
            </button>

            <!-- Mode toggle -->
            <p class="text-center text-sm text-slate-500 pt-1">
              {{ isLoginMode ? "Don't have an account?" : 'Already have an account?' }}
              <button
                type="button"
                class="font-bold text-green-600 hover:text-green-700 ml-1 transition-colors"
                @click="isLoginMode = !isLoginMode"
              >
                {{ isLoginMode ? 'Sign Up' : 'Login' }}
              </button>
            </p>

          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}
.modal-enter-from .relative {
  transform: scale(0.95) translateY(8px);
}
</style>
