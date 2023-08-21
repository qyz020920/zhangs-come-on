<script setup>
import { ref } from "vue";
import http from "@/utils/http";

const emit = defineEmits(["on-success"]);
const props = defineProps({
  imageUrl: { type: String },
});
const uploadUrl = http.IMAGE_UPLOAD_URL;
const header = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

const imageUrl = ref(props.imageUrl);

const handleSuccess = (response) => {
  imageUrl.value = response.imageUrl;
  emit("on-success", response.imageUrl);
};
</script>

<template>
  <el-upload
    class="image-uploader"
    :action="uploadUrl"
    name="image"
    :headers="header"
    :show-file-list="false"
    :on-success="handleSuccess"
  >
    <slot />
  </el-upload>
</template>

<style>
.image-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.image-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.image-uploader .uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  text-align: center;
}
</style>
