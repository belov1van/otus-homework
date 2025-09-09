<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProblemDescription from '../components/ProblemDescription.vue'
import CodeEditor from '../components/CodeEditor.vue'
import CommentSection from '../components/CommentSection.vue'

const route = useRoute()
const problemId = route.params.id

// Временные данные для демонстрации
const problem = ref({
  id: Number(problemId),
  title: 'Two Sum',
  difficulty: 'Easy',
  description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
  examples: [
    {
      input: 'nums = [2,7,11,15], target = 9',
      output: '[0,1]',
      explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
    },
    {
      input: 'nums = [3,2,4], target = 6',
      output: '[1,2]',
      explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].'
    }
  ],
  constraints: [
    '2 <= nums.length <= 10^4',
    '-10^9 <= nums[i] <= 10^9',
    '-10^9 <= target <= 10^9',
    'Only one valid answer exists.'
  ],
  starterCode: 'function twoSum(nums, target) {\n    // Your code here\n}'
})

// Временные данные для комментариев
const comments = ref([
  { id: 1, author: 'user1', content: 'Great problem!', timestamp: '2023-01-01' },
  { id: 2, author: 'user2', content: 'I solved it using a hash map.', timestamp: '2023-01-02' }
])

// Обработчик отправки решения
const handleSubmit = (code: string) => {
  console.log('Submitting solution:', code)
  // Здесь будет логика отправки решения на сервер
}

// Обработчик добавления комментария
const handleAddComment = (comment: string) => {
  comments.value.push({
    id: comments.value.length + 1,
    author: 'currentUser',
    content: comment,
    timestamp: new Date().toISOString().split('T')[0]
  })
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Левая колонка: описание задачи -->
      <ProblemDescription :problem="problem" />
      
      <!-- Правая колонка: редактор кода -->
      <CodeEditor 
        :starter-code="problem.starterCode" 
        @submit="handleSubmit" 
      />
    </div>
    
    <!-- Секция комментариев -->
    <div class="mt-12">
      <CommentSection 
        :comments="comments" 
        @add-comment="handleAddComment" 
      />
    </div>
  </div>
</template>