<template>
  <div class="my-4">
    <v-chip-group
      v-model="selectedTopicModel"
      column
      mandatory
    >
      <v-chip
        value="all"
        filter
        :variant="selectedTopic === 'all' ? 'elevated' : 'outlined'"
        :color="selectedTopic === 'all' ? 'primary' : undefined"
        @click="setSelectedTopic('all')"
      >
        All Topics
      </v-chip>
      
      <v-chip
        v-for="topic in topics"
        :key="topic.slug"
        :value="topic.slug"
        filter
        :variant="selectedTopic === topic.slug ? 'elevated' : 'outlined'"
        :color="selectedTopic === topic.slug ? 'primary' : undefined"
        @click="setSelectedTopic(topic.slug)"
      >
        {{ topic.name }}
      </v-chip>
    </v-chip-group>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../stores/app'
import { storeToRefs } from 'pinia'

const appStore = useAppStore()
const { selectedTopic, topics } = storeToRefs(appStore)
const { setSelectedTopic } = appStore

const selectedTopicModel = computed({
  get: () => selectedTopic.value,
  set: (value) => setSelectedTopic(value)
})
</script>