<!-- src/components/CaptionTypes.vue -->
<template>
  <div class="caption-types">
    <div
      v-for="type in captionTypes"
      :key="type"
      class="caption-type"
      :class="{ selected: captionType === type }"
      @click="toggleCaptionType(type)"
    >
      <span class="type-text">{{ type }}</span>
      <span class="price">{{ prices[type] }}</span>
      <span class="billing-text">Per second billing</span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  captionType: String,
});

const emit = defineEmits(["update:captionType"]);

const captionTypes = [
  "Standard Captions",
  "Styled Captions",
  "Dynamic Captions",
];

const prices = {
  "Standard Captions": "$1.50/min",
  "Styled Captions": "$2.00/min",
  "Dynamic Captions": "$2.50/min",
};

const captionType = ref(props.captionType);

// Sync with parent changes
watch(
  () => props.captionType,
  (newType) => {
    captionType.value = newType;
  }
);

// Emit user selections
watch(captionType, (newType) => {
  emit("update:captionType", newType);
});

function toggleCaptionType(type) {
  captionType.value = type;
}
</script>

<style scoped>
.caption-types {
  display: flex;
  justify-content: space-between;
  text-align: center;
  gap: 5px;
}

.caption-type {
  flex: 1;
  min-width: 100px;
  font-size: 18px;
  font-weight: bold;
  padding: 5px;
  background-color: #e9e9e9;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  margin: 0;
  transition: background-color 0.2s;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.caption-type.selected {
  background-color: #3a3a3a;
  color: #fff;
  border-color: #ffffff;
}

.caption-type.selected .price,
.caption-type.selected .billing-text {
  color: #fff;
}

.type-text {
  font-size: 18px;
  font-weight: bold;
}

.price {
  font-size: 12px;
  color: #333;
}

.billing-text {
  font-size: 10px;
  color: #333;
}
</style>
