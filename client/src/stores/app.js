import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    currentMode: 'flashcards', // 'flashcards' or 'quiz'
    questionType: 'multiple', // 'multiple' or 'typed'
    selectedTopic: 'all', // 'all' or specific topic slug
    topics: [
      { id: 1, name: 'Algebra', slug: 'algebra', difficulty: 'medium' },
      { id: 2, name: 'Trigonometry', slug: 'trigonometry', difficulty: 'medium' },
      { id: 3, name: 'Statistics', slug: 'statistics', difficulty: 'medium' }
    ]
  }),
  
  actions: {
    setCurrentMode(mode) {
      this.currentMode = mode
    },
    setQuestionType(type) {
      this.questionType = type
    },
    setSelectedTopic(topic) {
      this.selectedTopic = topic
    }
  }
})