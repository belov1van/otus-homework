<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'filter-change', filters: any): void
}>()

// Состояние фильтров
const difficulty = ref('')
const category = ref('')
const sortBy = ref('popularity')

// Доступные опции для фильтров
const difficulties = ['Easy', 'Medium', 'Hard']
const categories = ['Array', 'String', 'Linked List', 'Tree', 'Dynamic Programming']
const sortOptions = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' }
]

// Обработчик изменения фильтров
const handleFilterChange = () => {
  emit('filter-change', {
    difficulty: difficulty.value,
    category: category.value,
    sortBy: sortBy.value
  })
}
</script>

<template>
  <div class="bg-gray-800 p-4 rounded-lg mb-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Фильтр по сложности -->
      <div>
        <label class="block text-sm font-medium mb-2">Difficulty</label>
        <select
          v-model="difficulty"
          @change="handleFilterChange"
          class="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Difficulties</option>
          <option v-for="option in difficulties" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
      
      <!-- Фильтр по категории -->
      <div>
        <label class="block text-sm font-medium mb-2">Category</label>
        <select
          v-model="category"
          @change="handleFilterChange"
          class="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          <option v-for="option in categories" :key="option" :value="option">
            {{ option }}
          </option>
        </select>
      </div>
      
      <!-- Сортировка -->
      <div>
        <label class="block text-sm font-medium mb-2">Sort By</label>
        <select
          v-model="sortBy"
          @change="handleFilterChange"
          class="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="option in sortOptions" :key="option.value" :value="option.value">
            {{ option.label }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>