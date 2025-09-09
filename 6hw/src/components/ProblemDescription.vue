<script setup lang="ts">
defineProps<{
  problem: {
    id: number
    title: string
    difficulty: string
    description: string
    examples: Array<{
      input: string
      output: string
      explanation?: string
    }>
    constraints: string[]
  }
}>()

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
  <div class="bg-gray-800 rounded-lg p-6 h-full overflow-y-auto">
    <div class="flex justify-between items-center mb-4">
      <h1 class="text-2xl font-bold">{{ problem.id }}. {{ problem.title }}</h1>
      <span :class="getDifficultyClass(problem.difficulty)" class="font-medium">
        {{ problem.difficulty }}
      </span>
    </div>
    
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Description</h2>
      <p class="text-gray-300">{{ problem.description }}</p>
    </div>
    
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-2">Examples</h2>
      <div v-for="(example, index) in problem.examples" :key="index" class="mb-4 bg-gray-700 p-4 rounded">
        <div class="mb-2">
          <span class="font-medium">Input:</span> 
          <code class="bg-gray-900 px-2 py-1 rounded ml-2">{{ example.input }}</code>
        </div>
        <div class="mb-2">
          <span class="font-medium">Output:</span> 
          <code class="bg-gray-900 px-2 py-1 rounded ml-2">{{ example.output }}</code>
        </div>
        <div v-if="example.explanation">
          <span class="font-medium">Explanation:</span> 
          <p class="text-gray-300 mt-1">{{ example.explanation }}</p>
        </div>
      </div>
    </div>
    
    <div>
      <h2 class="text-xl font-semibold mb-2">Constraints</h2>
      <ul class="list-disc list-inside text-gray-300">
        <li v-for="(constraint, index) in problem.constraints" :key="index" class="mb-1">
          {{ constraint }}
        </li>
      </ul>
    </div>
  </div>
</template>