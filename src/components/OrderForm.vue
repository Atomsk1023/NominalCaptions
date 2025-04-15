<!-- src/components/OrderForm.vue -->
<template>
  <div @click="handleOutsideClick">
    <form @submit.prevent>
      <VideoSource @add-video="handleAddVideo" />
      <div class="quotes-container">
        <CaptionTypes v-model:captionType="options.captionType" />
        <div class="options-row">
          <div v-if="options.captionType" class="option-column">
            <h3
              class="option-heading"
              :class="{ expanded: isLeftColumnExpanded }"
              @click.stop="toggleLeftColumn"
            >
              Caption options
            </h3>
            <transition name="fade">
              <div v-if="isLeftColumnExpanded" class="option-content">
                <StyleOptions
                  :captionType="options.captionType"
                  v-model:downloadableSrt="options.downloadableSrt"
                  v-model:grantYouTube="options.grantYouTube"
                  v-model:standardBurnIn="options.standardBurnIn"
                  v-model:styledDownloadableSrt="options.styledDownloadableSrt"
                  v-model:styledBurnIn="options.styledBurnIn"
                  v-model:dynamicBurnIn="options.dynamicBurnIn"
                  v-model:speakerChanges="options.speakerChanges"
                  v-model:atmospherics="options.atmospherics"
                  v-model:isExpanded="isLeftColumnExpanded"
                />
              </div>
            </transition>
          </div>
          <div
            v-if="
              options.captionType === 'Styled Captions' ||
              options.captionType === 'Dynamic Captions'
            "
            class="option-column"
          >
            <h3
              class="option-heading"
              :class="{ expanded: isRightColumnExpanded }"
              @click.stop="toggleRightColumn"
            >
              Style options
            </h3>
            <transition name="fade">
              <div v-if="isRightColumnExpanded" class="option-content">
                <CaptionStyles
                  :captionType="options.captionType"
                  v-model:styledTextColor="options.styledTextColor"
                  v-model:styledOutlineColor="options.styledOutlineColor"
                  v-model:styledOutlineThickness="
                    options.styledOutlineThickness
                  "
                  v-model:styledCaptionSize="options.styledCaptionSize"
                  v-model:styledCaptionFont="options.styledCaptionFont"
                  v-model:styledCaptionPosition="options.styledCaptionPosition"
                  v-model:dynamicTextColor="options.dynamicTextColor"
                  v-model:dynamicOutlineColor="options.dynamicOutlineColor"
                  v-model:dynamicOutlineThickness="
                    options.dynamicOutlineThickness
                  "
                  v-model:dynamicCaptionSize="options.dynamicCaptionSize"
                  v-model:dynamicCaptionFont="options.dynamicCaptionFont"
                  v-model:dynamicCaptionPosition="
                    options.dynamicCaptionPosition
                  "
                  v-model:dynamicHighlightColor="options.dynamicHighlightColor"
                  v-model:dynamicHighlightOutlineColor="
                    options.dynamicHighlightOutlineColor
                  "
                  v-model:dynamicHighlightOutlineThickness="
                    options.dynamicHighlightOutlineThickness
                  "
                  v-model:dynamicHighlightSize="options.dynamicHighlightSize"
                  v-model:isExpanded="isRightColumnExpanded"
                />
              </div>
            </transition>
          </div>
        </div>
        <div class="preview-area">
          <VideoPreview
            v-for="(preview, index) in videoPreviews"
            :key="index"
            :preview="preview"
            :uploading="uploading"
            @add-to-cart="addToCart"
            @remove="removeFromPreviews"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import VideoSource from "./VideoSource.vue";
import VideoPreview from "./VideoPreview.vue";
import CaptionTypes from "./CaptionTypes.vue";
import StyleOptions from "./StyleOptions.vue";
import CaptionStyles from "./CaptionStyles.vue";

const emit = defineEmits(["upload-complete", "add-to-cart"]);
const videoPreviews = ref([]);
const uploading = ref(false);
const isLeftColumnExpanded = ref(false);
const isRightColumnExpanded = ref(false);

const options = ref({
  captionType: null,
  downloadableSrt: false,
  grantYouTube: false,
  standardBurnIn: false,
  styledTextColor: "#ff6200",
  styledOutlineColor: "#000000",
  styledOutlineThickness: 1,
  styledCaptionSize: 22,
  styledCaptionFont: "Arial",
  styledCaptionPosition: 0,
  styledDownloadableSrt: false,
  styledBurnIn: false,
  dynamicTextColor: "#ffffff",
  dynamicOutlineColor: "#000000",
  dynamicOutlineThickness: 1,
  dynamicCaptionSize: 22,
  dynamicCaptionFont: "Arial",
  dynamicCaptionPosition: 0,
  dynamicHighlightColor: "#ff6200",
  dynamicHighlightOutlineColor: "#000000",
  dynamicHighlightOutlineThickness: 1,
  dynamicHighlightSize: 1.2,
  dynamicBurnIn: false,
  speakerChanges: false,
  atmospherics: false,
});

function toggleLeftColumn() {
  isLeftColumnExpanded.value = !isLeftColumnExpanded.value;
  if (isLeftColumnExpanded.value) isRightColumnExpanded.value = false;
}

function toggleRightColumn() {
  isRightColumnExpanded.value = !isRightColumnExpanded.value;
  if (isRightColumnExpanded.value) isLeftColumnExpanded.value = false;
}

function handleOutsideClick(event) {
  if (
    !event.target.closest(".option-content") &&
    !event.target.closest(".option-heading")
  ) {
    isLeftColumnExpanded.value = false;
    isRightColumnExpanded.value = false;
  }
}

function handleAddVideo(order) {
  uploading.value = true;

  // Set defaults for YouTube videos
  if (order.source === "YouTube") {
    options.value.captionType = "Standard Captions";
    options.value.grantYouTube = true;
    options.value.downloadableSrt = false;
    options.value.standardBurnIn = false;
  }

  const videoData = {
    ...order,
    price: calculatePrice(order.duration, options.value.captionType),
    captionType: options.value.captionType,
    contentDeliveryOptions: getContentDeliveryOptions(),
    speakerChanges: options.value.speakerChanges,
    atmospherics: options.value.atmospherics,
    ...(options.value.captionType === "Styled Captions"
      ? {
          textColor: options.value.styledTextColor,
          outlineColor: options.value.styledOutlineColor,
          outlineThickness: options.value.styledOutlineThickness,
          captionSize: options.value.styledCaptionSize,
          captionFont: options.value.styledCaptionFont,
          captionPosition: options.value.styledCaptionPosition,
        }
      : {}),
    ...(options.value.captionType === "Dynamic Captions"
      ? {
          textColor: options.value.dynamicTextColor,
          outlineColor: options.value.dynamicOutlineColor,
          outlineThickness: options.value.dynamicOutlineThickness,
          captionSize: options.value.dynamicCaptionSize,
          captionFont: options.value.dynamicCaptionFont,
          captionPosition: options.value.dynamicCaptionPosition,
          highlightColor: options.value.dynamicHighlightColor,
          highlightOutlineColor: options.value.dynamicHighlightOutlineColor,
          highlightOutlineThickness:
            options.value.dynamicHighlightOutlineThickness,
          highlightSize: options.value.dynamicHighlightSize,
        }
      : {}),
  };
  videoPreviews.value.push(videoData);
  emit("upload-complete", videoPreviews.value);
  uploading.value = false;
}

function addToCart(preview) {
  const order = {
    ...preview,
    captionType: options.value.captionType,
    contentDeliveryOptions: getContentDeliveryOptions(),
    speakerChanges: options.value.speakerChanges,
    atmospherics: options.value.atmospherics,
  };
  if (options.value.captionType === "Styled Captions") {
    Object.assign(order, {
      textColor: options.value.styledTextColor,
      outlineColor: options.value.styledOutlineColor,
      outlineThickness: options.value.styledOutlineThickness,
      captionSize: options.value.styledCaptionSize,
      captionFont: options.value.styledCaptionFont,
      captionPosition: options.value.styledCaptionPosition,
    });
  } else if (options.value.captionType === "Dynamic Captions") {
    Object.assign(order, {
      textColor: options.value.dynamicTextColor,
      outlineColor: options.value.dynamicOutlineColor,
      outlineThickness: options.value.dynamicOutlineThickness,
      captionSize: options.value.dynamicCaptionSize,
      captionFont: options.value.dynamicCaptionFont,
      captionPosition: options.value.dynamicCaptionPosition,
      highlightColor: options.value.dynamicHighlightColor,
      highlightOutlineColor: options.value.dynamicHighlightOutlineColor,
      highlightOutlineThickness: options.value.dynamicHighlightOutlineThickness,
      highlightSize: options.value.dynamicHighlightSize,
    });
  }
  order.price = calculatePrice(order.duration, order.captionType);
  emit("add-to-cart", order);
  const index = videoPreviews.value.findIndex((p) => p === preview);
  videoPreviews.value.splice(index, 1);
  if (videoPreviews.value.length === 0 && !uploading.value) resetForm();
}

function removeFromPreviews(order) {
  const index = videoPreviews.value.findIndex((p) => p === order);
  if (index !== -1) {
    videoPreviews.value.splice(index, 1);
  }
  if (videoPreviews.value.length === 0 && !uploading.value) resetForm();
}

function getContentDeliveryOptions() {
  if (options.value.captionType === "Standard Captions") {
    if (options.value.downloadableSrt) return "downloadableSrt";
    if (options.value.grantYouTube) return "grantYouTube";
    if (options.value.standardBurnIn) return "standardBurnIn";
  } else if (options.value.captionType === "Styled Captions") {
    if (options.value.styledDownloadableSrt) return "styledDownloadableSrt";
    if (options.value.styledBurnIn) return "styledBurnIn";
  } else if (options.value.captionType === "Dynamic Captions") {
    if (options.value.dynamicBurnIn) return "dynamicBurnIn";
  }
  return null;
}

function calculatePrice(duration, captionType) {
  const totalSeconds = duration * 60;
  if (captionType === "Dynamic Captions") {
    return totalSeconds * 0.04166; // $0.04166 per second (~$2.50/min)
  }
  if (captionType === "Styled Captions") {
    return totalSeconds * (1 / 30); // $1 per 30 seconds ($2/min)
  }
  if (captionType === "Standard Captions") {
    return totalSeconds * 0.025; // $0.025 per second ($1.50/min)
  }
  return 0;
}

function resetOptions() {
  options.value = {
    captionType: null,
    downloadableSrt: false,
    grantYouTube: false,
    standardBurnIn: false,
    styledTextColor: "#ff6200",
    styledOutlineColor: "#000000",
    styledOutlineThickness: 1,
    styledCaptionSize: 22,
    styledCaptionFont: "Arial",
    styledCaptionPosition: 0,
    styledDownloadableSrt: false,
    styledBurnIn: false,
    dynamicTextColor: "#ffffff",
    dynamicOutlineColor: "#000000",
    dynamicOutlineThickness: 1,
    dynamicCaptionSize: 22,
    dynamicCaptionFont: "Arial",
    dynamicCaptionPosition: 0,
    dynamicHighlightColor: "#ff6200",
    dynamicHighlightOutlineColor: "#000000",
    dynamicHighlightOutlineThickness: 1,
    dynamicHighlightSize: 1.2,
    dynamicBurnIn: false,
    speakerChanges: false,
    atmospherics: false,
  };
  isLeftColumnExpanded.value = false;
  isRightColumnExpanded.value = false;
}

function resetForm() {
  videoPreviews.value = [];
  resetOptions();
}

watch(
  options,
  () => {
    if (options.value.captionType === "Dynamic Captions") {
      options.value.dynamicBurnIn = true;
    } else {
      options.value.dynamicBurnIn = false;
    }
    const previewOptions = {
      captionType: options.value.captionType,
      contentDeliveryOptions: getContentDeliveryOptions(),
      speakerChanges: options.value.speakerChanges,
      atmospherics: options.value.atmospherics,
    };
    if (options.value.captionType === "Styled Captions") {
      Object.assign(previewOptions, {
        textColor: options.value.styledTextColor,
        outlineColor: options.value.styledOutlineColor,
        outlineThickness: options.value.styledOutlineThickness,
        captionSize: options.value.styledCaptionSize,
        captionFont: options.value.styledCaptionFont,
        captionPosition: options.value.styledCaptionPosition,
      });
    } else if (options.value.captionType === "Dynamic Captions") {
      Object.assign(previewOptions, {
        textColor: options.value.dynamicTextColor,
        outlineColor: options.value.dynamicOutlineColor,
        outlineThickness: options.value.dynamicOutlineThickness,
        captionSize: options.value.dynamicCaptionSize,
        captionFont: options.value.dynamicCaptionFont,
        captionPosition: options.value.dynamicCaptionPosition,
        highlightColor: options.value.dynamicHighlightColor,
        highlightOutlineColor: options.value.dynamicHighlightOutlineColor,
        highlightOutlineThickness:
          options.value.dynamicHighlightOutlineThickness,
        highlightSize: options.value.dynamicHighlightSize,
      });
    }
    videoPreviews.value = videoPreviews.value.map((preview) => ({
      ...preview,
      ...previewOptions,
      price: calculatePrice(preview.duration, previewOptions.captionType),
    }));
    emit("upload-complete", videoPreviews.value);
  },
  { deep: true }
);

defineExpose({
  returnToPreviews: (order) => {
    if (!order.source) {
      order.source =
        order.link && order.link.includes("youtube.com") ? "YouTube" : "Upload";
    }
    if (order.source === "Upload" && order.width && order.height) {
      order.aspectRatio = `${order.width} / ${order.height}`;
    }
    options.value.captionType = order.captionType || null;
    options.value.downloadableSrt =
      order.contentDeliveryOptions === "downloadableSrt";
    options.value.grantYouTube =
      order.contentDeliveryOptions === "grantYouTube";
    options.value.standardBurnIn =
      order.contentDeliveryOptions === "standardBurnIn";
    options.value.styledDownloadableSrt =
      order.contentDeliveryOptions === "styledDownloadableSrt";
    options.value.styledBurnIn =
      order.contentDeliveryOptions === "styledBurnIn";
    options.value.dynamicBurnIn =
      order.contentDeliveryOptions === "dynamicBurnIn";
    options.value.speakerChanges = order.speakerChanges || false;
    options.value.atmospherics = order.atmospherics || false;
    if (order.captionType === "Styled Captions") {
      options.value.styledTextColor = order.textColor || "#ff6200";
      options.value.styledOutlineColor = order.outlineColor || "#000000";
      options.value.styledOutlineThickness = order.outlineThickness || 1;
      options.value.styledCaptionSize = order.captionSize || 22;
      options.value.styledCaptionFont = order.captionFont || "Arial";
      options.value.styledCaptionPosition = order.captionPosition || 0;
    } else if (order.captionType === "Dynamic Captions") {
      options.value.dynamicTextColor = order.textColor || "#ffffff";
      options.value.dynamicOutlineColor = order.outlineColor || "#000000";
      options.value.dynamicOutlineThickness = order.outlineThickness || 1;
      options.value.dynamicCaptionSize = order.captionSize || 22;
      options.value.dynamicCaptionFont = order.captionFont || "Arial";
      options.value.dynamicCaptionPosition = order.captionPosition || 0;
      options.value.dynamicHighlightColor = order.highlightColor || "#ff6200";
      options.value.dynamicHighlightOutlineColor =
        order.highlightOutlineColor || "#000000";
      options.value.dynamicHighlightOutlineThickness =
        order.highlightOutlineThickness || 1;
      options.value.dynamicHighlightSize = order.highlightSize || 1.2;
    }
    order.price = calculatePrice(order.duration, order.captionType);
    videoPreviews.value.push(order);
    emit("upload-complete", videoPreviews.value);
  },
});
</script>

<style scoped>
.quotes-container {
  max-width: 600px;
  margin: 0 auto 10px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  gap: 5px;
  box-sizing: border-box;
}

.options-row {
  display: flex;
  justify-content: space-between;
  gap: 5px;
  margin-bottom: 5px;
  position: relative;
}

.option-column {
  flex: 1;
  min-width: 100px;
  max-width: 150px;
  position: relative;
}

.option-heading {
  font-size: 16px;
  font-weight: bold;
  padding: 4px;
  background-color: #e9e9e9;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  margin: 0;
  transition: background-color 0.2s;
}

.option-heading.expanded {
  background-color: #d0d0d0;
}

.option-content {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  background: rgba(255, 255, 255, 0.5);
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
  box-sizing: border-box;
}

.option-content .left-options,
.option-content .right-options {
  width: 100%;
  min-height: auto;
  border: none;
  position: static;
  overflow: visible;
  background: transparent;
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(3px);
}

.option-content .left-options.minimized,
.option-content .right-options.minimized {
  display: none;
}

.option-content .expanded-content {
  position: static;
  opacity: 1;
}

.option-content .minimized-content {
  display: none;
}

.option-content .minimize-button {
  display: none;
}

.preview-area {
  display: flex;
  flex-direction: column;
  gap: 7px;
  min-height: 100%;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
