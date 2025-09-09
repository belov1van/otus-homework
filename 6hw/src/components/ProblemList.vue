<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useProblemStore } from '../stores/problemStore'

const router = useRouter()
const problemStore = useProblemStore()

// Для обратной совместимости с компонентами, которые все еще передают пропсы
const props = defineProps<{
  problems?: Array<{
    id: number
    title: string
    difficulty: string
    category: string
    popularity: number
  }>
  filters?: {
    difficulty: string
    category: string
    sortBy: string
  }
}>()

// Фильтрация и сортировка задач
const filteredProblems = computed(() => {
  // Если переданы пропсы, используем их для обратной совместимости
  if (props.problems && props.filters) {
    let result = [...props.problems]
    
    // Фильтрация по сложности
    if (props.filters.difficulty) {
      result = result.filter(problem => problem.difficulty === props.filters.difficulty)
    }
    
    // Фильтрация по категории
    if (props.filters.category) {
      result = result.filter(problem => problem.category === props.filters.category)
    }
    
    // Сортировка
    if (props.filters.sortBy === 'popularity') {
      result.sort((a, b) => b.popularity - a.popularity)
    }
    
    return result
  }
  
  // Иначе используем хранилище
  return problemStore.filteredProblems
})

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
  <div class="overflow-x-auto">
    <table class="min-w-full bg-gray-800 rounded-lg overflow-hidden">
      <thead class="bg-gray-700">
        <tr>
          <th class="py-3 px-4 text-left">ID</th>
          <th class="py-3 px-4 text-left">Title</th>
          <th class="py-3 px-4 text-left">Difficulty</th>
          <th class="py-3 px-4 text-left">Category</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="problem in filteredProblems" 
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
          <td class="py-3 px-4">{{ problem.category }}</td>
        </tr>
        <tr v-if="filteredProblems.length === 0">
          <td colspan="4" class="py-8 text-center text-gray-400">No problems found matching your filters</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>