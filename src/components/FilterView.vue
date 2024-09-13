<script setup>
import ItemCard from '@/components/ItemCard.vue'
import CategoryList from '@/components/CategoryList.vue'

import { useItemsStore } from '@/stores/items'
import { ref, computed, onMounted } from 'vue'
import { useCategoriesStore } from '@/stores/categories'

const category = ref('@')

const setCategory = (cat) => {
  category.value = cat
}

const store = useItemsStore()
const categoryStore = useCategoriesStore()

const categories = computed(() => categoryStore.categories)

const isLoading = computed(() => store.isLoading)

const filteredItems = computed(() =>
  store.items.filter((el) => {
    if (category.value == '@') {
      return true
    }
    return el.category == category.value
  })
)

onMounted(() => store.getItems())
</script>

<template>
  <h2>Lista umundurowania</h2>
  <CategoryList :category="category" @set-category="setCategory" />

  <div v-if="filteredItems.length != 0" class="container">
    <ItemCard
      v-for="item of filteredItems"
      :key="item.timestamp"
      :name="item.name"
      :id="item.id"
      :image="item.photo"
      :category="categories[item.category]"
    />
  </div>
  <div class="container" v-else-if="isLoading"><span>Ładowanie...</span></div>
  <div class="container" v-else><span>Tutaj jeszcze nic nie ma...</span></div>
</template>
