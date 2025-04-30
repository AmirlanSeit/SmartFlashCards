import { defineStore } from 'pinia'
import { useAppStore } from './app'

export const useQuizStore = defineStore('quiz', {
  state: () => ({
    quizQuestions: [
      {
        id: 1,
        question: "What is sin(30°)?",
        correctAnswer: "1/2",
        options: [
          { id: "A", text: "1/2", correct: true },
          { id: "B", text: "√2/2", correct: false },
          { id: "C", text: "√3/2", correct: false },
          { id: "D", text: "1", correct: false }
        ],
        topicId: 2,
        difficulty: "easy",
        hint: "In a 30-60-90 triangle, the side opposite to the 30° angle is half the hypotenuse."
      },
      {
        id: 2,
        question: "Solve 2x+3=7. x=?",
        correctAnswer: "2",
        options: [
          { id: "A", text: "1", correct: false },
          { id: "B", text: "2", correct: true },
          { id: "C", text: "3", correct: false },
          { id: "D", text: "4", correct: false }
        ],
        topicId: 1,
        difficulty: "easy",
        hint: "Subtract 3 from both sides, then divide by 2."
      },
      {
        id: 3,
        question: "Mean of [2,4,6,8] is?",
        correctAnswer: "5",
        options: [
          { id: "A", text: "4", correct: false },
          { id: "B", text: "5", correct: true },
          { id: "C", text: "6", correct: false },
          { id: "D", text: "7", correct: false }
        ],
        topicId: 3,
        difficulty: "easy",
        hint: "Add all numbers and divide by the count of numbers."
      }
    ],
    currentIndex: 0,
    selectedOption: null,
    userAnswer: '',
    showAnswer: false,
    showHint: false
  }),
  
  getters: {
    filteredQuestions() {
      const appStore = useAppStore()
      if (appStore.selectedTopic === 'all') {
        return this.quizQuestions
      }
      
      const selectedTopicId = appStore.topics.find(t => t.slug === appStore.selectedTopic)?.id
      return this.quizQuestions.filter(question => question.topicId === selectedTopicId)
    },
    
    currentQuestion() {
      const questions = this.filteredQuestions
      if (questions.length === 0) return null
      return questions[this.currentIndex % questions.length]
    },
    
    currentTopicName() {
      const appStore = useAppStore()
      if (appStore.selectedTopic === 'all') {
        return 'All Topics'
      }
      return appStore.topics.find(t => t.slug === appStore.selectedTopic)?.name || 'Unknown'
    },
    
    progressPercentage() {
      const questions = this.filteredQuestions
      if (questions.length === 0) return 0
      return ((this.currentIndex % questions.length) + 1) / questions.length * 100
    }
  },
  
  actions: {
    nextQuestion() {
      this.selectedOption = null
      this.userAnswer = ''
      this.showAnswer = false
      this.showHint = false
      this.currentIndex++
    },
    
    selectOption(optionId) {
      this.selectedOption = optionId
    },
    
    submitTypedAnswer() {
      this.showAnswer = true
    },
    
    toggleHint() {
      this.showHint = !this.showHint
    }
  }
})