<!-- src/components/VideoPreview.vue -->
<template>
  <div class="preview">
    <div class="thumbnail-container">
      <img
        :src="preview.thumbnail"
        alt="Video Thumbnail"
        :class="{ thumbnail: true, 'shorts-thumbnail': isYouTubeShort }"
        :style="
          preview.source === 'Upload'
            ? { aspectRatio: preview.aspectRatio }
            : null
        "
      />
      <div
        v-if="preview.captionType"
        class="thumbnail-overlay"
        :style="baseOverlayStyle"
      >
        <span
          v-for="(word, index) in captionWords"
          :key="index"
          :style="getWordStyle(index)"
        >
          {{ word }}
        </span>
      </div>
    </div>
    <p>
      {{ preview.file }} ({{ preview.source }})
      <span v-if="preview.captionType">
        - Price: ${{ preview.price.toFixed(2) }} for
        {{ formatDuration(preview.duration) }}
      </span>
    </p>
    <div class="button-container">
      <button @click="addToCart" :disabled="uploading || !isAddToCartEnabled()">
        Add to Cart
      </button>
      <button @click="remove" :disabled="uploading">Remove</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
  preview: { type: Object, required: true },
  uploading: { type: Boolean, default: false },
});
const emit = defineEmits(["add-to-cart", "remove"]);

const captionWords = "Your captions here.".split(" ");
const highlightedWordIndex = ref(0);
let animationInterval = null;

const baseOverlayStyle = computed(() => {
  return {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    whiteSpace: "nowrap",
    fontWeight: "bold",
    bottom:
      props.preview.captionType === "Styled Captions" ||
      props.preview.captionType === "Dynamic Captions"
        ? `${10 + (props.preview.captionPosition / 100) * 70}%`
        : "10%",
    // Add semi-transparent background for Standard Captions
    background:
      props.preview.captionType === "Standard Captions"
        ? "rgba(0, 0, 0, 0.7)"
        : "none",
    padding:
      props.preview.captionType === "Standard Captions" ? "2px 6px" : "0",
    borderRadius:
      props.preview.captionType === "Standard Captions" ? "3px" : "0",
  };
});

const getWordStyle = computed(() => {
  return (index) => {
    const baseStyle = {
      fontFamily: props.preview.captionFont,
      marginRight: "4px",
    };

    let color, outlineColor, outlineThickness, fontSize;

    if (props.preview.captionType === "Dynamic Captions") {
      const isHighlighted = index === highlightedWordIndex.value;
      color = isHighlighted
        ? props.preview.highlightColor
        : props.preview.textColor;
      outlineColor = isHighlighted
        ? props.preview.highlightOutlineColor
        : props.preview.outlineColor;
      outlineThickness = isHighlighted
        ? props.preview.highlightOutlineThickness
        : props.preview.outlineThickness;
      fontSize = isHighlighted
        ? props.preview.captionSize * props.preview.highlightSize
        : props.preview.captionSize;
    } else if (props.preview.captionType === "Styled Captions") {
      color = props.preview.textColor;
      outlineColor = props.preview.outlineColor;
      outlineThickness = props.preview.outlineThickness;
      fontSize = props.preview.captionSize;
    } else {
      color = "#fff";
      outlineColor = "#000";
      outlineThickness = 1.1;
      fontSize = 22;
      baseStyle.fontFamily = "Arial, sans-serif";
    }

    const shadowSpread = outlineThickness * 0.75;
    const shadow = `
      ${shadowSpread}px ${shadowSpread}px 0 ${outlineColor},
      ${-shadowSpread}px ${shadowSpread}px 0 ${outlineColor},
      ${shadowSpread}px ${-shadowSpread}px 0 ${outlineColor},
      ${-shadowSpread}px ${-shadowSpread}px 0 ${outlineColor},
      ${shadowSpread}px 0 0 ${outlineColor},
      ${-shadowSpread}px 0 0 ${outlineColor},
      0 ${shadowSpread}px 0 ${outlineColor},
      0 ${-shadowSpread}px 0 ${outlineColor}
    `;

    return {
      ...baseStyle,
      color,
      fontSize: `${fontSize}px`,
      textShadow: shadow,
    };
  };
});

function startAnimation() {
  stopAnimation();
  if (props.preview.captionType === "Dynamic Captions") {
    animationInterval = setInterval(() => {
      highlightedWordIndex.value =
        (highlightedWordIndex.value + 1) % captionWords.length;
    }, 500);
  }
}

function stopAnimation() {
  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
  }
}

onMounted(() => {
  startAnimation();
});

onUnmounted(() => {
  stopAnimation();
});

watch(
  () => props.preview.captionType,
  (newType) => {
    if (newType === "Dynamic Captions") {
      startAnimation();
    } else {
      stopAnimation();
    }
  }
);

function addToCart() {
  emit("add-to-cart", props.preview);
}

function remove() {
  emit("remove", props.preview);
}

function isAddToCartEnabled() {
  const { captionType, contentDeliveryOptions, source } = props.preview;
  if (!captionType || !contentDeliveryOptions) return false;
  if (captionType === "Standard Captions") {
    if (contentDeliveryOptions === "standardBurnIn") return source === "Upload";
    if (contentDeliveryOptions === "grantYouTube") return source === "YouTube";
    return contentDeliveryOptions === "downloadableSrt";
  }
  if (captionType === "Styled Captions") {
    if (contentDeliveryOptions === "styledBurnIn") {
      return source === "Upload";
    }
    if (contentDeliveryOptions === "styledDownloadableSrt") {
      return source === "Upload";
    }
    return false;
  }
  if (captionType === "Dynamic Captions") {
    return contentDeliveryOptions === "dynamicBurnIn" && source === "Upload";
  }
  return false;
}

function formatDuration(minutes) {
  const totalSeconds = Math.round(minutes * 60);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs < 10 ? "0" + secs : secs}`;
}

const isYouTubeShort = computed(() => {
  return (
    props.preview.source === "YouTube" &&
    props.preview.link.includes("youtube.com/shorts/")
  );
});
</script>

<style scoped>
.preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 1px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 5px;
  background-color: #fff;
  box-sizing: border-box;
}

.thumbnail-container {
  position: relative;
  width: 100%;
  max-width: 480px;
  margin: 10px auto;
}

.thumbnail {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

.shorts-thumbnail {
  aspect-ratio: 9 / 16;
}

.button-container {
  display: flex;
  gap: 10px;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  font-size: 13px;
}

button:first-child {
  background-color: #28a745;
  color: #fff;
}

button:last-child {
  background-color: #dc3545;
  color: #fff;
}

p {
  font-size: 13px;
  margin: 10px 0;
  text-align: center;
}

@media (max-width: 768px) {
  .thumbnail-overlay {
    font-size: 0.8em;
  }
}
</style>
