<!-- src/components/VideoUpload.vue -->
<template>
  <div class="upload-wrapper">
    <button
      class="upload-button"
      :class="{ 'drag-over': isDragging }"
      @dragover.prevent="handleDragOver"
      @dragleave.prevent="handleDragLeave"
      @drop.prevent="handleDrop"
      @click="triggerFileInput"
      :disabled="uploading"
    >
      <span v-if="!uploading">Upload File(s)</span>
      <div v-else class="progress-container">
        <div class="progress-wrapper">
          <progress :value="uploadProgress" max="100"></progress>
          <span class="progress-text">{{ uploadProgress }}%</span>
        </div>
        <span class="upload-speed">Speed: {{ uploadSpeed }} MB/s</span>
        <span class="time-remaining">ETA: {{ formattedTimeRemaining }}</span>
      </div>
    </button>
    <input
      type="file"
      ref="fileInput"
      @change="handleFileUpload"
      accept="video/*"
      multiple
      style="display: none"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebase";

const emit = defineEmits(["upload-complete"]);
const fileInput = ref(null);
const videoFiles = ref([]);
const uploadProgress = ref(0);
const uploading = ref(false);
const isDragging = ref(false);
const uploadSpeed = ref("0.00");
const timeRemaining = ref("Calculating...");

function triggerFileInput() {
  if (!uploading.value) {
    fileInput.value.click();
  }
}

function handleFileUpload(event) {
  videoFiles.value = Array.from(event.target.files);
  uploadFiles();
}

function handleDragOver() {
  if (!uploading.value) {
    isDragging.value = true;
  }
}

function handleDragLeave() {
  isDragging.value = false;
}

function handleDrop(event) {
  if (!uploading.value) {
    isDragging.value = false;
    videoFiles.value = Array.from(event.dataTransfer.files);
    uploadFiles();
  }
}

async function uploadFiles() {
  if (videoFiles.value.length === 0) return;
  uploading.value = true;
  uploadProgress.value = 0;
  timeRemaining.value = "Calculating...";

  const totalBytes = videoFiles.value.reduce((sum, file) => sum + file.size, 0);
  let totalBytesTransferred = 0;

  const uploadPromises = videoFiles.value.map((file) =>
    processFile(file, (bytes) => {
      totalBytesTransferred += bytes;
      uploadProgress.value = Math.round(
        (totalBytesTransferred / totalBytes) * 100
      );
    })
  );

  const orders = await Promise.all(uploadPromises);
  emit("upload-complete", orders);
  uploading.value = false;
  uploadProgress.value = 0;
  uploadSpeed.value = "0.00";
  timeRemaining.value = "Calculating...";
  fileInput.value.value = "";
}

async function processFile(file, onProgress) {
  const { duration, width, height } = await getVideoDurationAndSize(file);
  const thumbnail = await generateThumbnail(file);
  const videoUrl = await uploadToFirebase(file, onProgress);
  return {
    file: file.name,
    link: videoUrl,
    duration,
    thumbnail,
    width,
    height,
  };
}

async function uploadToFirebase(file, onProgress) {
  const ref = storageRef(storage, `videos/${file.name}`);
  const uploadTask = uploadBytesResumable(ref, file);
  let lastBytesTransferred = 0;
  let lastTimestamp = Date.now();

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        clearTimeout(snapshot._updateTimeout);
        snapshot._updateTimeout = setTimeout(() => {
          const bytesTransferred =
            snapshot.bytesTransferred - lastBytesTransferred;
          const currentTime = Date.now();
          const timeElapsed = (currentTime - lastTimestamp) / 1000;
          let speedMbps = 0;

          if (timeElapsed > 0) {
            const speedBytesPerSecond = bytesTransferred / timeElapsed;
            speedMbps = speedBytesPerSecond / (1024 * 1024);
            uploadSpeed.value = speedMbps.toFixed(2);
            const remainingBytes = file.size - snapshot.bytesTransferred;
            const remainingSeconds = remainingBytes / speedBytesPerSecond;
            timeRemaining.value = remainingSeconds;
          } else {
            uploadSpeed.value = "0.00";
            timeRemaining.value = "Calculating...";
          }

          lastBytesTransferred = snapshot.bytesTransferred;
          lastTimestamp = currentTime;
          onProgress(bytesTransferred);
        }, 100);
      },
      (error) => reject(error),
      async () => resolve(await getDownloadURL(uploadTask.snapshot.ref))
    );
  });
}

const formattedTimeRemaining = computed(() => {
  if (timeRemaining.value === "Calculating...") return "Calculating...";
  const seconds = Math.round(timeRemaining.value);
  if (!isFinite(seconds) || seconds <= 0) return "Almost done...";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
});

async function getVideoDurationAndSize(file) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      resolve({
        duration: video.duration / 60,
        width: video.videoWidth,
        height: video.videoHeight,
      });
      URL.revokeObjectURL(video.src);
    };
    video.onerror = () => resolve({ duration: 0, width: 0, height: 0 });
    video.src = URL.createObjectURL(file);
  });
}

async function generateThumbnail(file) {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    video.preload = "metadata";
    video.onloadedmetadata = () => {
      video.currentTime = 1;
    };
    video.onseeked = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg"));
      URL.revokeObjectURL(video.src);
    };
    video.onerror = () => resolve(null);
    video.src = URL.createObjectURL(file);
  });
}
</script>

<style scoped>
.upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
  font-family: Arial, sans-serif;
  color: white;
}

.upload-label {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.upload-button {
  padding: 10px 20px;
  background-color: #3a3a3a;
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  max-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.upload-button:hover:not(:disabled) {
  background-color: #707070;
}

.upload-button:disabled {
  background-color: #acacac;
  cursor: not-allowed;
}

.upload-button.drag-over {
  background-color: #dddddd;
  border: 2px dashed #707070;
}

.progress-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
}

.progress-wrapper {
  position: relative;
  width: 100%;
}

progress {
  width: 100%;
  height: 20px;
  border: none;
  background-color: #ffffff;
  border-radius: 5px;
  overflow: hidden;
}

progress::-webkit-progress-bar {
  background-color: #696969;
  border-radius: 5px;
}

progress::-webkit-progress-value {
  background-color: #3cff00;
  border-radius: 5px;
}

progress::-moz-progress-bar {
  background-color: #3cff00;
  border-radius: 5px;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.upload-speed,
.time-remaining {
  font-size: 12px;
  color: #fff;
  text-align: center;
}
</style>
