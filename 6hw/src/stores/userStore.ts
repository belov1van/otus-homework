import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserStats {
  totalSolved: number
  easySolved: number
  mediumSolved: number
  hardSolved: number
  ranking: number
  streak: number
}

export interface SolvedProblem {
  id: number
  title: string
  difficulty: string
  solvedDate: string
}

export interface User {
  username: string
  joinDate: string
  stats: UserStats
  solvedProblems: SolvedProblem[]
}

export const useUserStore = defineStore('user', () => {
  // Состояние
  const user = ref<User>({
    username: 'JohnDoe',
    joinDate: '2023-01-01',
    stats: {
      totalSolved: 42,
      easySolved: 20,
      mediumSolved: 15,
      hardSolved: 7,
      ranking: 1024,
      streak: 5
    },
    solvedProblems: [
      { id: 1, title: 'Two Sum', difficulty: 'Easy', solvedDate: '2023-01-05' },
      { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', solvedDate: '2023-01-10' },
      { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', solvedDate: '2023-01-15' },
      { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', solvedDate: '2023-01-20' },
    ]
  })

  // Геттеры
  const isAuthenticated = computed(() => !!user.value.username)

  // Действия
  function updateUserStats(newStats: Partial<UserStats>) {
    user.value.stats = { ...user.value.stats, ...newStats }
  }

  function addSolvedProblem(problem: SolvedProblem) {
    // Проверяем, не решена ли задача уже
    const existingIndex = user.value.solvedProblems.findIndex(p => p.id === problem.id)
    if (existingIndex === -1) {
      user.value.solvedProblems.push(problem)
      
      // Обновляем статистику
      user.value.stats.totalSolved++
      if (problem.difficulty === 'Easy') {
        user.value.stats.easySolved++
      } else if (problem.difficulty === 'Medium') {
        user.value.stats.mediumSolved++
      } else if (problem.difficulty === 'Hard') {
        user.value.stats.hardSolved++
      }
    }
  }

  function login(username: string) {
    // В реальном приложении здесь была бы логика аутентификации
    user.value.username = username
  }

  function logout() {
    // Сбрасываем данные пользователя
    user.value = {
      username: '',
      joinDate: '',
      stats: {
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        ranking: 0,
        streak: 0
      },
      solvedProblems: []
    }
  }

  return {
    user,
    isAuthenticated,
    updateUserStats,
    addSolvedProblem,
    login,
    logout
  }
})