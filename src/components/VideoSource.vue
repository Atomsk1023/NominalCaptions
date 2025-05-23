<!-- src/components/VideoSource.vue -->
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

<!-- Script section -->
<script setup>
// Import the child components
import YouTubeInput from "./YouTubeInput.vue";
import VideoUpload from "./VideoUpload.vue";

// Define the events that this component can emit
const emit = defineEmits(["add-video"]);

// Function to handle the event when a new video is added from YouTube
function handleAddVideo(videoData) {
  // Emit the 'add-video' event with the video data received from the child component
  emit("add-video", videoData);
}

// Function to handle the event when a video upload is complete
function handleUploadComplete(uploadedVideos) {
  // Loop through all the videos uploaded
  uploadedVideos.forEach((videoData) => {
    // Emit the 'add-video' event with each video data, adding extra information.
    emit("add-video", {
      ...videoData, // Spread operator to keep the video data
      source: "Upload",
      aspectRatio:
        videoData.width && videoData.height
          ? videoData.width / videoData.height
          : "16 / 9",
    });
  });
}
</script>

<!-- Style section -->
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

/* Main container for the columns */
.columns {
  display: flex;
  flex-direction: row;
  align-items: stretch;
  align-items: center;
  justify-content: center;
}

/* Style for the YouTube and Upload columns */
.youtube-column,
.upload-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Style for the separator */
.separator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 30px; /* Fixed width for separator */
}

/* Style for the separator lines */
.line {
  width: 100%;
  border: 0;
  border-top: 1px solid #ccc;
  transform: rotate(90deg); /* Vertical line */
}
/* Style for the OR text */
.or-text {
  font-weight: bold;
  color: #666;
  font-size: 14px;
}
</style>
