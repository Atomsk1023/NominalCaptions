<template>
  <div class="srt-container" :class="{ selected: standardSrt }">
    <label class="main-option">
      <input
        type="checkbox"
        :checked="standardSrt"
        @change="$emit('toggle-standard-srt', $event.target.checked)"
      />
      Standard Captions
    </label>
    <div v-if="standardSrt" class="sub-options">
      <h4>Content delivery options</h4>
      <div class="delivery-columns">
        <div class="column">
          <div class="row tooltip-row">
            <span class="tooltip">
              ?
              <span class="tooltip-text"
                >Receive downloadable .srt file upon completion</span
              >
            </span>
          </div>
          <div class="row label-row">
            <label class="column-label">Downloadable .srt file</label>
          </div>
          <div class="row checkbox-row">
            <input
              type="checkbox"
              :checked="downloadableSrt"
              @input="$emit('update:downloadable-srt', $event.target.checked)"
            />
          </div>
        </div>
        <div class="column">
          <div class="row tooltip-row">
            <span class="tooltip">
              ?
              <span class="tooltip-text"
                >You will be prompted to allow NominalCaptions access to update
                subtitles for the selected video(s) on your YouTube
                account</span
              >
            </span>
          </div>
          <div class="row label-row">
            <label class="column-label">Automatically add to YouTube</label>
          </div>
          <div class="row checkbox-row">
            <input
              type="checkbox"
              :checked="grantYouTube"
              @input="$emit('update:grant-you-tube', $event.target.checked)"
            />
          </div>
        </div>
        <div class="column">
          <div class="row tooltip-row">
            <span class="tooltip">
              ?
              <span class="tooltip-text"
                >Please note, only available for uploaded videos</span
              >
            </span>
          </div>
          <div class="row label-row">
            <label class="column-label">Burn in</label>
          </div>
          <div class="row checkbox-row">
            <input
              type="checkbox"
              :checked="standardBurnIn"
              @input="$emit('update:standard-burn-in', $event.target.checked)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  standardSrt: Boolean,
  downloadableSrt: Boolean,
  grantYouTube: Boolean,
  standardBurnIn: Boolean,
});
defineEmits([
  "toggle-standard-srt",
  "update:downloadable-srt",
  "update:grant-you-tube",
  "update:standard-burn-in",
]);
</script>

<style scoped>
.srt-container {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  background-color: #f5f5f5;
  margin-bottom: 15px;
}

.srt-container.selected {
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

.delivery-columns {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

.column:not(:last-child) {
  border-right: 1px solid #ccc;
}

.row {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 30px;
}

.tooltip-row {
  margin-bottom: 5px;
}

.label-row {
  margin-bottom: 5px;
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
