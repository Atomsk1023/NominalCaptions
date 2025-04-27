<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"; // Import Firebase authentication methods for Google sign-in
import { auth } from "@/firebase"; // Import the Firebase auth instance

const route = useRoute(); // Get the current route
const router = useRouter(); // Get the router instance
const error = ref(null); // Initialize a reactive variable to hold any errors

// Function to handle Google Sign-In
async function handleGoogleSignIn() {
  try {
    // Create a new Google authentication provider
    const provider = new GoogleAuthProvider();
    // Add the YouTube upload scope to the provider
    provider.addScope("https://www.googleapis.com/auth/youtube.upload");
    // Open the Google sign-in popup
    await signInWithPopup(auth, provider);
    // Get the redirect path from the query parameters, or default to the home page
    const redirect = route.query.redirect || "/";
    // Redirect the user to the specified path
    router.push(redirect);
  } catch (err) {
    // If there's an error, set the error message
    error.value = "Google Sign-In failed. Please try again.";
  }
}
</script>

<!-- Login page template -->
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

<!-- Login page styles -->
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
