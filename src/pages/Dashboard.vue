<script setup>
import userApi from "@/requests/user";

import { ref } from "vue";

const userCountData = ref({
  all: 0,
  verified: 0,
  notVerified: 0,
});

userApi.getUsersCount().then((data) => {
  userCountData.value = data;
});
</script>

<template>
  <el-row>
    <el-col :span="8">
      <el-statistic title="用户数" :value="userCountData.all" />
    </el-col>
    <el-col :span="8">
      <el-statistic title="实名用户数" :value="userCountData.verified" />
    </el-col>
    <el-col :span="8">
      <el-statistic title="未实名用户数" :value="userCountData.notVerified" />
    </el-col>
  </el-row>
  <el-divider />
  <el-row :gutter="20">
    <el-col :span="6">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
          </div>
        </template>
        <div>一些统计信息</div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
          </div>
        </template>
        <div>一些统计信息</div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
          </div>
        </template>
        <div>一些统计信息</div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
          </div>
        </template>
        <div>一些统计信息</div>
      </el-card>
    </el-col>
  </el-row>
  <el-divider />
  <el-row :gutter="20">
    <el-col :span="6">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
          </div>
        </template>
        <div>一些统计信息</div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
          </div>
        </template>
        <div>一些统计信息</div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
          </div>
        </template>
        <div>一些统计信息</div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
          </div>
        </template>
        <div>一些统计信息</div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped>
.el-col {
  text-align: center;
}
</style>
