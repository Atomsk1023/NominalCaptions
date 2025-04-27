<script setup>
// Import necessary modules from Vue, Vue Router, and Firebase.
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import { user, auth } from "@/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// Import the OrderForm component.
import OrderForm from "../components/OrderForm.vue";

// Initialize the router.
const router = useRouter();
// Load cart data from local storage or initialize an empty array.
const cart = ref(JSON.parse(localStorage.getItem("cart")) || []);
// Reference to the OrderForm component.
const orderFormRef = ref(null);
// Load preview data from local storage or initialize it to null.
const preview = ref(JSON.parse(localStorage.getItem("preview")) || null);
// Store any error messages.
const error = ref(null);
// Control the display of the YouTube permissions prompt.
const showYouTubePrompt = ref(false);

// Compute the total price of items in the cart.
const total = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price || 0), 0);
});

// Compute the list of YouTube videos in the cart that require permissions.
const youTubeVideos = computed(() => {
  return cart.value
    .filter((item) => item.contentDeliveryOptions === "grantYouTube")
    .map((item) => item.file);
});

// Watch for changes in the cart and persist it to local storage.
watch(
  cart,
  (newCart) => {
    localStorage.setItem("cart", JSON.stringify(newCart));
  },
  { deep: true }
);

// Watch for changes in the preview and persist it to local storage.
watch(
  preview,
  (newPreview) => {
    localStorage.setItem("preview", JSON.stringify(newPreview));
  },
  { deep: true }
);

// Restore the preview when the component is mounted.
onMounted(() => {
  if (
    preview.value &&
    orderFormRef.value &&
    orderFormRef.value.restorePreview
  ) {
    orderFormRef.value.restorePreview(preview.value);
  }
});

// Function to update the preview data.
function showPreviews(data) {
  preview.value = data;
}

// Function to add an order to the cart.
function addToCart(order) {
  console.log("Adding to cart:", order);
  cart.value.push(order);
}

// Function to remove an item from the cart.
function removeFromCart(item) {
  cart.value = cart.value.filter((i) => i !== item);
  if (orderFormRef.value && orderFormRef.value.returnToPreviews) {
    orderFormRef.value.returnToPreviews(item);
  } else {
    console.error("orderFormRef or returnToPreviews is not available");
  }
}

// Function to request YouTube permissions from the user.
async function requestYouTubePermissions() {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/youtube");
    const result = await signInWithPopup(auth, provider);
    console.log("YouTube permissions granted, user:", result.user);
    console.log("Access Token:", result.user.accessToken);
    showYouTubePrompt.value = false;
    await proceedToCheckout();
  } catch (err) {
    error.value = `Failed to request YouTube permissions: ${err.message}`;
    console.error("Permission error:", err);
    showYouTubePrompt.value = false;
  }
}

// Function to proceed with the checkout process.
async function proceedToCheckout() {
  try {
    const totalAmount = total.value.toFixed(2);
    const response = await fetch("http://localhost:3000/create-payment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: totalAmount, cart: cart.value }),
    });
    const data = await response.json();
    window.location.href = data.url;
  } catch (err) {
    error.value = `Checkout failed: ${err.message}`;
    console.error("Checkout error:", err);
  }
}

// Function to initiate the checkout process.
async function checkout() {
  if (cart.value.length === 0) return;
  if (!user.value) {
    router.push({ path: "/login", query: { redirect: "/" } });
    return;
  }

  // Check for YouTube permissions
  const needsYouTube = cart.value.some(
    (item) => item.contentDeliveryOptions === "grantYouTube"
  );
  if (needsYouTube) {
    showYouTubePrompt.value = true;
  } else {
    await proceedToCheckout();
  }
}

// Function to format duration from minutes to MM:SS.
function formatDuration(minutes) {
  const totalSeconds = Math.round(minutes * 60);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
}
// Function to format the caption options for display in the cart.
function formatCaptionOptions(item) {
  const { captionType, contentDeliveryOptions } = item;
  if (!captionType)
    return [
      { name: "Caption Type", value: "No Captions Selected", color: null },
    ];

  const options = [{ name: "Caption Type", value: captionType, color: null }];

  if (captionType === "Standard Captions") {
    options.push({
      name: "Delivery",
      value:
        contentDeliveryOptions === "downloadableSrt"
          ? "Downloadable .srt file"
          : contentDeliveryOptions === "grantYouTube"
          ? "Automatically add to YouTube"
          : contentDeliveryOptions === "standardBurnIn"
          ? "Burn in"
          : "No delivery option selected",
      color: null,
    });
  } else if (captionType === "Styled Captions") {
    options.push({
      name: "Delivery",
      value:
        contentDeliveryOptions === "styledDownloadableSrt"
          ? "Downloadable .ass file"
          : contentDeliveryOptions === "styledBurnIn"
          ? "Burn in"
          : "No delivery option selected",
      color: null,
    });
    options.push({
      name: "Text Color",
      value: item.textColor,
      color: item.textColor,
    });
    options.push({
      name: "Outline Color",
      value: item.outlineColor,
      color: item.outlineColor,
    });
    options.push({
      name: "Outline Thickness",
      value: `${item.outlineThickness}px`,
      color: null,
    });
    options.push({
      name: "Font Size",
      value: `${item.captionSize}px`,
      color: null,
    });
    options.push({ name: "Font", value: item.captionFont, color: null });
    options.push({
      name: "Position",
      value:
        item.captionPosition === 0
          ? "Bottom"
          : item.captionPosition === 100
          ? "Top"
          : `${item.captionPosition}%`,
      color: null,
    });
  } else if (captionType === "Dynamic Captions") {
    options.push({
      name: "Delivery",
      value:
        contentDeliveryOptions === "dynamicDownloadableSrt"
          ? "Downloadable .ass file"
          : contentDeliveryOptions === "dynamicBurnIn"
          ? "Burn in"
          : "No delivery option selected",
      color: null,
    });
    options.push({
      name: "Text Color",
      value: item.textColor,
      color: item.textColor,
    });
    options.push({
      name: "Outline Color",
      value: item.outlineColor,
      color: item.outlineColor,
    });
    options.push({
      name: "Outline Thickness",
      value: `${item.outlineThickness}px`,
      color: null,
    });
    options.push({
      name: "Font Size",
      value: `${item.captionSize}px`,
      color: null,
    });
    options.push({ name: "Font", value: item.captionFont, color: null });
    options.push({
      name: "Position",
      value:
        item.captionPosition === 0
          ? "Bottom"
          : item.captionPosition === 100
          ? "Top"
          : `${item.captionPosition}%`,
      color: null,
    });
    options.push({
      name: "Highlight Color",
      value: item.highlightColor,
      color: item.highlightColor,
    });
    options.push({
      name: "Highlight Outline Color",
      value: item.highlightOutlineColor,
      color: item.highlightOutlineColor,
    });
    options.push({
      name: "Highlight Outline Thickness",
      value: `${item.highlightOutlineThickness}px`,
      color: null,
    });
    options.push({
      name: "Highlight Size",
      value: `${item.highlightSize}x`,
      color: null,
    });
  }

  if (item.speakerChanges)
    options.push({ name: "Speaker Changes", value: "Yes", color: null });
  if (item.atmospherics)
    options.push({ name: "Atmospherics", value: "Yes", color: null });

  return options;
}
</script>
<!-- Template for the Home View -->

<template>
  <div>
    <OrderForm
      @upload-complete="showPreviews"
      @add-to-cart="addToCart"
      ref="orderFormRef"
    />
    <div class="cart-container">
      <h2>Captions Cart ({{ cart.length }})</h2>
      <div v-for="item in cart" :key="item.file" class="cart-item">
        <div class="title-row">
          <img :src="item.thumbnail" alt="Thumbnail" class="thumbnail" />
          <span class="video-title">{{ item.file }}</span>
        </div>
        <table class="options-table">
          <thead>
            <tr>
              <th>Option</th>
              <th>Value</th>
              <th>Length</th>
              <th>Price</th>
            </tr>
          </thead>
          <!-- Loop through the formatted options for each item -->
          <tbody>
            <tr
              v-for="(option, index) in formatCaptionOptions(item)"
              :key="index"
            >
              <td>{{ option.name }}</td>
              <td>
                {{ option.value }}
                <span
                  v-if="option.color"
                  class="color-cube"
                  :style="{ backgroundColor: option.color }"
                ></span>
              </td>
              <td>{{ index === 0 ? formatDuration(item.duration) : "" }}</td>
              <td>{{ index === 0 ? `$${item.price.toFixed(2)}` : "" }}</td>
            </tr>
          </tbody>
        </table>
        <button @click="removeFromCart(item)" class="remove-button">
          Remove
        </button>
      </div>
      <p>Total: ${{ total ? total.toFixed(2) : "0.00" }}</p>
      <button v-if="cart.length" @click="checkout">Checkout</button>
      <div v-if="error" class="error">{{ error }}</div>
    </div>

    <!-- YouTube Permissions Prompt -->
    <div v-if="showYouTubePrompt" class="modal-overlay">
      <div class="modal">
        <h2>YouTube Permissions Required</h2>
        <p>
          To upload captions to your selected YouTube videos, we need permission
          to access your YouTube account. This access will only be used to
          upload captions for the following videos in your cart:
        </p>
        <ul>
          <li v-for="video in youTubeVideos" :key="video">{{ video }}</li>
        </ul>
        <p>
          No other aspects of your YouTube account will be managed or modified.
          <a href="/privacy" target="_blank">Learn more in our Privacy Policy</a
          >.
        </p>
        <div class="modal-buttons">
          <button @click="showYouTubePrompt = false">Cancel</button>
          <button @click="requestYouTubePermissions">Grant Permissions</button>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Styling for the Home View -->
<style scoped>
.cart-container {
  max-width: 600px;
  margin: 0 auto 20px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 5px;
  box-sizing: border-box;
}

.cart-item {
  margin-bottom: 20px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.title-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.thumbnail {
  max-width: 50px;
  margin-right: 10px;
  vertical-align: middle;
}

.video-title {
  font-weight: bold;
}

.options-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
}

.options-table th,
.options-table td {
  border: 1px solid #ddd;
  padding: 5px;
  text-align: left;
}

.options-table th {
  background-color: #e9e9e9;
  font-weight: bold;
}

.options-table td:empty {
  background-color: #f5f5f5;
}

.remove-button {
  display: block;
  margin: 0 auto;
}

.color-cube {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-left: 5px;
  border: 1px solid #999;
  vertical-align: middle;
}

ul {
  list-style: none;
  padding: 0;
}

.error {
  color: red;
  margin-top: 10px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 20px;
  border-radius: 5px;
  max-width: 500px;
  text-align: center;
}

.modal ul {
  list-style-type: disc;
  padding-left: 20px;
  text-align: left;
}

.modal-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.modal-buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.modal-buttons button:first-child {
  background: #ccc;
}

.modal-buttons button:last-child {
  background: #4285f4;
  color: white;
}
</style>
