<script setup lang="ts">
defineProps<{
  stats: {
    totalSolved: number
    easySolved: number
    mediumSolved: number
    hardSolved: number
    ranking: number
    streak: number
  }
}>()
</script>

<template>
  <div class="bg-gray-800 rounded-lg p-6">
    <h2 class="text-xl font-semibold mb-4">Statistics</h2>
    
    <div class="grid grid-cols-2 gap-4">
      <div class="bg-gray-700 p-4 rounded-md text-center">
        <div class="text-2xl font-bold">{{ stats.totalSolved }}</div>
        <div class="text-sm text-gray-400">Problems Solved</div>
      </div>
      
      <div class="bg-gray-700 p-4 rounded-md text-center">
        <div class="text-2xl font-bold">{{ stats.ranking }}</div>
        <div class="text-sm text-gray-400">Ranking</div>
      </div>
      
      <div class="bg-gray-700 p-4 rounded-md text-center">
        <div class="text-2xl font-bold">{{ stats.streak }}</div>
        <div class="text-sm text-gray-400">Day Streak</div>
      </div>
    </div>
    
    <div class="mt-6">
      <h3 class="text-lg font-medium mb-3">Solved by Difficulty</h3>
      <div class="space-y-3">
        <div>
          <div class="flex justify-between mb-1">
            <span class="text-green-500">Easy</span>
            <span>{{ stats.easySolved }}</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2">
            <div 
              class="bg-green-500 h-2 rounded-full" 
              :style="{ width: `${(stats.easySolved / stats.totalSolved) * 100}%` }"
            ></div>
          </div>
        </div>
        
        <div>
          <div class="flex justify-between mb-1">
            <span class="text-yellow-500">Medium</span>
            <span>{{ stats.mediumSolved }}</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2">
            <div 
              class="bg-yellow-500 h-2 rounded-full" 
              :style="{ width: `${(stats.mediumSolved / stats.totalSolved) * 100}%` }"
            ></div>
          </div>
        </div>
        
        <div>
          <div class="flex justify-between mb-1">
            <span class="text-red-500">Hard</span>
            <span>{{ stats.hardSolved }}</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-2">
            <div 
              class="bg-red-500 h-2 rounded-full" 
              :style="{ width: `${(stats.hardSolved / stats.totalSolved) * 100}%` }"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>