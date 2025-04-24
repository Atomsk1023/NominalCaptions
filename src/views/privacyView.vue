<script setup>
import { ref } from "vue";

const contactEmail = ref("nominalcaptions@gmail.com"); // Customize
</script>

<template>
  <div class="privacy-container">
    <h1>Privacy Policy</h1>
    <p>Last updated: April 22, 2025</p>
    <h2>YouTube Permissions</h2>
    <p>
      Nominal Captions requests access to your YouTube account solely to upload
      captions (subtitles) as .srt files to specific videos you select during
      checkout. We do not manage, modify, or access any other aspects of your
      YouTube account, such as playlists, channels, other videos, or account
      settings.
    </p>
    <h2>Data Usage</h2>
    <p>
      We collect your Google account email and profile information for
      authentication. Video files and captions are stored securely in Firebase
      Storage and used only to provide captioning services.
    </p>
    <h2>Contact</h2>
    <p>
      For questions, contact us at
      <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a
      >.
    </p>
  </div>
</template>

<style scoped>
.privacy-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1,
h2 {
  color: #333;
}

p {
  line-height: 1.6;
}

a {
  color: #4285f4;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
