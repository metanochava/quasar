import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    count: 0,
    Users: [2,3],
    User: {nome: 'Metano'},
    Sucursals: [2,3],
    Sucursals: {nome: 'Metano'},
    Entidades: [2,3],
    Entidade: {nome: 'Metano'}
  }),
  actions: {
    increment() {
      this.count++
    },
    reset() {
      this.count = 0
    }
  }
})
