import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/homeView.vue";
import OrdersView from "../views/ordersView.vue";
import LoginView from "../views/loginView.vue";
import PrivacyView from "../views/privacyView.vue";
import TermsView from "../views/termsView.vue";
import { user, isAuthReady } from "../firebase";

const routes = [
  { path: "/", name: "Home", component: HomeView },
  {
    path: "/orders",
    name: "Orders",
    component: OrdersView,
    meta: { requiresAuth: true },
  },
  { path: "/login", name: "Login", component: LoginView },
  { path: "/privacy", name: "Privacy", component: PrivacyView },
  { path: "/terms", name: "Terms", component: TermsView },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (!isAuthReady.value) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (to.matched.some((record) => record.meta.requiresAuth) && !user.value) {
    next({ path: "/login", query: { redirect: to.fullPath } });
  } else {
    next();
  }
});

export default router;
