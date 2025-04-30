<template>
  <div class="my-6">
    <div class="d-flex justify-space-between align-center mb-4">
      <div class="text-body-2 text-grey">
        {{ (currentIndex % filteredQuestions.length) + 1 }} of {{ filteredQuestions.length }}
      </div>
      <v-chip color="primary" text-color="white">
        {{ currentTopicName }}
      </v-chip>
    </div>
    
    <v-card class="mb-4 animate-slide-in">
      <v-card-text>
        <div class="text-grey text-body-1 mb-4">Question:</div>
        <div class="text-h5 text-center mb-8">
          {{ currentQuestion?.question }}
        </div>
        
        <!-- Multiple Choice Options -->
        <div v-if="questionType === 'multiple'" class="d-flex flex-column gap-3">
          <v-btn
            v-for="option in currentQuestion?.options"
            :key="option.id"
            variant="outlined"
            :color="getOptionColor(option)"
            block
            class="text-left pa-3"
            @click="selectOption(option.id)"
            :disabled="selectedOption !== null"
          >
            <div class="d-flex align-center">
              <span class="font-weight-medium mr-3">{{ option.id }}</span>
              <span>{{ option.text }}</span>
            </div>
          </v-btn>
        </div>
        
        <!-- Type Answer Input -->
        <div v-if="questionType === 'typed'">
          <v-form @submit.prevent="submitTypedAnswer">
            <v-text-field
              v-model="userAnswer"
              label="Type your answer here..."
              :color="getAnswerColor()"
              :disabled="showAnswer"
            ></v-text-field>
            
            <div v-if="showAnswer && userAnswer.toLowerCase() !== currentQuestion?.correctAnswer.toLowerCase()" class="text-center text-body-2 my-2">
              Correct answer: <span class="font-weight-bold">{{ currentQuestion?.correctAnswer }}</span>
            </div>
            
            <v-btn
              type="submit"
              color="primary"
              block
              :disabled="showAnswer || !userAnswer"
            >
              Submit Answer
            </v-btn>
          </v-form>
        </div>
        
        <!-- Hint box -->
        <div v-if="showHint" class="hint-box mt-4">
          <strong>Hint:</strong> {{ currentQuestion?.hint || "Try breaking down the problem into simpler steps." }}
        </div>
      </v-card-text>
    </v-card>
    
    <div class="d-flex justify-space-between align-center">
      <v-btn color="grey-lighten-2" variant="outlined" @click="toggleHint">
        {{ showHint ? "Hide Hint" : "Hint" }}
      </v-btn>
      
      <v-btn color="primary" @click="nextQuestion">
        Next Question
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
import { useQuizStore } from '../stores/quiz'
import { useAppStore } from '../stores/app'
import { storeToRefs } from 'pinia'

const quizStore = useQuizStore()
const appStore = useAppStore()

const { questionType } = storeToRefs(appStore)
const { 
  currentQuestion,
  currentIndex,
  selectedOption,
  userAnswer,
  showAnswer,
  showHint,
  currentTopicName,
  filteredQuestions,
  progressPercentage
} = storeToRefs(quizStore)

const { nextQuestion, selectOption, submitTypedAnswer, toggleHint } = quizStore

function getOptionColor(option) {
  if (selectedOption.value === null) return 'grey-lighten-2'
  
  if (option.id === selectedOption.value) {
    return option.correct ? 'success' : 'error'
  }
  
  if (option.correct && selectedOption.value !== null) {
    return 'success'
  }
  
  return 'grey-lighten-2'
}

function getAnswerColor() {
  if (!showAnswer.value) return 'primary'
  
  return userAnswer.value.toLowerCase() === currentQuestion.value?.correctAnswer.toLowerCase()
    ? 'success'
    : 'error'
}
</script>

<style scoped>
.animate-slide-in {
  animation: slide-in 0.4s ease-out;
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>