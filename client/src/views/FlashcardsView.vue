<template>
  <div>
    <h1 class="text-h4 mb-4">Math Flashcards</h1>
    
    <TopicSelector />
    
    <FlashcardCard />
    
    <v-divider class="my-6"></v-divider>
    
    <v-btn color="primary" to="/" prepend-icon="mdi-home">
      Back to Home
    </v-btn>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAppStore } from '../stores/app'
import TopicSelector from '../components/TopicSelector.vue'
import FlashcardCard from '../components/FlashcardCard.vue'

const appStore = useAppStore()

onMounted(() => {
  appStore.setCurrentMode('flashcards')
})
</script>