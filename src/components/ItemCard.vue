<script setup>
defineProps({
  id: Number,
  name: String,
  image: String,
  category: String
})
</script>

<template>
  <div class="item">
    <a :href="`item/${id}`">
      <img height="300" :src="image" />
      <div class="name">
        <img :src="category" class="icon" />
        <p>{{ name }}</p>
      </div>
    </a>
  </div>
</template>

<style scoped>
.item {
  box-sizing: border-box;
  border: 5px solid var(--fg);
  border-radius: 15px;
  padding: 5px;
  margin: 7px;
  width: 100%;
  max-width: 300px;
  max-height: 400px;
}

.item a {
  display: grid;
  grid-template-rows: 2fr 75px;
}

.item img,
.name img {
  margin: 0;
  border-radius: 10px;
  object-fit: cover;
  max-height: 300px;
}

.item img {
  width: 100%;
}

.item .name {
  display: grid;
  grid-template-columns: 50px auto;
  grid-template-rows: 1fr;
  align-items: center;
}
</style>
