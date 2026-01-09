import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    Settings: { layout: 'main' } 
  }),
  actions: {
    increment() {
      this.count++
    },
  }
})
