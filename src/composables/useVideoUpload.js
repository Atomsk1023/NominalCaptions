import { ref } from "vue"; // Import the 'ref' function from the 'vue' library.
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage"; // Import specific functions from 'firebase/storage' to interact with Firebase Storage.
import { storage } from "../firebase"; // Import the Firebase storage instance from the '../firebase' module.

/**
 * useVideoUpload composable provides functionality to upload videos to Firebase Storage,
 * retrieve video durations, and generate video thumbnails.
 *
 * @returns {{
 *   uploadProgress: Ref<number>,
 *   uploadToFirebase: (file: File, onProgress: (progress: number) => void) => Promise<string>,
 *   getVideoDuration: (file: File) => Promise<number>,
 *   generateThumbnail: (file: File) => Promise<string | null>
 * }}
 */
export function useVideoUpload() {
  const uploadProgress = ref(0); // Create a reactive reference to track the upload progress.

  /**
   * Uploads a file to Firebase Storage and provides progress updates.
   *
   * @param {File} file - The file to upload.
   * @param {Function} onProgress - Callback function to receive progress updates.
   * @returns {Promise<string>} - A promise that resolves with the download URL of the uploaded file.
   */
  async function uploadToFirebase(file, onProgress) {
    const ref = storageRef(storage, `videos/${file.name}`); // Create a storage reference for the video file in Firebase Storage.
    const uploadTask = uploadBytesResumable(ref, file); // Start the upload task.

    return new Promise((resolve, reject) => {
      // Return a promise to handle the asynchronous upload process.
      let lastBytesTransferred = 0; // Initialize a variable to keep track of the last transferred bytes.

      uploadTask.on(
        // Attach event listeners to the upload task.
        "state_changed", // Listen for the 'state_changed' event.
        (snapshot) => {
          // Callback for progress updates.
          // Calculate the bytes transferred since the last update.
          const bytesTransferred =
            snapshot.bytesTransferred - lastBytesTransferred;
          // Update the last transferred bytes for the next calculation.
          lastBytesTransferred = snapshot.bytesTransferred;
          // Call the onProgress callback to update progress in the UI.
          onProgress(bytesTransferred);
        },
        (error) => reject(error), // Reject the promise if an error occurs during upload.
        async () => {
          // Callback for successful upload completion.
          const url = await getDownloadURL(uploadTask.snapshot.ref); // Get the download URL of the uploaded file.
          resolve(url); // Resolve the promise with the download URL.
        }
      );
    });
  }

  /**
   * Retrieves the duration of a video file.
   *
   * @param {File} file - The video file.
   * @returns {Promise<number>} - A promise that resolves with the duration of the video in minutes.
   */
  function getVideoDuration(file) {
    return new Promise((resolve) => {
      // Return a promise to handle the asynchronous metadata retrieval process.
      const video = document.createElement("video"); // Create a new HTML video element.
      video.preload = "metadata"; // Set the video preload attribute to 'metadata'.
      video.onloadedmetadata = () => resolve(video.duration / 60); // Resolve the promise with the video duration in minutes when metadata is loaded.
      video.onerror = () => resolve(0); // Resolve with 0 if an error occurs.
      video.src = URL.createObjectURL(file); // Set the video source to the provided file.
    });
  }

  function generateThumbnail(file) {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        video.currentTime = 1; // Set the current time of the video to 1 second.
      };
      video.onseeked = () => {
        canvas.width = video.videoWidth / 2; // Set the canvas width to half of the video width.
        canvas.height = video.videoHeight / 2; // Set the canvas height to half of the video height.
        const ctx = canvas.getContext("2d"); // Get the 2D rendering context of the canvas.
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height); // Draw the current frame of the video onto the canvas.
        resolve(canvas.toDataURL("image/jpeg")); // Resolve the promise with the thumbnail data URL in JPEG format.
      };
      video.onerror = () => resolve(null); // Resolve with null if an error occurs.
      video.src = URL.createObjectURL(file);
    });
  }

  return {
    uploadProgress,
    uploadToFirebase,
    getVideoDuration,
    generateThumbnail,
  };
} // Return an object with the functions and variables needed.
