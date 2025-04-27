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
      ></button>
      <div v-if="captionType === 'Styled Captions'">
        <component
          v-for="option in styledOptions"
          :key="option.label"
          :is="option.component"
          v-bind="option.props"
          @update:value="$emit(option.emit, $event)"
        />
      </div>

      <div v-if="captionType === 'Dynamic Captions'">
        <component
          v-for="option in dynamicOptions"
          :key="option.label"
          :is="option.component"
          v-bind="option.props"
          @update:value="$emit(option.emit, $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import StyleOption from "./StyleOptions.vue";
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

defineEmits([
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
<script>
export default {
  setup(props) {
    const styledOptions = [
      {
        label: "Text Color",
        component: StyleOption,
        props: {
          type: "color",
          label: "Text Color",
          value: props.styledTextColor,
        },
        emit: "update:styledTextColor",
      },
      {
        label: "Outline Color",
        component: StyleOption,
        props: {
          type: "color",
          label: "Outline Color",
          value: props.styledOutlineColor,
        },
        emit: "update:styledOutlineColor",
      },
      {
        label: "Outline Thickness",
        component: StyleOption,
        props: {
          type: "range",
          label: "Outline Thickness",
          value: props.styledOutlineThickness,
          min: 0,
          max: 5,
          step: 0.1,
          unit: "px",
        },
        emit: "update:styledOutlineThickness",
      },
      {
        label: "Font Size",
        component: StyleOption,
        props: {
          type: "range",
          label: "Font Size",
          value: props.styledCaptionSize,
          min: 10,
          max: 50,
          step: 1,
          unit: "px",
        },
        emit: "update:styledCaptionSize",
      },
      {
        label: "Font",
        component: StyleOption,
        props: {
          type: "select",
          label: "Font",
          value: props.styledCaptionFont,
          options: ["Arial", "Verdana", "Times New Roman", "Comic Sans MS"],
        },
        emit: "update:styledCaptionFont",
      },
      {
        label: "Position",
        component: StyleOption,
        props: {
          type: "range",
          label: "Position",
          value: props.styledCaptionPosition,
          min: 0,
          max: 100,
          step: 1,
          unit: "%",
        },
        emit: "update:styledCaptionPosition",
      },
    ];

    const dynamicOptions = [
      {
        label: "Highlight Color",
        component: StyleOption,
        props: {
          type: "color",
          label: "Highlight Color",
          value: props.dynamicHighlightColor,
        },
        emit: "update:dynamicHighlightColor",
      },
      {
        label: "Highlight Outline Color",
        component: StyleOption,
        props: {
          type: "color",
          label: "Highlight Outline Color",
          value: props.dynamicHighlightOutlineColor,
        },
        emit: "update:dynamicHighlightOutlineColor",
      },
      {
        label: "Highlight Outline Thickness",
        component: StyleOption,
        props: {
          type: "range",
          label: "Highlight Outline Thickness",
          value: props.dynamicHighlightOutlineThickness,
          min: 0,
          max: 5,
          step: 0.1,
          unit: "px",
        },
        emit: "update:dynamicHighlightOutlineThickness",
      },
      {
        label: "Highlight Size",
        component: StyleOption,
        props: {
          type: "range",
          label: "Highlight Size",
          value: props.dynamicHighlightSize,
          min: 1,
          max: 2,
          step: 0.1,
          unit: "x",
        },
        emit: "update:dynamicHighlightSize",
      },
    ];
    return { styledOptions, dynamicOptions };
  },
};
</script>
<style scoped>
.right-options {
  width: 160px;
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
