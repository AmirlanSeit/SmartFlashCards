import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#3B82F6',
          secondary: '#10B981',
          accent: '#8B5CF6',
          error: '#EF4444',
          info: '#3ABFF8',
          success: '#36D399',
          warning: '#FBBD23',
        },
      },
      dark: {
        colors: {
          primary: '#3B82F6',
          secondary: '#10B981',
          accent: '#8B5CF6',
          error: '#EF4444',
          info: '#3ABFF8',
          success: '#36D399',
          warning: '#FBBD23',
        },
      },
    },
  },
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')