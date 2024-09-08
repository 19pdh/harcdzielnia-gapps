<script setup>
import ItemCard from '@/components/ItemCard.vue';
import CategoryList from '@/components/CategoryList.vue'


import { useItemsStore } from '@/stores/items';
import { ref, computed, onMounted } from 'vue';
import { useCategoriesStore } from '@/stores/categories';

function getImageLink(driveLink) {
  const regex = /id=([^&]*)/
  const match = driveLink.match(regex)
  if (match.length == 2) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`
  }
  throw new Error(`Could not extract ID from Google Drive link: ${driveLink}`)
}

const category = ref("@")

const setCategory = (cat) => {
  category.value = cat
}

const store = useItemsStore();
const categoryStore = useCategoriesStore()

const categories = computed(() => categoryStore.categories)

const filteredItems = computed(() => store.items.filter(el => {
  if (category.value == "@") {
    return true
  }
  return el.category == category.value
}))

onMounted(() => store.getItems())

</script>

<template>
        <CategoryList :category="category" @set-category="setCategory"/>

<div class="container">
<ItemCard 
  v-for="item of filteredItems"
  :key="item.timestamp"
  :name="item.name" 
  :image="getImageLink(item.photo)"
  :category="categories[item.category]"
/>
</div>

</template>