<script setup lang="ts">
import ProblemList from '../components/ProblemList.vue'
import FilterPanel from '../components/FilterPanel.vue'
import { useProblemStore } from '../stores/problemStore'

const problemStore = useProblemStore()

// Обработчик изменения фильтров
const handleFilterChange = (newFilters: any) => {
  problemStore.updateFilters(newFilters)
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">Coding Challenges</h1>
    
    <FilterPanel @filter-change="handleFilterChange" />
    
    <ProblemList :problems="problemStore.filteredProblems" :filters="problemStore.filters" />
  </div>
</template>