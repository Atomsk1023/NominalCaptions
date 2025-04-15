<!-- src/components/YouTubeInput.vue -->
<template>
  <div class="youtube-input">
    <div class="input-group">
      <input
        id="youtube-url"
        type="text"
        v-model="youtubeLink"
        placeholder="Add YouTube link"
        @paste="handleYouTubePaste"
        @input="handleInput"
        :disabled="isLoading"
      />
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const emit = defineEmits(["youtube-added"]);
const youtubeLink = ref("");
const isLoading = ref(false);
const error = ref("");
let submitTimeout = null;
let inputTimeout = null;

async function handleYouTubePaste() {
  setTimeout(() => {
    processYouTubeLink();
  }, 0);
}

function handleInput() {
  clearError();
  clearTimeout(inputTimeout);
  inputTimeout = setTimeout(() => {
    processYouTubeLink();
  }, 500); // Debounce 500ms
}

async function processYouTubeLink() {
  if (!youtubeLink.value || isLoading.value) return;
  clearTimeout(submitTimeout);
  submitTimeout = setTimeout(async () => {
    isLoading.value = true;
    try {
      const trimmedLink = youtubeLink.value.trim();
      const videoId = extractYouTubeVideoId(trimmedLink);
      if (!videoId) throw new Error("Invalid YouTube URL");
      const { duration, title } = await getYouTubeDetails(videoId);
      const thumbnail = getYouTubeThumbnail(videoId);
      emit("youtube-added", {
        file: title,
        link: trimmedLink,
        duration,
        thumbnail,
        source: "YouTube",
      });
      youtubeLink.value = "";
      error.value = "";
    } catch (error) {
      console.error("Error:", error);
      error.value = error.message || "Failed to add video";
    } finally {
      isLoading.value = false;
    }
  }, 300); // Debounce API call
}

function clearError() {
  error.value = "";
}

async function getYouTubeDetails(videoId) {
  const response = await axios.get(
    "https://www.googleapis.com/youtube/v3/videos",
    {
      params: {
        id: videoId,
        part: "contentDetails,snippet",
        key: process.env.VUE_APP_YOUTUBE_API_KEY,
      },
    }
  );
  const item = response.data.items[0];
  if (!item) throw new Error("Video not found");
  return {
    duration: parseYouTubeDuration(item.contentDetails.duration) / 60,
    title: item.snippet.title,
  };
}

function parseYouTubeDuration(duration) {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;
  return hours * 3600 + minutes * 60 + seconds;
}

function getYouTubeThumbnail(videoId) {
  return `https://img.youtube.com/vi/${videoId}/0.jpg`;
}

function extractYouTubeVideoId(url) {
  const regex =
    /(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|live\/)|youtu\.be\/)([^"&?/s]{11})/i;
  const match = url.match(regex);
  if (match && match[1]) return match[1];

  const fallbackRegex = /(?:youtube\.com.*|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const fallbackMatch = url.match(fallbackRegex);
  return fallbackMatch ? fallbackMatch[1] : null;
}
</script>

<style scoped>
.youtube-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-family: Arial, sans-serif;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

input[type="text"] {
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

input[type="text"]:focus {
  border-color: #007bff;
  outline: none;
}

input[type="text"]:disabled {
  background-color: #e9e9e9;
  cursor: not-allowed;
}

.error {
  color: #d9534f;
  font-size: 14px;
  margin: 5px 0 0;
}
</style>
