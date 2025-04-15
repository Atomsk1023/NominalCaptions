<!-- src/App.vue -->
<template>
  <div id="app" v-if="isAuthReady">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
  </div>
  <div v-else>Loading...</div>
</template>

<script>
import AppHeader from "./components/AppHeader.vue";
import { isAuthReady } from "./firebase";

export default {
  name: "App",
  setup() {
    return { isAuthReady };
  },
  components: { AppHeader },
};
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding-top: 40px; /* Offset for fixed header */
  font-family: Arial, sans-serif;
}
</style>
