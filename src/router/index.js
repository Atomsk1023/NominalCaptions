import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/homeView.vue";
import OrdersView from "../views/ordersView.vue";
import LoginView from "../views/loginView.vue"; // Import the Login view
import PrivacyView from "../views/privacyView.vue";
import TermsView from "../views/termsView.vue";
import { user, isAuthReady } from "../firebase";

// Define the routes for the application
const routes = [
  { path: "/", name: "Home", component: HomeView }, // Route for the home view
  {
    path: "/orders",
    name: "Orders",
    component: OrdersView,
    meta: { requiresAuth: true }, // Metadata to indicate that this route requires authentication
  },
  { path: "/login", name: "Login", component: LoginView }, // Route for the login view
  { path: "/privacy", name: "Privacy", component: PrivacyView }, // Route for the privacy view
  { path: "/terms", name: "Terms", component: TermsView }, // Route for the terms view
];

// Create the router instance
const router = createRouter({
  history: createWebHistory(), // Use HTML5 history mode
  routes, // Set the defined routes
});

// Navigation guard to handle authentication
router.beforeEach(async (to, from, next) => {
  // Wait for authentication to be ready before proceeding
  if (!isAuthReady.value) {
    // If authentication is not ready, wait for 100ms
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  // Check if the route requires authentication and if the user is not logged in
  if (to.matched.some((record) => record.meta.requiresAuth) && !user.value) {
    // If the route requires auth and user is not logged in, redirect to the login page
    // Pass the original path as a query parameter to redirect back after login
    next({ path: "/login", query: { redirect: to.fullPath } });
  } else {
    // Proceed to the route
    next();
  }
});

// Export the router instance
export default router;
