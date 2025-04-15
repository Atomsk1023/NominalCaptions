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
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import OrderForm from "../components/OrderForm.vue";

const cart = ref([]);
const orderFormRef = ref(null);

const total = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price || 0), 0);
});

function showPreviews() {
  // No-op: Previews stay in OrderForm.vue
}

function addToCart(order) {
  console.log("Adding to cart:", order);
  cart.value.push(order);
}

function removeFromCart(item) {
  cart.value = cart.value.filter((i) => i !== item);
  if (orderFormRef.value && orderFormRef.value.returnToPreviews) {
    orderFormRef.value.returnToPreviews(item);
  } else {
    console.error("orderFormRef or returnToPreviews is not available");
  }
}

async function checkout() {
  const response = await fetch("http://localhost:3000/create-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: total.value.toFixed(2),
      orders: cart.value,
    }),
  });
  const { url } = await response.json();
  window.location.href = url;
}

function formatDuration(minutes) {
  const totalSeconds = Math.round(minutes * 60);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
}

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
</style>
