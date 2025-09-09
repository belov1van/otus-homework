<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  comments: Array<{
    id: number
    author: string
    content: string
    timestamp: string
  }>
}>()

const emit = defineEmits<{
  (e: 'add-comment', content: string): void
}>()

const newComment = ref('')

// Отправка нового комментария
const submitComment = () => {
  if (newComment.value.trim()) {
    emit('add-comment', newComment.value)
    newComment.value = ''
  }
}
</script>

<template>
  <div class="bg-gray-800 rounded-lg p-6">
    <h2 class="text-xl font-semibold mb-4">Discussion</h2>
    
    <!-- Список комментариев -->
    <div class="space-y-4 mb-6">
      <div 
        v-for="comment in comments" 
        :key="comment.id"
        class="bg-gray-700 p-4 rounded-md"
      >
        <div class="flex justify-between items-center mb-2">
          <span class="font-medium">{{ comment.author }}</span>
          <span class="text-sm text-gray-400">{{ comment.timestamp }}</span>
        </div>
        <p class="text-gray-300">{{ comment.content }}</p>
      </div>
      
      <div v-if="comments.length === 0" class="text-center text-gray-400 py-4">
        No comments yet. Be the first to comment!
      </div>
    </div>
    
    <!-- Форма добавления комментария -->
    <div>
      <textarea
        v-model="newComment"
        placeholder="Add your comment..."
        class="w-full bg-gray-700 border border-gray-600 rounded-md p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none min-h-[100px]"
      ></textarea>
      <button 
        @click="submitComment"
        :disabled="!newComment.trim()"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Post Comment
      </button>
    </div>
  </div>
</template>