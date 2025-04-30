<template>
  <v-app>
    <v-app-bar color="primary" dark app>
      <v-app-bar-title>Math Flashcards</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn to="/" text>Home</v-btn>
      <v-btn to="/flashcards" text>Flashcards</v-btn>
      <v-btn to="/quiz" text>Quiz</v-btn>
      <v-btn icon @click="toggleTheme">
        <v-icon>{{ isDarkMode ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </v-container>
    </v-main>

    <v-footer app color="primary" dark class="d-flex justify-center">
      <div>&copy; {{ new Date().getFullYear() }} - AI Math Learning for Kazakhstan</div>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useTheme } from 'vuetify'

const theme = useTheme()
const isDarkMode = ref(theme.global.current.value.dark)

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
  isDarkMode.value = !isDarkMode.value
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.flip-card {
  perspective: 1000px;
  height: 240px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
}

.flip-card-back {
  transform: rotateY(180deg);
}

.slide-in-enter-active {
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

.hint-box {
  background-color: #EFF6FF;
  border-radius: 8px;
  padding: 12px;
  margin-top: 16px;
  color: #1E40AF;
  animation: fade-in 0.3s ease-in-out;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>