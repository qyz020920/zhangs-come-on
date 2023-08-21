<script setup>
import PageHeader from "@/components/PageHeader.vue";
import user from "@/requests/user";
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const tableData = ref([]);
let totalCount = ref({
  all: 0,
  verified: 0,
  notVerified: 0,
});
const currentPage = ref(1);
const verified = ref("all");

watch(verified, (newVal, oldVal) => {
  currentChange(currentPage.value);
});

function setTableData(_tableData) {
  tableData.value = _tableData;
}

function loadCount() {
  user.getUsersCount().then((countData) => {
    totalCount.value = countData;
  });
}

function currentChange(page) {
  currentPage.value = page;
  user
    .getUsers({
      page: page,
      limit: 10,
      verified: verified.value,
    })
    .then((data) => setTableData(data.rows));
}

function gotoDetail(id) {
  router.push(`/users/${id}`);
}

loadCount();
currentChange(currentPage.value);
</script>

<template>
  <page-header> {{ route.meta.title }} </page-header>
  <div>
    <el-radio-group v-model="verified" size="large">
      <el-radio-button label="all"> 所有({{ totalCount.all }}) </el-radio-button>
      <el-radio-button label="verified"> 已认证({{ totalCount.verified }}) </el-radio-button>
      <el-radio-button label="notVerified"> 未认证({{ totalCount.notVerified }}) </el-radio-button>
    </el-radio-group>
  </div>
  <el-divider />
  <el-table :data="tableData" size="large" stripe cell-class-name="monospace">
    <el-table-column prop="id" label="ID" width="100" />
    <el-table-column prop="name" label="名称" width="120" />
    <el-table-column prop="phone" label="手机号" width="150" />
    <el-table-column prop="identityNum" label="证件" width="200" />
    <el-table-column prop="wxName" label="昵称" />
    <el-table-column prop="createdAt" label="创建日期" width="240" />
    <el-table-column label="操作" width="200">
      <template #default="scope">
        <el-button size="small" type="primary" @click="gotoDetail(scope.row.id)">献血记录</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-wrapper">
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount[verified]"
      @current-change="currentChange"
    />
  </div>
</template>

<style>
.pagination-wrapper {
  margin-top: 25px;
  text-align: right;
}
</style>
