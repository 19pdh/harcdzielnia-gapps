<script setup>
import {computed, onMounted } from 'vue'
import { useCategoriesStore } from '../stores/categories.js'

const store = useCategoriesStore()

const categories = computed(() => store.categories)

onMounted(() => {
    store.getCategories()
})
</script>

<template>
    <ul v-if="!isLoading">
        <li v-for="category of categories" :key="category.name">
            <img :src="category.link" height="40">
            <span>{{ category.name }}</span>
        </li>
    </ul>
</template>

<style scoped>
li {
    list-style: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0.5em 0;
}

li span {
    margin-left: 1em;
}
</style>
