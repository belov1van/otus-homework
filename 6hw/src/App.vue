<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from './stores/userStore'

const userStore = useUserStore()

const handleLogin = () => {
  userStore.login('JohnDoe')
}

const handleLogout = () => {
  userStore.logout()
}
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-white">
    <!-- Навигационная панель -->
    <nav class="bg-gray-800 border-b border-gray-700">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center space-x-8">
            <RouterLink to="/" class="text-xl font-bold">CodeChallenge</RouterLink>
            <div class="hidden md:flex space-x-4">
              <RouterLink to="/" class="hover:text-blue-400 transition-colors">Problems</RouterLink>
              <a href="#" class="hover:text-blue-400 transition-colors">Contests</a>
              <a href="#" class="hover:text-blue-400 transition-colors">Discuss</a>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <template v-if="userStore.isAuthenticated">
              <RouterLink to="/profile" class="hover:text-blue-400 transition-colors">Профиль</RouterLink>
              <button @click="handleLogout" class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                Выйти
              </button>
            </template>
            <template v-else>
              <button @click="handleLogin" class="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Войти (демо)
              </button>
            </template>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Основное содержимое -->
    <main>
      <RouterView />
    </main>
    
    <!-- Футер -->
    <footer class="bg-gray-800 border-t border-gray-700 py-6">
      <div class="container mx-auto px-4 text-center text-gray-400">
        <p>© 2023 CodeChallenge. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>
