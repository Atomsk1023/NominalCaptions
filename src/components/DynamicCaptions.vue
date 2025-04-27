<template>
  <!-- Main container for Dynamic Captions -->
  <div class="dynamic-container" :class="{ selected: dynamic }">
    <!-- Main option to toggle Dynamic Captions -->
    <label class="main-option">
      <input
        type="checkbox"
        :checked="dynamic"
        @change="$emit('toggle-dynamic', $event.target.checked)"
      />
      Dynamic Captions
    </label>

    <!-- Sub-options container (visible only when dynamic is checked) -->
    <div v-if="dynamic" class="sub-options">
      <h4>Base style options</h4>
      <div class="style-grid">
        <!-- Row 1 -->
        <div class="style-item">
          <label class="style-label">Caption color</label>
          <input
            type="color"
            :value="textColor"
            @input="$emit('update:text-color', $event.target.value)"
          />
        </div>
        <div class="style-item">
          <label class="style-label">Outline color</label>
          <input
            type="color"
            :value="outlineColor"
            @input="$emit('update:outline-color', $event.target.value)"
          />
        </div>
        <!-- Row 2 -->
        <div class="style-item">
          <label class="style-label">Caption size</label>
          <div class="size-options">
            <input
              type="range"
              :value="captionSize"
              min="20"
              max="50"
              step="1"
              @input="$emit('update:caption-size', Number($event.target.value))"
            />
            <span>{{ captionSize }}px</span>
          </div>
        </div>
        <div class="style-item">
          <label class="style-label">Outline thickness</label>
          <div class="thickness-options">
            <input
              type="range"
              :value="outlineThickness"
              min="0"
              max="5"
              step="0.5"
              @input="
                $emit('update:outline-thickness', Number($event.target.value))
              "
            />
            <span>{{ outlineThickness }}px</span>
          </div>
        </div>
        <!-- Row 3 -->
        <div class="style-item">
          <label class="style-label">Caption font</label>
          <select
            :value="captionFont"
            @change="$emit('update:caption-font', $event.target.value)"
          >
            <option value="Arial">Arial</option>
            <option value="Verdana">Verdana</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
          </select>
        </div>
        <div class="style-item position-item">
          <div class="position-options">
            <label class="style-label">Caption position</label>
            <input
              type="range"
              :value="captionPosition"
              min="0"
              max="100"
              orient="vertical"
              @input="
                $emit('update:caption-position', Number($event.target.value))
              "
            />
            <span>{{ positionLabel }}</span>
          </div>
        </div>
      </div>
      <hr class="section-divider" />
      <h4>Dynamic style options</h4>
      <div class="dynamic-columns">
        <div class="dynamic-column">
          <div class="dynamic-option">
            <label class="style-label">Highlight color</label>
            <input
              type="color"
              :value="highlightColor"
              @input="$emit('update:highlight-color', $event.target.value)"
            />
          </div>
          <div class="dynamic-option">
            <label class="style-label">Highlight size</label>
            <div class="size-options">
              <input
                type="range"
                :value="highlightSize"
                min="1"
                max="2"
                step="0.1"
                @input="
                  $emit('update:highlight-size', Number($event.target.value))
                "
              />
              <span>{{ highlightSize }}x</span>
            </div>
          </div>
        </div>
        <div class="dynamic-column">
          <div class="dynamic-option">
            <label class="style-label">Highlight outline color</label>
            <input
              type="color"
              :value="highlightOutlineColor"
              @input="
                $emit('update:highlight-outline-color', $event.target.value)
              "
            />
          </div>
        </div>
        <div class="dynamic-option">
          <label class="style-label">Highlight outline thickness</label>
          <div class="thickness-options">
            <input
              type="range"
              :value="highlightOutlineThickness"
              min="0"
              max="5"
              step="1"
              @input="$emit(
                    'update:highlight-outline-thickness', Number($event.target.value)
                "
            />
            <span>{{ highlightOutlineThickness }}px</span>
          </div>
        </div>
      </div>
    </div>
    <hr class="section-divider" />
    <h4>Content delivery options</h4>
    <div class="delivery-columns">
      <div class="column">
        <div class="row tooltip-row">
          <span class="tooltip">
            ?
            <span class="tooltip-text"
              >Burn-in is required for dynamic captions</span
            >
          </span>
        </div>
        <div class="row label-row">
          <label class="column-label">Burn in</label>
        </div>
        <div class="row checkbox-row">
          <input type="checkbox" :checked="true" disabled />
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Script setup for DynamicCaptions component -->
<script setup>
import { computed } from "vue";

const props = defineProps({
  // Props for basic caption style options
  dynamic: Boolean,
  textColor: String,
  outlineColor: String,
  outlineThickness: Number,
  captionSize: Number,
  captionFont: String,
  captionPosition: Number,
  // Props for dynamic style options
  highlightColor: String,
  highlightOutlineColor: String,
  highlightOutlineThickness: Number,
  highlightSize: Number,
  // Props for content delivery options
  dynamicDownloadableSrt: Boolean,
  dynamicBurnIn: Boolean,
  // Events emitted by this component
});
defineEmits([
  "toggle-dynamic",
  "update:text-color",
  "update:outline-color",
  "update:outline-thickness",
  "update:caption-size",
  "update:caption-font",
  "update:caption-position",
  "update:highlight-color",
  "update:highlight-outline-color",
  "update:highlight-outline-thickness",
  "update:highlight-size",
  "update:dynamic-downloadable-srt",
  "update:dynamic-burn-in",
]);

// Computed property to determine the label for caption position
const positionLabel = computed(() => {
  if (props.captionPosition === 0) return "Bottom";
  if (props.captionPosition === 100) return "Top";
  return `${props.captionPosition}%`;
});
</script>

<!-- Styling for DynamicCaptions component -->
<style scoped>
.dynamic-container {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  background-color: #f5f5f5;
  margin-bottom: 15px;
}

.dynamic-container.selected {
  border-width: 3px;
}

.main-option {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.sub-options {
  padding: 10px 0;
}

.sub-options h4 {
  font-size: 14px;
  margin: 0 0 10px 0;
  text-align: center;
}

.style-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
}

.style-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.position-item {
  padding: 5px;
}

.style-label {
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 5px;
  margin-top: 10px;
}

input[type="color"] {
  width: 50px;
  height: 50px;
  padding: 0;
  border: 2px solid #bbb;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2),
    -1px -1px 2px rgba(255, 255, 255, 0.6);
  cursor: pointer;
  margin-top: 5px;
  background-clip: content-box;
}

.thickness-options,
.size-options,
.position-options {
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 5px;
}

.thickness-options input[type="range"],
.size-options input[type="range"] {
  width: 100px;
}

.position-options {
  flex-direction: row;
  justify-content: center;
  gap: 5px;
}

.position-options input[type="range"] {
  -webkit-appearance: slider-vertical;
  writing-mode: bt-lr;
  height: 80px;
  width: 20px;
  margin: 0;
}

.thickness-options span,
.size-options span,
.position-options span {
  font-size: 12px;
}

select {
  width: 120px;
  padding: 5px;
  margin-top: 5px;
  font-size: 14px;
}

.section-divider {
  border: 0;
  border-top: 1px solid #ccc;
  margin: 15px 0;
}

.dynamic-columns {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 10px;
}

.dynamic-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.dynamic-column:not(:last-child) {
  border-right: 1px solid #ccc;
}

.dynamic-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.delivery-columns {
  display: flex;
  justify-content: center;
  gap: 10px;
}

.column {
  flex: 0 1 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.row {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 20px;
}

.tooltip-row {
  margin-bottom: 2px;
}

.label-row {
  margin-bottom: 2px;
}

.checkbox-row {
  margin-bottom: 0;
}

.column-label {
  font-size: 14px;
  text-align: center;
}

.column input[type="checkbox"] {
  margin: 0;
}

.column input[type="checkbox"]:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.tooltip {
  position: relative;
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #999;
  color: #fff;
  text-align: center;
  font-size: 10px;
  line-height: 14px;
  cursor: help;
}

.tooltip .tooltip-text {
  visibility: hidden;
  width: 200px;
  background-color: #333;
  color: #fff;
  text-align: center;
  border-radius: 4px;
  padding: 5px;
  position: absolute;
  z-index: 1;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  opacity: 0;
  transition: opacity 0.2s;
}

.tooltip:hover .tooltip-text {
  visibility: visible;
  opacity: 1;
}
</style>
