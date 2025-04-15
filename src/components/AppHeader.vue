<!-- src/components/AppHeader.vue -->
<template>
  <header class="app-header">
    <div class="header-container">
      <router-link to="/" class="logo">NominalCaptions</router-link>
      <nav v-if="isAuthReady" class="desktop-nav">
        <router-link to="/" class="nav-item">Home</router-link>
        <router-link v-if="user" to="/orders" class="nav-item"
          >Orders</router-link
        >
        <button v-if="user" @click="logout" class="nav-item nav-button">
          Logout
        </button>
        <router-link v-else to="/login" class="nav-item">Login</router-link>
      </nav>
      <div v-if="isAuthReady" class="mobile-nav">
        <button
          class="hamburger"
          @click="toggleMenu"
          :aria-expanded="isMenuOpen"
        >
          <span class="hamburger-icon">{{ isMenuOpen ? "✕" : "☰" }}</span>
        </button>
        <transition name="dropdown">
          <nav v-if="isMenuOpen" class="dropdown-menu">
            <router-link to="/" class="dropdown-item" @click="toggleMenu"
              >Home</router-link
            >
            <router-link
              v-if="user"
              to="/orders"
              class="dropdown-item"
              @click="toggleMenu"
            >
              Orders
            </router-link>
            <button
              v-if="user"
              class="dropdown-item dropdown-button"
              @click="handleLogout"
            >
              Logout
            </button>
            <router-link
              v-else
              to="/login"
              class="dropdown-item"
              @click="toggleMenu"
            >
              Login
            </router-link>
          </nav>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";
import { auth, user, isAuthReady } from "../firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const isMenuOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

async function handleLogout() {
  await signOut(auth);
  toggleMenu();
  router.push("/login");
}
</script>

<style scoped>
.app-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #303030;
  border-bottom: 1px solid #ccc;
  z-index: 100;
  box-sizing: border-box;
  height: 40px;
  font-family: Arial, sans-serif;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 20px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  color: #ffffff;
  text-decoration: none;
}

.desktop-nav {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-item {
  font-size: 16px;
  color: #ffffff;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 5px;
  transition: background-color 0.2s;
}

.nav-item:hover {
  background-color: #e9e9e9;
}

.nav-button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.nav-button:hover {
  background-color: #e9e9e9;
}

.mobile-nav {
  display: none;
}

.hamburger {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 15px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  width: 200px;
  z-index: 101;
}

.dropdown-item {
  display: block;
  padding: 12px 15px;
  color: #333;
  text-decoration: none;
  font-size: 16px;
  border-bottom: 1px solid #eee;
}

.dropdown-button {
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover,
.dropdown-button:hover {
  background-color: #e9e9e9;
}

.dropdown-item:last-child,
.dropdown-button:last-child {
  border-bottom: none;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-nav {
    display: block;
  }
}
</style>
