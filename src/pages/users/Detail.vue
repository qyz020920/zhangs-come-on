<script setup>
import PageHeader from "@/components/PageHeader.vue";
import donationRecordsApi from "@/requests/donation-records";
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const tableData = ref([]);

donationRecordsApi.getAll(route.params.id).then((data) => {
  tableData.value = data.rows;
});
</script>

<template>
  <page-header>{{ route.params.id }} 的献血记录，共（{{ tableData.length }}）条</page-header>
  <el-table :data="tableData" size="large" stripe cell-class-name="monospace">
    <el-table-column type="expand">
      <template #default="props">
        <div m="4">
          <p m="t-0 b-2">userId: {{ props.row.userId }}</p>
          <p m="t-0 b-2">placeId: {{ props.row.placeId }}</p>
          <p m="t-0 b-2">placeName: {{ props.row.placeName }}</p>
          <p m="t-0 b-2">result: {{ props.row.result }}</p>
          <p m="t-0 b-2">createdAt: {{ props.row.createdAt }}</p>
          <p m="t-0 b-2">updatedAt: {{ props.row.updatedAt }}</p>
        </div>
      </template>
    </el-table-column>
    <el-table-column prop="id" label="ID" width="100" />
    <el-table-column prop="donateDate" label="献血时间" />
    <el-table-column prop="stationCode" label="血站" width="100" />
    <el-table-column prop="kind" label="类型" width="100" />
    <el-table-column prop="volume" label="量" width="100" />
    <el-table-column prop="bloodType" label="血型" width="100" />
    <el-table-column prop="createdAt" label="创建时间" width="200" />
  </el-table>
</template>
