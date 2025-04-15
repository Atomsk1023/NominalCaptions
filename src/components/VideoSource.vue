<!-- src/components/VideoSource.vue -->
<template>
  <div class="video-source-container">
    <div class="columns">
      <div class="youtube-column">
        <YouTubeInput @youtube-added="handleAddVideo" />
      </div>
      <div class="separator">
        <hr class="line" />
        <span class="or-text">OR</span>
        <hr class="line" />
      </div>
      <div class="upload-column">
        <VideoUpload @upload-complete="handleUploadComplete" />
      </div>
    </div>
  </div>
</template>

<script setup>
import YouTubeInput from "./YouTubeInput.vue";
import VideoUpload from "./VideoUpload.vue";

const emit = defineEmits(["add-video"]);

function handleAddVideo(videoData) {
  emit("add-video", videoData);
}

function handleUploadComplete(uploadedVideos) {
  uploadedVideos.forEach((videoData) => {
    emit("add-video", {
      ...videoData,
      source: "Upload",
      aspectRatio:
        videoData.width && videoData.height
          ? videoData.width / videoData.height
          : "16 / 9",
    });
  });
}
</script>

<style scoped>
.video-source-container {
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

.columns {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  align-items: center;
  justify-content: center;
}

.youtube-column,
.upload-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.separator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30px; /* Fixed width for separator */
}

.line {
  width: 100%;
  border: 0;
  border-top: 1px solid #ccc;
  transform: rotate(90deg); /* Vertical line */
}

.or-text {
  font-weight: bold;
  color: #666;
  font-size: 14px;
}
</style>
