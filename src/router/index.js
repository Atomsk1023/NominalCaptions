import { createRouter, createWebHistory } from "vue-router";
import { user, isAuthReady } from "../firebase";
import Home from "../views/homeView.vue";
import Orders from "../views/ordersView.vue";
import Login from "../views/loginView.vue";

const routes = [
  { path: "/", name: "Home", component: Home, meta: { requiresAuth: true } },
  {
    path: "/orders",
    name: "Orders",
    component: Orders,
    meta: { requiresAuth: true },
  },
  { path: "/login", name: "Login", component: Login },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // Wait for auth state to resolve
  const checkAuth = () => {
    if (!isAuthReady.value) {
      setTimeout(checkAuth, 100); // Poll until ready
    } else if (requiresAuth && !user.value) {
      next("/login");
    } else if (!requiresAuth && user.value) {
      next("/"); // Redirect logged-in users from /login
    } else {
      next();
    }
  };
  checkAuth();
});

export default router;
