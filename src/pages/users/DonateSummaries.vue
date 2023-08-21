<script setup>
import PageHeader from "@/components/PageHeader.vue";
import user from "@/requests/user";
import { ref } from "vue";

const tableData = ref([]);

user.getDonateSummaries().then((data) => (tableData.value = data.rows));
</script>

<template>
  <page-header>献血数据</page-header>
  <el-table :data="tableData" size="large" stripe cell-class-name="monospace">
    <el-table-column prop="id" label="ID" width="100" />
    <el-table-column prop="userId" label="用户" />
    <el-table-column prop="stationId" label="血站" width="100" />
    <el-table-column prop="donorCount" label="次数" width="100" />
    <el-table-column prop="donorVolume" label="量" width="100" />
    <el-table-column prop="updatedAt" label="更新日期" width="200" />
    <el-table-column label="操作" width="200">
      <template #default="scope">
        <el-button size="small" type="primary">查看</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
