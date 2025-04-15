// src/composables/useVideoUpload.js
import { ref } from "vue";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../firebase";

export function useVideoUpload() {
  const uploadProgress = ref(0);

  async function uploadToFirebase(file, onProgress) {
    const ref = storageRef(storage, `videos/${file.name}`);
    const uploadTask = uploadBytesResumable(ref, file);

    return new Promise((resolve, reject) => {
      let lastBytesTransferred = 0;

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const bytesTransferred =
            snapshot.bytesTransferred - lastBytesTransferred;
          lastBytesTransferred = snapshot.bytesTransferred;
          onProgress(bytesTransferred);
        },
        (error) => reject(error),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(url);
        }
      );
    });
  }

  function getVideoDuration(file) {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => resolve(video.duration / 60);
      video.onerror = () => resolve(0);
      video.src = URL.createObjectURL(file);
    });
  }

  function generateThumbnail(file) {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        video.currentTime = 1;
      };
      video.onseeked = () => {
        canvas.width = video.videoWidth / 2;
        canvas.height = video.videoHeight / 2;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg"));
      };
      video.onerror = () => resolve(null);
      video.src = URL.createObjectURL(file);
    });
  }

  return {
    uploadProgress,
    uploadToFirebase,
    getVideoDuration,
    generateThumbnail,
  };
}
