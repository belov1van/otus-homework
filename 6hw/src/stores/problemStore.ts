import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Problem {
  id: number
  title: string
  difficulty: string
  category: string
  popularity: number
  description?: string
  examples?: Array<{
    input: string
    output: string
    explanation: string
  }>
  constraints?: string[]
  starterCode?: string
}

export interface ProblemFilters {
  difficulty: string
  category: string
  sortBy: string
}

export const useProblemStore = defineStore('problems', () => {
  // Состояние
  const problems = ref<Problem[]>([
    { id: 1, title: 'Two Sum', difficulty: 'Easy', category: 'Array', popularity: 100,
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
    },
    { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', category: 'Linked List', popularity: 90 },
    { id: 3, title: 'Longest Substring Without Repeating Characters', difficulty: 'Medium', category: 'String', popularity: 85 },
    { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', category: 'Array', popularity: 70 },
    { id: 5, title: 'Longest Palindromic Substring', difficulty: 'Medium', category: 'String', popularity: 75 },
  ])

  const filters = ref<ProblemFilters>({
    difficulty: '',
    category: '',
    sortBy: 'popularity'
  })

  // Геттеры
  const filteredProblems = computed(() => {
    let result = [...problems.value]
    
    // Фильтрация по сложности
    if (filters.value.difficulty) {
      result = result.filter(problem => problem.difficulty === filters.value.difficulty)
    }
    
    // Фильтрация по категории
    if (filters.value.category) {
      result = result.filter(problem => problem.category === filters.value.category)
    }
    
    // Сортировка
    if (filters.value.sortBy === 'popularity') {
      result.sort((a, b) => b.popularity - a.popularity)
    }
    
    return result
  })

  const getProblemById = (id: number) => {
    return problems.value.find(problem => problem.id === id)
  }

  // Действия
  function updateFilters(newFilters: Partial<ProblemFilters>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function addProblem(problem: Problem) {
    problems.value.push(problem)
  }

  return {
    problems,
    filters,
    filteredProblems,
    getProblemById,
    updateFilters,
    addProblem
  }
})