import { defineStore } from 'pinia'
import { useAppStore } from './app'

export const useFlashcardsStore = defineStore('flashcards', {
  state: () => ({
    flashcards: [
      { 
        id: 1, 
        question: "Solve 2x+3=7. x=?", 
        answer: "2", 
        topicId: 1, 
        difficulty: "easy",
        hint: "Subtract 3 from both sides, then divide by 2."
      },
      { 
        id: 2, 
        question: "Solve x²-9=0. x=?", 
        answer: "±3", 
        topicId: 1, 
        difficulty: "medium",
        hint: "Factor the equation as (x+3)(x-3)=0."
      },
      { 
        id: 3, 
        question: "What is sin(30°)?", 
        answer: "1/2", 
        topicId: 2, 
        difficulty: "easy",
        hint: "In a 30-60-90 triangle, the side opposite to the 30° angle is half the hypotenuse."
      },
      { 
        id: 4, 
        question: "What is cos(60°)?", 
        answer: "1/2", 
        topicId: 2, 
        difficulty: "easy",
        hint: "In a 30-60-90 triangle, the adjacent side to the 60° angle is half the hypotenuse."
      },
      { 
        id: 5, 
        question: "Mean of [2,4,6,8] is?", 
        answer: "5", 
        topicId: 3, 
        difficulty: "easy",
        hint: "Add all numbers and divide by the count of numbers."
      },
      { 
        id: 6, 
        question: "Median of [1,3,5,7,9] is?", 
        answer: "5", 
        topicId: 3, 
        difficulty: "easy",
        hint: "The median is the middle value in an ordered list of numbers."
      }
    ],
    currentIndex: 0,
    isFlipped: false,
    showHint: false
  }),
  
  getters: {
    filteredFlashcards() {
      const appStore = useAppStore()
      if (appStore.selectedTopic === 'all') {
        return this.flashcards
      }
      
      const selectedTopicId = appStore.topics.find(t => t.slug === appStore.selectedTopic)?.id
      return this.flashcards.filter(card => card.topicId === selectedTopicId)
    },
    
    currentCard() {
      const cards = this.filteredFlashcards
      if (cards.length === 0) return null
      return cards[this.currentIndex % cards.length]
    },
    
    currentTopicName() {
      const appStore = useAppStore()
      if (appStore.selectedTopic === 'all') {
        return 'All Topics'
      }
      return appStore.topics.find(t => t.slug === appStore.selectedTopic)?.name || 'Unknown'
    },
    
    progressPercentage() {
      const cards = this.filteredFlashcards
      if (cards.length === 0) return 0
      return ((this.currentIndex % cards.length) + 1) / cards.length * 100
    }
  },
  
  actions: {
    nextCard() {
      this.isFlipped = false
      this.showHint = false
      this.currentIndex++
    },
    
    prevCard() {
      this.isFlipped = false
      this.showHint = false
      if (this.currentIndex > 0) {
        this.currentIndex--
      } else {
        const cards = this.filteredFlashcards
        this.currentIndex = cards.length - 1
      }
    },
    
    flipCard() {
      this.isFlipped = !this.isFlipped
    },
    
    toggleHint() {
      this.showHint = !this.showHint
    }
  }
})