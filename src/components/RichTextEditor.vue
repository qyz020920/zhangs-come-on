<script setup>
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import ImageUploader from "quill-image-uploader";
import axios from "axios";
import http from "@/utils/http";

const toolbar = [
  [{ header: [1, 2, 3, 4] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ align: [] }],
  ["link", "image"],
];

const modules = {
  name: "imageUploader",
  module: ImageUploader,
  options: {
    upload: (file) => {
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("image", file);

        axios
          .post(http.IMAGE_UPLOAD_URL, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          .then((res) => {
            resolve(res.data.imageUrl);
          })
          .catch((err) => {
            reject("Upload failed");
          });
      });
    },
  },
};
</script>

<template>
  <QuillEditor :modules="modules" :toolbar="toolbar" contentType="html" />
</template>

<style>
.ql-container {
  min-height: 200px !important;
}
</style>
