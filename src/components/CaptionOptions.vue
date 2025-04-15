<template>
  <div class="selection-container">
    <StandardCaptions
      :standard-srt="standardSrt"
      :downloadable-srt="downloadableSrt"
      :grant-you-tube="grantYouTube"
      :standard-burn-in="standardBurnIn"
      @toggle-standard-srt="toggleOption('standardSrt', $event)"
      @update:downloadable-srt="toggleDownloadableSrt"
      @update:grant-you-tube="toggleGrantYouTube"
      @update:standard-burn-in="toggleStandardBurnIn"
    />
    <StyledCaptions
      :burn-in="burnIn"
      :text-color="styledTextColor"
      :outline-color="styledOutlineColor"
      :outline-thickness="styledOutlineThickness"
      :caption-size="styledCaptionSize"
      :caption-font="styledCaptionFont"
      :caption-position="styledCaptionPosition"
      :advanced-downloadable-srt="styledDownloadableSrt"
      :advanced-burn-in="styledBurnIn"
      @toggle-burn-in="toggleOption('burnIn', $event)"
      @update:text-color="updateStyledTextColor"
      @update:outline-color="updateStyledOutlineColor"
      @update:outline-thickness="updateStyledOutlineThickness"
      @update:caption-size="updateStyledCaptionSize"
      @update:caption-font="updateStyledCaptionFont"
      @update:caption-position="updateStyledCaptionPosition"
      @update:advanced-downloadable-srt="toggleStyledDownloadableSrt"
      @update:advanced-burn-in="toggleStyledBurnIn"
    />
    <DynamicCaptions
      :dynamic="dynamic"
      :text-color="dynamicTextColor"
      :outline-color="dynamicOutlineColor"
      :outline-thickness="dynamicOutlineThickness"
      :caption-size="dynamicCaptionSize"
      :caption-font="dynamicCaptionFont"
      :caption-position="dynamicCaptionPosition"
      :highlight-color="dynamicHighlightColor"
      :highlight-outline-color="dynamicHighlightOutlineColor"
      :highlight-outline-thickness="dynamicHighlightOutlineThickness"
      :highlight-size="dynamicHighlightSize"
      :dynamic-burn-in="dynamicBurnIn"
      @toggle-dynamic="toggleOption('dynamic', $event)"
      @update:text-color="updateDynamicTextColor"
      @update:outline-color="updateDynamicOutlineColor"
      @update:outline-thickness="updateDynamicOutlineThickness"
      @update:caption-size="updateDynamicCaptionSize"
      @update:caption-font="updateDynamicCaptionFont"
      @update:caption-position="updateDynamicCaptionPosition"
      @update:highlight-color="updateDynamicHighlightColor"
      @update:highlight-outline-color="updateDynamicHighlightOutlineColor"
      @update:highlight-outline-thickness="
        updateDynamicHighlightOutlineThickness
      "
      @update:highlight-size="updateDynamicHighlightSize"
    />
    <AdditionalOptions
      :speaker-changes="speakerChanges"
      :atmospherics="atmospherics"
      @update:speaker-changes="updateSpeakerChanges"
      @update:atmospherics="updateAtmospherics"
    />
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import StandardCaptions from "./StandardCaptions.vue";
import StyledCaptions from "./StyledCaptions.vue";
import DynamicCaptions from "./DynamicCaptions.vue";
import AdditionalOptions from "./CaptionStyles.vue";

const emit = defineEmits(["options-updated"]);
const standardSrt = ref(false);
const downloadableSrt = ref(false);
const grantYouTube = ref(false);
const standardBurnIn = ref(false);
const burnIn = ref(false);
const dynamic = ref(false);
const speakerChanges = ref(false);
const atmospherics = ref(false);

// Styled Captions options
const styledTextColor = ref("#ff6200");
const styledOutlineColor = ref("#000000");
const styledOutlineThickness = ref(1);
const styledCaptionSize = ref(22);
const styledCaptionFont = ref("Arial");
const styledCaptionPosition = ref(0);
const styledDownloadableSrt = ref(false);
const styledBurnIn = ref(false);

// Dynamic Styled Captions options
const dynamicTextColor = ref("#ffffff");
const dynamicOutlineColor = ref("#000000");
const dynamicOutlineThickness = ref(1);
const dynamicCaptionSize = ref(22);
const dynamicCaptionFont = ref("Arial");
const dynamicCaptionPosition = ref(0);
const dynamicHighlightColor = ref("#ff6200");
const dynamicHighlightOutlineColor = ref("#000000");
const dynamicHighlightOutlineThickness = ref(1);
const dynamicHighlightSize = ref(1.2);
const dynamicBurnIn = ref(false); // Default false, set to true when dynamic is toggled

watch(
  [
    burnIn,
    standardSrt,
    downloadableSrt,
    grantYouTube,
    standardBurnIn,
    dynamic,
    speakerChanges,
    atmospherics,
    styledTextColor,
    styledOutlineColor,
    styledOutlineThickness,
    styledCaptionSize,
    styledCaptionFont,
    styledCaptionPosition,
    styledDownloadableSrt,
    styledBurnIn,
    dynamicTextColor,
    dynamicOutlineColor,
    dynamicOutlineThickness,
    dynamicCaptionSize,
    dynamicCaptionFont,
    dynamicCaptionPosition,
    dynamicHighlightColor,
    dynamicHighlightOutlineColor,
    dynamicHighlightOutlineThickness,
    dynamicHighlightSize,
    dynamicBurnIn,
  ],
  () => {
    emitOptions();
  }
);

function toggleOption(option, value) {
  if (option === "standardSrt") {
    standardSrt.value = value;
    burnIn.value = false;
    dynamic.value = false;
    if (!value) {
      downloadableSrt.value = false;
      grantYouTube.value = false;
      standardBurnIn.value = false;
    }
  } else if (option === "burnIn") {
    burnIn.value = value;
    standardSrt.value = false;
    dynamic.value = false;
    if (!value) {
      styledDownloadableSrt.value = false;
      styledBurnIn.value = false;
    }
  } else if (option === "dynamic") {
    dynamic.value = value;
    standardSrt.value = false;
    burnIn.value = false;
    if (value) {
      dynamicBurnIn.value = true; // Enforce Burn in when dynamic is on
    } else {
      dynamicBurnIn.value = false;
    }
  }
  emitOptions();
}

function toggleDownloadableSrt(value) {
  downloadableSrt.value = value;
  if (value) {
    grantYouTube.value = false;
    standardBurnIn.value = false;
  }
  emitOptions();
}

function toggleGrantYouTube(value) {
  grantYouTube.value = value;
  if (value) {
    downloadableSrt.value = false;
    standardBurnIn.value = false;
  }
  emitOptions();
}

function toggleStandardBurnIn(value) {
  standardBurnIn.value = value;
  if (value) {
    downloadableSrt.value = false;
    grantYouTube.value = false;
  }
  emitOptions();
}

function toggleStyledDownloadableSrt(value) {
  styledDownloadableSrt.value = value;
  if (value) {
    styledBurnIn.value = false;
  }
  emitOptions();
}

function toggleStyledBurnIn(value) {
  styledBurnIn.value = value;
  if (value) {
    styledDownloadableSrt.value = false;
  }
  emitOptions();
}

function updateStyledTextColor(value) {
  styledTextColor.value = value;
  emitOptions();
}

function updateStyledOutlineColor(value) {
  styledOutlineColor.value = value;
  emitOptions();
}

function updateStyledOutlineThickness(value) {
  styledOutlineThickness.value = value;
  emitOptions();
}

function updateStyledCaptionSize(value) {
  styledCaptionSize.value = value;
  emitOptions();
}

function updateStyledCaptionFont(value) {
  styledCaptionFont.value = value;
  emitOptions();
}

function updateStyledCaptionPosition(value) {
  styledCaptionPosition.value = value;
  emitOptions();
}

function updateDynamicTextColor(value) {
  dynamicTextColor.value = value;
  emitOptions();
}

function updateDynamicOutlineColor(value) {
  dynamicOutlineColor.value = value;
  emitOptions();
}

function updateDynamicOutlineThickness(value) {
  dynamicOutlineThickness.value = value;
  emitOptions();
}

function updateDynamicCaptionSize(value) {
  dynamicCaptionSize.value = value;
  emitOptions();
}

function updateDynamicCaptionFont(value) {
  dynamicCaptionFont.value = value;
  emitOptions();
}

function updateDynamicCaptionPosition(value) {
  dynamicCaptionPosition.value = value;
  emitOptions();
}

function updateDynamicHighlightColor(value) {
  dynamicHighlightColor.value = value;
  emitOptions();
}

function updateDynamicHighlightOutlineColor(value) {
  dynamicHighlightOutlineColor.value = value;
  emitOptions();
}

function updateDynamicHighlightOutlineThickness(value) {
  dynamicHighlightOutlineThickness.value = value;
  emitOptions();
}

function updateDynamicHighlightSize(value) {
  dynamicHighlightSize.value = value;
  emitOptions();
}

function updateSpeakerChanges(value) {
  speakerChanges.value = value;
  emitOptions();
}

function updateAtmospherics(value) {
  atmospherics.value = value;
  emitOptions();
}

function getCaptionType() {
  if (standardSrt.value) return "Standard Captions";
  if (burnIn.value) return "Styled Captions";
  if (dynamic.value) return "Dynamic Captions";
  return null;
}

function getContentDeliveryOptions() {
  if (standardSrt.value) {
    if (downloadableSrt.value) return "downloadableSrt";
    if (grantYouTube.value) return "grantYouTube";
    if (standardBurnIn.value) return "standardBurnIn";
  } else if (burnIn.value) {
    if (styledDownloadableSrt.value) return "styledDownloadableSrt";
    if (styledBurnIn.value) return "styledBurnIn";
  } else if (dynamic.value) {
    return "dynamicBurnIn"; // Always Burn in for Dynamic
  }
  return null;
}

function emitOptions() {
  const options = {
    captionType: getCaptionType(),
    contentDeliveryOptions: getContentDeliveryOptions(),
    speakerChanges: speakerChanges.value,
    atmospherics: atmospherics.value,
  };
  if (burnIn.value) {
    Object.assign(options, {
      textColor: styledTextColor.value,
      outlineColor: styledOutlineColor.value,
      outlineThickness: styledOutlineThickness.value,
      captionSize: styledCaptionSize.value,
      captionFont: styledCaptionFont.value,
      captionPosition: styledCaptionPosition.value,
    });
  } else if (dynamic.value) {
    Object.assign(options, {
      textColor: dynamicTextColor.value,
      outlineColor: dynamicOutlineColor.value,
      outlineThickness: dynamicOutlineThickness.value,
      captionSize: dynamicCaptionSize.value,
      captionFont: dynamicCaptionFont.value,
      captionPosition: dynamicCaptionPosition.value,
      highlightColor: dynamicHighlightColor.value,
      highlightOutlineColor: dynamicHighlightOutlineColor.value,
      highlightOutlineThickness: dynamicHighlightOutlineThickness.value,
      highlightSize: dynamicHighlightSize.value,
    });
  }
  emit("options-updated", options);
}

function resetOptions() {
  standardSrt.value = false;
  downloadableSrt.value = false;
  grantYouTube.value = false;
  standardBurnIn.value = false;
  burnIn.value = false;
  dynamic.value = false;
  speakerChanges.value = false;
  atmospherics.value = false;
  styledTextColor.value = "#ff6200";
  styledOutlineColor.value = "#000000";
  styledOutlineThickness.value = 1;
  styledCaptionSize.value = 22;
  styledCaptionFont.value = "Arial";
  styledCaptionPosition.value = 0;
  styledDownloadableSrt.value = false;
  styledBurnIn.value = false;
  dynamicTextColor.value = "#ffffff";
  dynamicOutlineColor.value = "#000000";
  dynamicOutlineThickness.value = 1;
  dynamicCaptionSize.value = 22;
  dynamicCaptionFont.value = "Arial";
  dynamicCaptionPosition.value = 0;
  dynamicHighlightColor.value = "#ff6200";
  dynamicHighlightOutlineColor.value = "#000000";
  dynamicHighlightOutlineThickness.value = 1;
  dynamicHighlightSize.value = 1.2;
  dynamicBurnIn.value = false;
  emitOptions();
}

defineExpose({ resetOptions });
</script>

<style scoped>
.selection-container {
  max-width: 500px;
  margin: 0 auto;
}
</style>
