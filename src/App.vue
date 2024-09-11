<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <header>
    <img src="@/assets/logo-light.svg" width="267" height="167" alt="" />
    <div>
      <h1 style="margin-bottom: 0">Harcdzielnia</h1>
      <p style="margin-top: 0; text-align: center">Drugie życie mundurów</p>
    </div>
  </header>
  <main>
    <RouterView />
  </main>
</template>

<style></style>
