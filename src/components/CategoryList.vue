<script setup>
defineProps({
  category: String
})

const emit = defineEmits(['setCategory'])

const setCategory = (name) => emit('setCategory', name)

import { computed, onMounted } from 'vue'
import { useCategoriesStore } from '../stores/categories.js'

const store = useCategoriesStore()

const categories = computed(() => store.categories)
const isLoading = computed(() => store.isLoading)

onMounted(() => {
  store.getCategories()
})
</script>

<template>
  <div class="filtering">
    <aside>
      <div v-if="!isLoading">
        <strong>Kategorie</strong>
        <button
          v-for="[name, link] in Object.entries(categories)"
          :key="name"
          :class="name == category ? 'active' : ''"
          @click="setCategory(name)"
        >
          <img :src="link" height="40" />
          <span>{{ name == '@' ? 'Wszystko' : name }}</span>
        </button>
      </div>
    </aside>
  </div>
</template>

<style scoped>
button {
  list-style: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0.1em 0;
  padding: 0.4em;
  border-radius: 10px;
  border-width: 0;
  width: 100%;
  background: none;
  font-family: inherit;
  cursor: pointer;
}

button span {
  margin-left: 1em;
}

button.active {
  background-color: var(--sec);
}

button:hover {
  background-color: var(--tre);
}

@media screen and (min-width: 1200px) {
  div.filtering {
    position: sticky;
    top: 1em;
  }
  aside {
    position: absolute;
    right: 100%;
    width: 250px;
  }
}
</style>
