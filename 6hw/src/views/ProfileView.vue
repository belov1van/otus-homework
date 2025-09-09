<script setup lang="ts">
import { computed } from 'vue'
import UserStats from '../components/UserStats.vue'
import SolvedProblems from '../components/SolvedProblems.vue'
import { useUserStore } from '../stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

// Получаем данные пользователя из хранилища
const user = computed(() => userStore.user)

// Получаем решенные задачи из хранилища
const solvedProblems = computed(() => userStore.user.solvedProblems)

// Обработчик выхода из системы
const handleLogout = () => {
  userStore.logout()
  router.push('/')
}

// Имитация входа в систему (для демонстрации)
const handleLogin = () => {
  userStore.login('JohnDoe')
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div v-if="userStore.isAuthenticated">
      <div class="bg-gray-800 rounded-lg p-6 mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold mb-2">{{ user.username }}</h1>
          <p class="text-gray-400">Member since {{ user.joinDate }}</p>
        </div>
        <button 
          @click="handleLogout" 
          class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Выйти
        </button>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Статистика пользователя -->
        <div class="lg:col-span-1">
          <UserStats :stats="user.stats" />
        </div>
        
        <!-- Решенные задачи -->
        <div class="lg:col-span-2">
          <SolvedProblems :problems="solvedProblems" />
        </div>
      </div>
    </div>
    
    <div v-else class="text-center py-12">
      <h2 class="text-2xl font-bold mb-4">Вы не вошли в систему</h2>
      <p class="mb-6">Войдите, чтобы увидеть свой профиль и статистику</p>
      <button 
        @click="handleLogin" 
        class="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Войти (демо)
      </button>
    </div>
  </div>
</template>