<template>
  <div>
    <v-card class="mx-auto my-12" max-width="800">
      <v-img
        src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb"
        height="200px"
        cover
      ></v-img>
      
      <v-card-title class="text-h4 mt-4">Math Flashcards</v-card-title>
      <v-card-subtitle>Interactive Learning for Kazakhstan Students</v-card-subtitle>
      
      <v-card-text>
        <p class="text-body-1">
          Welcome to the interactive math flashcard application created for the AI hackathon in Kazakhstan.
          This application will help you master mathematical concepts through flashcards and quizzes.
        </p>
        
        <v-divider class="my-4"></v-divider>
        
        <h3 class="text-h6 mb-2">Choose Your Learning Mode:</h3>
        
        <v-row>
          <v-col cols="12" sm="6">
            <v-card variant="outlined" height="100%">
              <v-card-title>Flashcards</v-card-title>
              <v-card-text>
                <p>Review mathematical concepts with interactive flashcards. Flip the cards to see the answers and track your progress.</p>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" to="/flashcards" block>
                  Start Flashcards
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          
          <v-col cols="12" sm="6">
            <v-card variant="outlined" height="100%">
              <v-card-title>Quiz</v-card-title>
              <v-card-text>
                <p>Test your knowledge with multiple-choice or typed answer quizzes. Get immediate feedback and hints.</p>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" to="/quiz" block>
                  Start Quiz
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        
        <v-divider class="my-4"></v-divider>
        
        <h3 class="text-h6 mb-2">Available Topics:</h3>
        <v-chip-group>
          <v-chip
            v-for="topic in topics"
            :key="topic.slug"
            color="primary"
            filter
            variant="outlined"
          >
            {{ topic.name }}
          </v-chip>
        </v-chip-group>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { useAppStore } from '../stores/app'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const { topics } = storeToRefs(appStore)
</script>