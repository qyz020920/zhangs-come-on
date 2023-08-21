<script setup>
import PageHeader from "@/components/PageHeader.vue";
import user from "@/requests/user";
import { ref } from "vue";

const tableData = ref([]);

function fetchAll() {
  user.getIdentityUpdateApplies().then((data) => {
    console.log(data);
    tableData.value = data.rows;
  });
}

function onApproved(id, status) {
  user.updateIdentityUpdateApplies(id, status, "update").then(() => {
    fetchAll();
  });
}

fetchAll();
</script>

<template>
  <page-header>信息更正申请</page-header>
  <el-table :data="tableData" size="large" stripe cell-class-name="monospace">
    <el-table-column prop="id" label="ID" width="100" />
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="identityNum" label="证件" width="200" />
    <el-table-column prop="reason" label="原因" />
    <el-table-column prop="status" label="状态" />
    <el-table-column prop="createdAt" label="申请时间" width="200" />
    <el-table-column label="操作" width="200">
      <template #default="scope">
        <el-button size="small" type="success" @click="onApproved(scope.row.id, 'APPROVED')">通过</el-button>
        <el-button size="small" type="danger" @click="onApproved(scope.row.id, 'REJECTED')">驳回</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
