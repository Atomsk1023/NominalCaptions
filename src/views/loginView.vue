<template>
  <div>
    <h1>Login / Sign Up</h1>
    <form @submit.prevent="login">
      <input v-model="email" type="email" placeholder="Email" required /><br />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      /><br />
      <button type="submit">Login</button>
      <button type="button" @click="signUp">Sign Up</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase";

export default {
  data() {
    return { email: "", password: "", error: "" };
  },
  methods: {
    async login() {
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push("/");
      } catch (err) {
        this.error = err.message;
      }
    },
    async signUp() {
      try {
        await createUserWithEmailAndPassword(auth, this.email, this.password);
        this.$router.push("/");
      } catch (err) {
        this.error = err.message;
      }
    },
  },
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px;
  margin: 0 auto;
}
</style>
