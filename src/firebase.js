import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { ref } from "vue"; // Import ref from vue

// Firebase configuration object, using environment variables for sensitive information.
const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY, // API key for your Firebase project
  authDomain: process.env.VUE_APP_AUTH_DOMAIN, // Authentication domain for your Firebase project
  projectId: process.env.VUE_APP_PROJECT_ID, // Project ID of your Firebase project
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET, // Storage bucket for your Firebase project
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID, // Messaging sender ID for your Firebase project
  appId: process.env.VUE_APP_APP_ID, // App ID for your Firebase project
};

// Initialize the Firebase app with the configuration.
const app = initializeApp(firebaseConfig);

// Get the authentication instance.
export const auth = getAuth(app);

// Get the storage instance.
export const storage = getStorage(app);

// Reactive user state using Vue's ref for reactivity.
export const user = ref(null);

// Indicates if the authentication state is ready.
export const isAuthReady = ref(false);

// Listen for authentication state changes using onAuthStateChanged.
onAuthStateChanged(auth, (currentUser) => {
  console.log("Auth state changed:", currentUser);
  user.value = currentUser;
  isAuthReady.value = true;
});
