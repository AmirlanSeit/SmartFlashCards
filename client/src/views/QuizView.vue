<template>
  <div>
    <h1 class="text-h4 mb-4">Math Quiz</h1>
    
    <v-btn-toggle
      v-model="questionTypeModel"
      color="primary"
      group
      mandatory
      class="mb-4"
    >
      <v-btn value="multiple">
        Multiple Choice
      </v-btn>
      <v-btn value="typed">
        Type Answer
      </v-btn>
    </v-btn-toggle>
    
    <TopicSelector />
    
    <QuizCard />
    
    <v-divider class="my-6"></v-divider>
    
    <v-btn color="primary" to="/" prepend-icon="mdi-home">
      Back to Home
    </v-btn>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAppStore } from '../stores/app'
import TopicSelector from '../components/TopicSelector.vue'
import QuizCard from '../components/QuizCard.vue'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const { questionType } = storeToRefs(appStore)
const { setCurrentMode, setQuestionType } = appStore

const questionTypeModel = computed({
  get: () => questionType.value,
  set: (value) => setQuestionType(value)
})

onMounted(() => {
  appStore.setCurrentMode('quiz')
})
</script>