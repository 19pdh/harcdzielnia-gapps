import { defineStore } from 'pinia'

const API_URL =
  'https://script.google.com/macros/s/AKfycbzkHXc1wa4QySAhhltyRa9QCMYcPjvu4EgQPNNov_hth5U3iiNyrFwhCwCQCTnfwPj6/exec'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    isLoading: false,
    categories: {}
  }),
  actions: {
    async getCategories() {
      try {
        this.isLoading = true
        const response = await fetch(API_URL)
        const actualData = await response.json()
        this.categories = actualData.reduce((acc, { name, link }) => {
          acc[name] = link
          return acc
        }, {})
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    }
  }
})
