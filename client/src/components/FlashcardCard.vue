<template>
  <div class="my-6">
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-body-2 text-grey">
        {{ (currentIndex % filteredCards.length) + 1 }} of {{ filteredCards.length }}
      </div>
      <v-chip color="primary" text-color="white">
        {{ currentTopicName }}
      </v-chip>
    </div>
    
    <div class="flip-card mb-4" :class="{ 'flipped': isFlipped }">
      <div class="flip-card-inner">
        <v-card class="flip-card-front d-flex align-center justify-center" min-height="240">
          <v-card-text class="text-center text-h5">
            {{ currentCard?.question }}
          </v-card-text>
        </v-card>
        
        <v-card class="flip-card-back d-flex flex-column align-center justify-center" min-height="240">
          <div class="text-grey text-body-1 mb-4">Answer</div>
          <div class="text-h5 text-center text-success">
            {{ currentCard?.answer }}
          </div>
          
          <div v-if="showHint" class="hint-box mt-4 w-100">
            <strong>Hint:</strong> {{ currentCard?.hint || "Try breaking down the problem into simpler steps." }}
          </div>
        </v-card>
      </div>
    </div>
    
    <div class="d-flex justify-space-between align-center">
      <v-btn color="grey-lighten-2" variant="outlined" @click="prevCard">
        Previous Card
      </v-btn>
      
      <v-btn color="grey-lighten-1" @click="flipCard">
        Flip Card
      </v-btn>
      
      <v-btn color="primary" @click="nextCard">
        Next Card
      </v-btn>
    </div>
    
    <div class="text-center mt-4">
      <v-btn variant="text" color="primary" size="small" @click="toggleHint">
        {{ showHint ? "Hide Hint" : "Hint" }}
      </v-btn>
    </div>
    
    <v-progress-linear
      v-model="progressPercentage"
      color="primary"
      height="8"
      rounded
      class="mt-6"
    ></v-progress-linear>
    <div class="text-caption text-grey text-center mt-1">
      {{ Math.round(progressPercentage) }}% complete
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useFlashcardsStore } from '../stores/flashcards'
import { storeToRefs } from 'pinia'

const flashcardsStore = useFlashcardsStore()
const { 
  currentCard, 
  currentIndex, 
  isFlipped, 
  showHint, 
  currentTopicName, 
  filteredFlashcards: filteredCards, 
  progressPercentage 
} = storeToRefs(flashcardsStore)

const { nextCard, prevCard, flipCard, toggleHint } = flashcardsStore
</script>