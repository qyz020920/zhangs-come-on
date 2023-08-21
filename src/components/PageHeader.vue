<script setup>
const props = defineProps({
  title: { type: String },
});
</script>

<template>
  <div class="page-header">
    <slot />
    <el-divider />
  </div>
</template>

<style scoped>
.page-header {
  font-size: large;
  font-weight: bold;
}
</style>
