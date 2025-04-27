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
      @toggle-burn-in="toggleCaptionType('burnIn', $event)"
      @update:text-color="updateOption('styledOptions.textColor', $event)"
      @update:outline-color="updateOption('styledOptions.outlineColor', $event)"
      @update:outline-thickness="
        updateOption('styledOptions.outlineThickness', $event)
      "
      @update:caption-size="updateOption('styledOptions.captionSize', $event)"
      @update:caption-font="updateOption('styledOptions.captionFont', $event)"
      @update:caption-position="
        updateOption('styledOptions.captionPosition', $event)
      "
      @update:advanced-downloadable-srt="toggleStyledDownloadableSrt"
      @update:advanced-burn-in="updateOption('styledOptions.burnIn', $event)"
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
      @toggle-dynamic="toggleCaptionType('dynamic', $event)"
      @update:text-color="updateOption('dynamicOptions.textColor', $event)"
      @update:outline-color="
        updateOption('dynamicOptions.outlineColor', $event)
      "
      @update:outline-thickness="
        updateOption('dynamicOptions.outlineThickness', $event)
      "
      @update:caption-size="updateOption('dynamicOptions.captionSize', $event)"
      @update:caption-font="updateOption('dynamicOptions.captionFont', $event)"
      @update:caption-position="
        updateOption('dynamicOptions.captionPosition', $event)
      "
      @update:highlight-color="
        updateOption('dynamicOptions.highlightColor', $event)
      "
      @update:highlight-outline-color="
        updateOption('dynamicOptions.highlightOutlineColor', $event)
      "
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

// Emit custom event to parent component
const emit = defineEmits(["options-updated"]);

// Standard Captions options
const standardSrt = ref(false);
const downloadableSrt = ref(false);
const grantYouTube = ref(false);
const standardBurnIn = ref(false);

// Caption type options
const burnIn = ref(false);
const dynamic = ref(false);

// Additional options
const speakerChanges = ref(false);
const atmospherics = ref(false);

// Group Styled Captions options into an object
const styledOptions = ref({
  textColor: "#ff6200",
  outlineColor: "#000000",
  outlineThickness: 1,
  captionSize: 22,
  captionFont: "Arial",
  captionPosition: 0,
  downloadableSrt: false,
  burnIn: false,
});

// Group Dynamic Captions options into an object
const dynamicOptions = ref({
  textColor: "#ffffff",
  outlineColor: "#000000",
  outlineThickness: 1,
  captionSize: 22,
  captionFont: "Arial",
  captionPosition: 0,
  highlightColor: "#ff6200",
  highlightOutlineColor: "#000000",
  highlightOutlineThickness: 1,
  highlightSize: 1.2,
  burnIn: false, // Default false, set to true when dynamic is toggled
});

// Watch for changes in the main options to emit updated values
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
    styledOptions,
    dynamicOptions,
  ],
  () => {
    emitOptions(); // Emit options only when there is a change
  }
);

// Generic function to update any option value
function updateOption(optionPath, value) {
  const path = optionPath.split(".");
  let target = this;
  for (let i = 0; i < path.length - 1; i++) {
    target = target[path[i]];
  }
  target[path[path.length - 1]] = value;
  emitOptions();
}

// Function to toggle between different caption type, also handles dependencies
function toggleCaptionType(option, value) {
  standardSrt.value = false;
  burnIn.value = false;
  dynamic.value = false;
  if (option === "dynamic") {
    dynamicOptions.value.burnIn = value;
  }
  this[option] = value;
  emitOptions();
}

// Update the value of downloadableSrt and handle dependencies
function toggleDownloadableSrt(value) {
  downloadableSrt.value = value;
  if (value) {
    grantYouTube.value = false;
    standardBurnIn.value = false;
  }
  emitOptions();
}

// Update the value of grantYouTube and handle dependencies
function toggleGrantYouTube(value) {
  grantYouTube.value = value;
  if (value) {
    downloadableSrt.value = false;
    standardBurnIn.value = false;
  }
  emitOptions();
}

// Update the value of standardBurnIn and handle dependencies
function toggleStandardBurnIn(value) {
  standardBurnIn.value = value;
  if (value) {
    downloadableSrt.value = false;
    grantYouTube.value = false;
  }
  emitOptions();
}
// Update the value of styledDownloadableSrt and handle dependencies
function toggleStyledDownloadableSrt(value) {
  styledOptions.value.downloadableSrt = value;
  if (value) {
    styledOptions.value.burnIn = false;
  }
  emitOptions();
}
// Update the value of styledBurnIn and handle dependencies

function updateDynamicHighlightOutlineThickness(value) {
  dynamicOptions.value.highlightOutlineThickness = value;
  emitOptions();
}
function updateDynamicHighlightSize(value) {
  dynamicOptions.value.highlightSize = value;
  emitOptions();
}

function updateSpeakerChanges(value) {
  speakerChanges.value = value;
  emitOptions();
}

// Update the value of atmospherics
function updateAtmospherics(value) {
  atmospherics.value = value;
  emitOptions();
}

function getCaptionType() {
  if (standardSrt.value) return "Standard Captions";
  return burnIn.value
    ? "Styled Captions"
    : dynamic.value
    ? "Dynamic Captions"
    : null;
}

function getContentDeliveryOptions() {
  if (standardSrt.value)
    return downloadableSrt.value
      ? "downloadableSrt"
      : grantYouTube.value
      ? "grantYouTube"
      : standardBurnIn.value
      ? "standardBurnIn"
      : null;
  if (burnIn.value)
    return styledOptions.value.downloadableSrt
      ? "styledDownloadableSrt"
      : styledOptions.value.burnIn
      ? "styledBurnIn"
      : null;
  return dynamic.value ? "dynamicBurnIn" : null; // Always Burn in for Dynamic
}

// Function that emits the options data to the parent component
function emitOptions() {
  const options = {
    captionType: getCaptionType(),
    contentDeliveryOptions: getContentDeliveryOptions(),
    speakerChanges: speakerChanges.value,
    atmospherics: atmospherics.value,
  };
  if (burnIn.value) Object.assign(options, styledOptions.value);
  if (dynamic.value) {
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
// Resets all values to its defaults

function resetOptions() {
  standardSrt.value = false;
  downloadableSrt.value = false;
  grantYouTube.value = false;
  standardBurnIn.value = false;
  burnIn.value = false;
  dynamic.value = false;
  speakerChanges.value = false;
  atmospherics.value = false;
  styledOptions.value = {
    textColor: "#ff6200",
    outlineColor: "#000000",
    outlineThickness: 1,
    captionSize: 22,
    captionFont: "Arial",
    captionPosition: 0,
    downloadableSrt: false,
    burnIn: false,
  };
  dynamicOptions.value = {
    textColor: "#ffffff",
    outlineColor: "#000000",
    outlineThickness: 1,
    captionSize: 22,
    captionFont: "Arial",
    captionPosition: 0,
    highlightColor: "#ff6200",
    highlightOutlineColor: "#000000",
    highlightOutlineThickness: 1,
    highlightSize: 1.2,
    burnIn: false,
  };
  emitOptions();
}
// Expose public function

defineExpose({ resetOptions });
</script>

<style scoped>
.selection-container {
  max-width: 500px;
  margin: 0 auto;
}
</style>
