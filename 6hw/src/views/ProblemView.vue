<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ProblemDescription from '../components/ProblemDescription.vue'
import CodeEditor from '../components/CodeEditor.vue'
import CommentSection from '../components/CommentSection.vue'
import { useProblemStore } from '../stores/problemStore'
import { useCommentStore } from '../stores/commentStore'
import { useUserStore } from '../stores/userStore'

const route = useRoute()
const problemId = Number(route.params.id)

const problemStore = useProblemStore()
const commentStore = useCommentStore()
const userStore = useUserStore()

// Получаем задачу из хранилища
const problem = computed(() => {
  return problemStore.getProblemById(problemId) || {
    id: problemId,
    title: 'Loading...',
    difficulty: 'Unknown',
    category: 'Unknown',
    popularity: 0
  }
})

// Получаем комментарии для текущей задачи
const comments = computed(() => {
  return commentStore.getCommentsByProblemId(problemId)
})

// Обработчик отправки решения
const handleSubmit = (code: string) => {
  console.log('Submitting solution:', code)
  // Имитация успешного решения задачи
  if (userStore.isAuthenticated) {
    userStore.addSolvedProblem({
      id: problemId,
      title: problem.value.title,
      difficulty: problem.value.difficulty,
      solvedDate: new Date().toISOString().split('T')[0]
    })
  }
}

// Обработчик добавления комментария
const newComment = ref('')

const handleAddComment = () => {
  if (newComment.value.trim() && userStore.isAuthenticated) {
    commentStore.addComment({
      problemId,
      author: userStore.user.username,
      content: newComment.value.trim()
    })
    newComment.value = ''
  }
}

// Устаревший обработчик, оставлен для совместимости
const handleLegacyAddComment = (comment: string) => {
  // Используем новый метод из хранилища
  commentStore.addComment({
    problemId,
    author: userStore.user.username,
    content: comment
  })
}
</script>

<template>
  <div class="container mx-auto px-4 py-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Описание задачи -->
      <div class="lg:col-span-1">
        <ProblemDescription :problem="problem" />
      </div>
      
      <!-- Редактор кода -->
      <div class="lg:col-span-2">
        <CodeEditor 
          :starter-code="problem.starterCode || 'function solution() {\n  // Your code here\n}'" 
          @submit="handleSubmit" 
        />
      </div>
    </div>
    
    <!-- Секция комментариев -->
    <div class="mt-12">
      <h2 class="text-2xl font-bold mb-4">Комментарии</h2>
      
      <!-- Форма добавления комментария -->
      <div v-if="userStore.isAuthenticated" class="mb-6">
        <textarea 
          v-model="newComment" 
          class="w-full p-3 border rounded-md mb-2" 
          placeholder="Добавьте ваш комментарий..."
          rows="3"
        ></textarea>
        <button 
          @click="handleAddComment" 
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Отправить
        </button>
      </div>
      <div v-else class="mb-6 p-4 bg-gray-100 rounded-md">
        <p>Войдите в систему, чтобы оставить комментарий</p>
      </div>
      
      <!-- Список комментариев -->
      <CommentSection 
        :comments="comments" 
        @add-comment="handleLegacyAddComment" 
      />
    </div>
  </div>
</template>