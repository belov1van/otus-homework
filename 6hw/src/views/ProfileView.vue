<script setup lang="ts">
import { ref } from 'vue'
import UserStats from '../components/UserStats.vue'
import SolvedProblems from '../components/SolvedProblems.vue'

// Временные данные для демонстрации
const user = ref({
  username: 'JohnDoe',
  joinDate: '2023-01-01',
  stats: {
    totalSolved: 42,
    easySolved: 20,
    mediumSolved: 15,
    hardSolved: 7,
    ranking: 1024,
    streak: 5
  }
})

const solvedProblems = ref([
  { id: 1, title: 'Two Sum', difficulty: 'Easy', solvedDate: '2023-01-05' },
  { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', solvedDate: '2023-01-10' },
  { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', solvedDate: '2023-01-15' },
  { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', solvedDate: '2023-01-20' },
])
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="bg-gray-800 rounded-lg p-6 mb-8">
      <h1 class="text-3xl font-bold mb-2">{{ user.username }}</h1>
      <p class="text-gray-400">Member since {{ user.joinDate }}</p>
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
</template>