// Import the createApp function from Vue.js to create a new application instance.
import { createApp } from "vue";
// Import the main App component which serves as the root component.
import App from "./App.vue";
// Import the router instance to handle navigation within the app.
import router from "./router";

// Create a new Vue application instance, mount the App component, use the router, and mount it to the DOM element with the ID "app".
createApp(App).use(router).mount("#app");
