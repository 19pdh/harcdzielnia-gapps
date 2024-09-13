<template>
  <div class="add-item">
    <div class="add-item-button">
      <a
        href="https://docs.google.com/forms/d/e/1FAIpQLSelaJDsMnUEU4GJ2W-RYuMRtKizXkiReLtFx1wb4A3XVwYUrg/viewform"
      >
        <img src="@/assets/add.png" width="50" height="50" />
        <span>Chcę oddać mundur!</span>
      </a>
    </div>
  </div>
</template>

<style scoped>
div.add-item {
  display: flex;
  flex-direction: row;
  justify-content: center;
}

div.add-item-button {
  background-color: var(--tre);
  padding: 0.5ex;
  margin: 1.5em 0;
  border-radius: 1ex;
  border: 4px solid var(--fg);
}

a {
  display: grid;
  grid-template-columns: 1fr 3fr;
  text-decoration: none;
  color: var(--fg);
}

a * {
  padding: 0.5ex;
  margin: auto;
}
</style>
