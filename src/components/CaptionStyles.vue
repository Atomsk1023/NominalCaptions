<!-- src/components/CaptionStyles.vue -->
<template>
  <div
    class="right-options"
    :class="{ minimized: !isExpanded }"
    @click.stop="$emit('update:isExpanded', true)"
  >
    <div v-if="!isExpanded" class="minimized-content">
      <span>Style</span>
    </div>
    <div v-else class="expanded-content">
      <button
        class="minimize-button"
        @click.stop="$emit('update:isExpanded', false)"
      >
        x
      </button>
      <div v-if="captionType === 'Styled Captions'">
        <h4>Style Options</h4>
        <label>
          Text Color:
          <input
            type="color"
            :value="styledTextColor"
            @input="emit('update:styledTextColor', $event.target.value)"
          />
        </label>
        <label>
          Outline Color:
          <input
            type="color"
            :value="styledOutlineColor"
            @input="emit('update:styledOutlineColor', $event.target.value)"
          />
        </label>
        <label>
          Outline Thickness:
          <input
            type="range"
            :value="styledOutlineThickness"
            min="0"
            max="5"
            step="0.1"
            @input="
              emit('update:styledOutlineThickness', Number($event.target.value))
            "
          />
          {{ styledOutlineThickness }}px
        </label>
        <label>
          Font Size:
          <input
            type="range"
            :value="styledCaptionSize"
            min="10"
            max="50"
            step="1"
            @input="
              emit('update:styledCaptionSize', Number($event.target.value))
            "
          />
          {{ styledCaptionSize }}px
        </label>
        <label>
          Font:
          <select
            :value="styledCaptionFont"
            @change="emit('update:styledCaptionFont', $event.target.value)"
          >
            <option value="Arial">Arial</option>
            <option value="Verdana">Verdana</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
          </select>
        </label>
        <label>
          Position:
          <input
            type="range"
            :value="styledCaptionPosition"
            min="0"
            max="100"
            step="1"
            @input="
              emit('update:styledCaptionPosition', Number($event.target.value))
            "
          />
          {{ styledCaptionPosition }}%
        </label>
      </div>
      <div v-if="captionType === 'Dynamic Captions'">
        <h4>Base Style Options</h4>
        <label>
          Text Color:
          <input
            type="color"
            :value="dynamicTextColor"
            @input="emit('update:dynamicTextColor', $event.target.value)"
          />
        </label>
        <label>
          Outline Color:
          <input
            type="color"
            :value="dynamicOutlineColor"
            @input="emit('update:dynamicOutlineColor', $event.target.value)"
          />
        </label>
        <label>
          Outline Thickness:
          <input
            type="range"
            :value="dynamicOutlineThickness"
            min="0"
            max="5"
            step="0.1"
            @input="
              emit(
                'update:dynamicOutlineThickness',
                Number($event.target.value)
              )
            "
          />
          {{ dynamicOutlineThickness }}px
        </label>
        <label>
          Font Size:
          <input
            type="range"
            :value="dynamicCaptionSize"
            min="10"
            max="50"
            step="1"
            @input="
              emit('update:dynamicCaptionSize', Number($event.target.value))
            "
          />
          {{ dynamicCaptionSize }}px
        </label>
        <label>
          Font:
          <select
            :value="dynamicCaptionFont"
            @change="emit('update:dynamicCaptionFont', $event.target.value)"
          >
            <option value="Arial">Arial</option>
            <option value="Verdana">Verdana</option>
            <option value="Times New Roman">Times New Roman</option>
            <option value="Comic Sans MS">Comic Sans MS</option>
          </select>
        </label>
        <label>
          Position:
          <input
            type="range"
            :value="dynamicCaptionPosition"
            min="0"
            max="100"
            step="1"
            @input="
              emit('update:dynamicCaptionPosition', Number($event.target.value))
            "
          />
          {{ dynamicCaptionPosition }}%
        </label>
        <hr class="section-divider" />
        <h4>Dynamic Style Options</h4>
        <label>
          Highlight Color:
          <input
            type="color"
            :value="dynamicHighlightColor"
            @input="emit('update:dynamicHighlightColor', $event.target.value)"
          />
        </label>
        <label>
          Highlight Outline Color:
          <input
            type="color"
            :value="dynamicHighlightOutlineColor"
            @input="
              emit('update:dynamicHighlightOutlineColor', $event.target.value)
            "
          />
        </label>
        <label>
          Highlight Outline Thickness:
          <input
            type="range"
            :value="dynamicHighlightOutlineThickness"
            min="0"
            max="5"
            step="0.1"
            @input="
              emit(
                'update:dynamicHighlightOutlineThickness',
                Number($event.target.value)
              )
            "
          />
          {{ dynamicHighlightOutlineThickness }}px
        </label>
        <label>
          Highlight Size:
          <input
            type="range"
            :value="dynamicHighlightSize"
            min="1"
            max="2"
            step="0.1"
            @input="
              emit('update:dynamicHighlightSize', Number($event.target.value))
            "
          />
          {{ dynamicHighlightSize }}x
        </label>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  captionType: String,
  styledTextColor: String,
  styledOutlineColor: String,
  styledOutlineThickness: Number,
  styledCaptionSize: Number,
  styledCaptionFont: String,
  styledCaptionPosition: Number,
  dynamicTextColor: String,
  dynamicOutlineColor: String,
  dynamicOutlineThickness: Number,
  dynamicCaptionSize: Number,
  dynamicCaptionFont: String,
  dynamicCaptionPosition: Number,
  dynamicHighlightColor: String,
  dynamicHighlightOutlineColor: String,
  dynamicHighlightOutlineThickness: Number,
  dynamicHighlightSize: Number,
  isExpanded: Boolean,
});

const emit = defineEmits([
  "update:styledTextColor",
  "update:styledOutlineColor",
  "update:styledOutlineThickness",
  "update:styledCaptionSize",
  "update:styledCaptionFont",
  "update:styledCaptionPosition",
  "update:dynamicTextColor",
  "update:dynamicOutlineColor",
  "update:dynamicOutlineThickness",
  "update:dynamicCaptionSize",
  "update:dynamicCaptionFont",
  "update:dynamicCaptionPosition",
  "update:dynamicHighlightColor",
  "update:dynamicHighlightOutlineColor",
  "update:dynamicHighlightOutlineThickness",
  "update:dynamicHighlightSize",
  "update:isExpanded",
]);
</script>

<style scoped>
.right-options {
  width: 150px;
  min-height: 100%;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 3px;
  transition: width 0.3s ease;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.right-options.minimized {
  width: 20px;
  cursor: pointer;
}

.minimized-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.minimized-content span {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 14px;
  color: #333;
}

.expanded-content {
  padding: 10px;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.minimize-button {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #000000;
}

.right-options h4 {
  margin: 0 0 10px;
  font-size: 14px;
}

.right-options label {
  display: block;
  margin-bottom: 10px;
  font-size: 13px;
}

.right-options input[type="color"],
.right-options input[type="range"],
.right-options select {
  margin-top: 5px;
}

.right-options input[type="range"] {
  width: 100%;
}

.section-divider {
  border: 0;
  border-top: 1px solid #ccc;
  margin: 10px 0;
}
</style>
