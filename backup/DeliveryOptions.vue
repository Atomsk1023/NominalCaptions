<!-- src/components/DeliveryOptions.vue -->
<template>
  <div class="delivery-options">
    <h4>Content Delivery Options</h4>
    <div v-if="captionType === 'Standard Captions'">
      <label>
        <input
          type="checkbox"
          :checked="downloadableSrt"
          @change="toggleDownloadableSrt($event.target.checked)"
        />
        Downloadable .srt file
      </label>
      <label>
        <input
          type="checkbox"
          :checked="grantYouTube"
          @change="toggleGrantYouTube($event.target.checked)"
        />
        Automatically add to YouTube
      </label>
      <label>
        <input
          type="checkbox"
          :checked="standardBurnIn"
          @change="toggleStandardBurnIn($event.target.checked)"
        />
        Burn in
      </label>
    </div>
    <div v-if="captionType === 'Styled Captions'">
      <label>
        <input
          type="checkbox"
          :checked="styledDownloadableSrt"
          @change="toggleStyledDownloadableSrt($event.target.checked)"
        />
        Downloadable .ass file
      </label>
      <label>
        <input
          type="checkbox"
          :checked="styledBurnIn"
          @change="toggleStyledBurnIn($event.target.checked)"
        />
        Burn in
      </label>
    </div>
    <div v-if="captionType === 'Dynamic Styled Captions'">
      <label>
        <input type="checkbox" :checked="dynamicBurnIn" disabled />
        Burn in (required)
      </label>
    </div>
  </div>
</template>

<script setup>
defineProps({
  captionType: String,
  downloadableSrt: Boolean,
  grantYouTube: Boolean,
  standardBurnIn: Boolean,
  styledDownloadableSrt: Boolean,
  styledBurnIn: Boolean,
  dynamicBurnIn: Boolean,
});

const emit = defineEmits([
  "update:downloadableSrt",
  "update:grantYouTube",
  "update:standardBurnIn",
  "update:styledDownloadableSrt",
  "update:styledBurnIn",
  "update:dynamicBurnIn",
]);

function toggleDownloadableSrt(value) {
  emit("update:downloadableSrt", value);
  if (value) {
    emit("update:grantYouTube", false);
    emit("update:standardBurnIn", false);
  }
}

function toggleGrantYouTube(value) {
  emit("update:grantYouTube", value);
  if (value) {
    emit("update:downloadableSrt", false);
    emit("update:standardBurnIn", false);
  }
}

function toggleStandardBurnIn(value) {
  emit("update:standardBurnIn", value);
  if (value) {
    emit("update:downloadableSrt", false);
    emit("update:grantYouTube", false);
  }
}

function toggleStyledDownloadableSrt(value) {
  emit("update:styledDownloadableSrt", value);
  if (value) {
    emit("update:styledBurnIn", false);
  }
}

function toggleStyledBurnIn(value) {
  emit("update:styledBurnIn", value);
  if (value) {
    emit("update:styledDownloadableSrt", false);
  }
}
</script>

<style scoped>
.delivery-options {
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.delivery-options h4 {
  margin: 0 0 10px;
  font-size: 14px;
}

.delivery-options label {
  display: block;
  margin-bottom: 5px;
}
</style>
