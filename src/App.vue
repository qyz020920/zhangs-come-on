<script setup>
import HeaderMenu from "@/components/HeaderMenu.vue";
import SideBar from "@/components/SideBar.vue";
import { useRoute } from "vue-router";

const route = useRoute();
</script>

<template>
  <el-container>
    <el-header class="header">
      <el-affix position="top" :offset="0">
        <header-menu />
      </el-affix>
    </el-header>
    <el-container>
      <el-affix position="top" :offset="60" v-if="!route.meta.loginLayout">
        <side-bar />
      </el-affix>
      <el-main>
        <router-view :key="route.fullPath" />
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.header {
  padding: 0;
}
</style>
