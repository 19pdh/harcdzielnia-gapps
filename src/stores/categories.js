import { defineStore } from 'pinia'

const categoriesFiles = import.meta.glob('/public/categories/*.png', { eager: true })

const customCategories = Object.entries(categoriesFiles).map(([path, _]) => {
  const name = path.split('/').pop().split('.')[0]
  return { name, link: path.replace('public/', '') }
})

const categories = [
  { name: 'Wszystko', link: new URL('@/assets/all.png', import.meta.url) },
  ...customCategories,
  { name: 'Inne', link: new URL('@/assets/other.png', import.meta.url) }
]

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories,
    customCategories
  })
})
