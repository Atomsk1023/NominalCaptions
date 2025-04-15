import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { ref } from "vue"; // Reactive ref from Vue

const firebaseConfig = {
  apiKey: "AIzaSyAPERmiQ5mwC19IyU0Ld6mGRBW_xg4zLgw",
  authDomain: "nominal-captions-2025.firebaseapp.com",
  projectId: "nominal-captions-2025",
  storageBucket: "nominal-captions-2025.firebasestorage.app",
  messagingSenderId: "603109816281",
  appId: "1:603109816281:web:e2cd26f53bda51afc18bc8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Reactive user state
export const user = ref(null);
export const isAuthReady = ref(false);

onAuthStateChanged(auth, (currentUser) => {
  console.log("Auth state changed:", currentUser);
  user.value = currentUser;
  isAuthReady.value = true;
});
