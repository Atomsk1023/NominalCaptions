<script setup>
import { ref } from "vue";

// Define a ref for the contact email, which can be customized.
// The email is displayed in the contact section of the Terms of Service.
const contactEmail = ref("nominalcaptions@gmail.com"); // Customize
</script>

<template>
  <div class="terms-container">
    <h1>Terms of Service</h1>
    <p>Last updated: April 22, 2025</p>
    <h2>Acceptance of Terms</h2>
    <!-- Agreement to the Terms of Service -->
    <p>
      By using Nominal Captions ("Service"), you agree to these Terms of
      Service. If you do not agree, please do not use the Service.
    </p>
    <h2>Use of Service</h2>
    <p>
      Nominal Captions provides captioning services for videos, including
      uploading captions as .srt files to specific YouTube videos you select
      during checkout. You agree to use the Service only for lawful purposes and
      in accordance with these Terms.
    </p>
    <h2>YouTube Permissions</h2>
    <!-- Explanation of YouTube permissions -->
    <p>
      To upload captions to your YouTube videos, we require permission to access
      your YouTube account. This access is limited to uploading .srt files to
      the specific videos you designate. We do not manage, modify, or access
      other aspects of your YouTube account, such as playlists, channels, or
      other videos.
    </p>
    <h2>User Responsibilities</h2>
    <!-- List of user responsibilities -->
    <p>You are responsible for:</p>
    <ul>
      <li>
        Ensuring the accuracy and legality of videos and captions uploaded.
      </li>
      <li>Maintaining the security of your Google account credentials.</li>
      <li>
        Complying with YouTube’s Terms of Service and Community Guidelines.
      </li>
    </ul>
    <h2>Payment and Refunds</h2>
    <!-- Payment and refund terms -->
    <p>
      Payments for captioning services are processed through our payment
      provider. Refunds are subject to our refund policy, available upon
      request.
    </p>
    <h2>Limitation of Liability</h2>
    <p>
      <!-- Limitation of liability clause -->
      Nominal Captions is not liable for any indirect, incidental, or
      consequential damages arising from the use of the Service. The Service is
      provided "as is" without warranties of any kind.
    </p>
    <h2>Termination</h2>
    <p>
      We may terminate or suspend your access to the Service for violation of
      these Terms or for any reason at our discretion.
    </p>
    <h2>Contact</h2>
    <p>
      <!-- Contact information -->
      For questions, contact us at
      <a :href="`mailto:${contactEmail}`">{{ contactEmail }}</a
      >.
    </p>
  </div>
</template>

<style scoped>
/* Style for the terms container */
.terms-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* Style for the headers */
h1,
h2 {
  color: #333;
}

/* Style for the paragraphs */
p {
  line-height: 1.6;
}

ul {
  list-style-type: disc;
  padding-left: 20px;
  margin: 10px 0;
}

/* Style for the links */
a {
  color: #4285f4;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
