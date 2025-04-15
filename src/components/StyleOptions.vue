<!-- src/components/StyleOptions.vue -->
<template>
  <div
    class="left-options"
    :class="{ minimized: !isExpanded }"
    @click.stop="$emit('update:isExpanded', true)"
  >
    <div v-if="!isExpanded" class="minimized-content">
      <span>Options</span>
    </div>
    <div v-else class="expanded-content">
      <button
        class="minimize-button"
        @click.stop="$emit('update:isExpanded', false)"
      >
        x
      </button>
      <!-- Delivery Options -->
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
        <div v-if="captionType === 'Dynamic Captions'">
          <label>
            <input type="checkbox" :checked="dynamicBurnIn" disabled />
            Burn in (required)
          </label>
        </div>
      </div>

      <hr class="section-divider" />

      <!-- Additional Options -->
      <div class="additional-options">
        <h4>Additional Options</h4>
        <label>
          <input
            type="checkbox"
            :checked="speakerChanges"
            @change="emit('update:speakerChanges', $event.target.checked)"
          />
          Do Not Indicate Speaker Changes
        </label>
        <label>
          <input
            type="checkbox"
            :checked="atmospherics"
            @change="emit('update:atmospherics', $event.target.checked)"
          />
          Add Atmospherics
        </label>
      </div>
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
  speakerChanges: Boolean,
  atmospherics: Boolean,
  isExpanded: Boolean,
});

const emit = defineEmits([
  "update:downloadableSrt",
  "update:grantYouTube",
  "update:standardBurnIn",
  "update:styledDownloadableSrt",
  "update:styledBurnIn",
  "update:dynamicBurnIn",
  "update:speakerChanges",
  "update:atmospherics",
  "update:isExpanded",
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
.left-options {
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

.left-options.minimized {
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
  gap: 15px;
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

.delivery-options h4,
.additional-options h4 {
  margin: 0 0 10px;
  font-size: 14px;
}

.delivery-options label,
.additional-options label {
  display: block;
  margin-bottom: 5px;
  font-size: 13px;
}

.section-divider {
  border: 0;
  border-top: 1px solid #ccc;
  margin: 10px 0;
}
</style>
