import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface Comment {
  id: number
  problemId: number
  author: string
  content: string
  timestamp: string
}

export const useCommentStore = defineStore('comments', () => {
  // Состояние
  const comments = ref<Comment[]>([
    { id: 1, problemId: 1, author: 'user1', content: 'Great problem!', timestamp: '2023-01-01' },
    { id: 2, problemId: 1, author: 'user2', content: 'I solved it using a hash map.', timestamp: '2023-01-02' },
    { id: 3, problemId: 2, author: 'user3', content: 'This was challenging!', timestamp: '2023-01-03' },
  ])

  // Геттеры
  function getCommentsByProblemId(problemId: number) {
    return comments.value.filter(comment => comment.problemId === problemId)
  }

  // Действия
  function addComment(comment: Omit<Comment, 'id' | 'timestamp'>) {
    const newComment: Comment = {
      id: Math.max(0, ...comments.value.map(c => c.id)) + 1,
      ...comment,
      timestamp: new Date().toISOString().split('T')[0] // Формат YYYY-MM-DD
    }
    
    comments.value.push(newComment)
    return newComment
  }

  function deleteComment(id: number) {
    const index = comments.value.findIndex(comment => comment.id === id)
    if (index !== -1) {
      comments.value.splice(index, 1)
      return true
    }
    return false
  }

  return {
    comments,
    getCommentsByProblemId,
    addComment,
    deleteComment
  }
})