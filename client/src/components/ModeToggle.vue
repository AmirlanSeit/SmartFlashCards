<template>
  <div class="my-4">
    <v-btn-toggle
      v-model="currentModeModel"
      color="primary"
      group
      mandatory
    >
      <v-btn 
        value="flashcards"
        prepend-icon="mdi-card-text-outline"
      >
        Flashcards
      </v-btn>
      <v-btn 
        value="quiz"
        prepend-icon="mdi-help-circle-outline"
      >
        Quiz
      </v-btn>
    </v-btn-toggle>
    
    <v-btn-toggle
      v-if="currentMode === 'quiz'"
      v-model="questionTypeModel"
      color="primary"
      group
      mandatory
      class="ml-4"
    >
      <v-btn value="multiple">
        Multiple Choice
      </v-btn>
      <v-btn value="typed">
        Type Answer
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/app'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const { currentMode, questionType } = storeToRefs(appStore)
const { setCurrentMode, setQuestionType } = appStore

const currentModeModel = computed({
  get: () => currentMode.value,
  set: (value) => setCurrentMode(value)
})

const questionTypeModel = computed({
  get: () => questionType.value,
  set: (value) => setQuestionType(value)
})
</script>