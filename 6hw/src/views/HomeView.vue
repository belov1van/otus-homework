<script setup lang="ts">
import { ref } from 'vue'
import ProblemList from '../components/ProblemList.vue'
import FilterPanel from '../components/FilterPanel.vue'

// Временные данные для демонстрации
const problems = ref([
  { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Array', popularity: 100 },
  { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', category: 'Linked List', popularity: 90 },
  { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', category: 'String', popularity: 85 },
  { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', category: 'Array', popularity: 70 },
  { id: 5, title: 'Longest Palindromic Substring', difficulty: 'Medium', category: 'String', popularity: 75 },
])

// Фильтры
const filters = ref({
  difficulty: '',
  category: '',
  sortBy: 'popularity'
})

// Обработчик изменения фильтров
const handleFilterChange = (newFilters: any) => {
  filters.value = { ...filters.value, ...newFilters }
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Coding Challenges</h1>
    
    <FilterPanel @filter-change="handleFilterChange" />
    
    <ProblemList :problems="problems" :filters="filters" />
  </div>
</template>