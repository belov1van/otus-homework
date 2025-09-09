<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  starterCode: string
}>()

const emit = defineEmits<{
  (e: 'submit', code: string): void
}>()

const code = ref(props.starterCode)
const output = ref('')
const isRunning = ref(false)

// Запуск кода
const runCode = () => {
  isRunning.value = true
  output.value = 'Running code...'
  
  // Имитация выполнения кода
  setTimeout(() => {
    output.value = 'Output: [0, 1]\nTest cases passed: 2/2'
    isRunning.value = false
  }, 1000)
}

// Отправка решения
const submitSolution = () => {
  isRunning.value = true
  output.value = 'Submitting solution...'
  
  // Имитация отправки решения
  setTimeout(() => {
    output.value = 'Solution accepted!\nRuntime: 76 ms\nMemory: 42.5 MB'
    isRunning.value = false
    emit('submit', code.value)
  }, 1500)
}
</script>

<template>
  <div class="bg-gray-800 rounded-lg p-6 h-full flex flex-col">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-semibold">Code Editor</h2>
      <div class="space-x-2">
        <button 
          @click="runCode" 
          :disabled="isRunning"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Run
        </button>
        <button 
          @click="submitSolution" 
          :disabled="isRunning"
          class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </div>
    
    <!-- Редактор кода -->
    <div class="flex-grow mb-4">
      <textarea
        v-model="code"
        class="w-full h-full min-h-[300px] bg-gray-900 text-gray-200 p-4 rounded-md font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
    </div>
    
    <!-- Вывод результатов -->
    <div class="bg-gray-900 p-4 rounded-md">
      <h3 class="text-lg font-medium mb-2">Output</h3>
      <pre class="text-gray-300 font-mono whitespace-pre-wrap">{{ output || 'Run your code to see output' }}</pre>
    </div>
  </div>
</template>