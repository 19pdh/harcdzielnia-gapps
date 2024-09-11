<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useItemsStore } from '@/stores/items'

const route = useRoute()

const itemStore = useItemsStore()

const thisItem = computed(() => itemStore.items.filter(({ id }) => id == route.params.id)[0])

onMounted(() => itemStore.getItems())
</script>

<template>
  <RouterLink to="/">
    <img src="@/assets/back.png" height="20" width="20" />
    <span>Wróć</span></RouterLink
  >
  <div v-if="thisItem">
    <h1>{{ thisItem.name }}</h1>
    <img :src="thisItem.photo" width="100%" />
    <p>{{ thisItem.description }}</p>
    <p>{{ thisItem.contact }}</p>
  </div>
</template>

<style scoped>
a {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--fg);
}

a span {
  padding-left: 0.5em;
}
</style>
