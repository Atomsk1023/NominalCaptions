<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/firebase";

const route = useRoute();
const router = useRouter();
const error = ref(null);

async function handleGoogleSignIn() {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/youtube.upload");
    await signInWithPopup(auth, provider);
    const redirect = route.query.redirect || "/";
    router.push(redirect);
  } catch (err) {
    error.value = "Google Sign-In failed. Please try again.";
  }
}
</script>

<template>
  <div class="login-container">
    <h2>Sign In</h2>
    <div v-if="error" class="error">{{ error }}</div>
    <button @click="handleGoogleSignIn" class="google-signin-button">
      Sign In with Google
    </button>
    <p>Don't have an account? Sign up with Google above.</p>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.google-signin-button {
  background-color: #4285f4;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.google-signin-button:hover {
  background-color: #357ae8;
}

.error {
  color: red;
  margin-bottom: 10px;
}
</style>
