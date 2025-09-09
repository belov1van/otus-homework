<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps<{
  problems: Array<{
    id: number
    title: string
    difficulty: string
    solvedDate: string
  }>
}>()

// Переход на страницу задачи
const goToProblem = (id: number) => {
  router.push(`/problem/${id}`)
}

// Получение класса цвета для сложности задачи
const getDifficultyClass = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return 'text-green-500'
    case 'Medium': return 'text-yellow-500'
    case 'Hard': return 'text-red-500'
    default: return ''
  }
}
</script>

<template>
  <div class="bg-gray-800 rounded-lg p-6">
    <h2 class="text-xl font-semibold mb-4">Solved Problems</h2>
    
    <div class="overflow-x-auto">
      <table class="min-w-full">
        <thead class="bg-gray-700">
          <tr>
            <th class="py-3 px-4 text-left">ID</th>
            <th class="py-3 px-4 text-left">Title</th>
            <th class="py-3 px-4 text-left">Difficulty</th>
            <th class="py-3 px-4 text-left">Solved Date</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="problem in problems" 
            :key="problem.id"
            @click="goToProblem(problem.id)"
            class="border-t border-gray-700 hover:bg-gray-600 cursor-pointer transition-colors"
          >
            <td class="py-3 px-4">{{ problem.id }}</td>
            <td class="py-3 px-4 font-medium">{{ problem.title }}</td>
            <td class="py-3 px-4">
              <span :class="getDifficultyClass(problem.difficulty)">
                {{ problem.difficulty }}
              </span>
            </td>
            <td class="py-3 px-4">{{ problem.solvedDate }}</td>
          </tr>
          <tr v-if="problems.length === 0">
            <td colspan="4" class="py-8 text-center text-gray-400">No problems solved yet</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>