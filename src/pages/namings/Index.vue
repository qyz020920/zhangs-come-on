<script setup>
import { SuccessFilled, CircleCloseFilled, QuestionFilled } from "@element-plus/icons-vue";
import PageHeader from "@/components/PageHeader.vue";
import namingsApi from "@/requests/namings";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const tableData = ref([]);
const totalCount = ref(0);
const currentPage = ref(1);
const approved = ref();
const showFormModal = ref(false);
const selectedNaming = ref({});

watch(approved, (newVal, oldVal) => {
  currentChange(currentPage.value);
});

function fetchNamings(page) {
  const params = { type: route.query.type, page, limit: 10 };
  if (approved.value != undefined) {
    params.approved = approved.value;
  }
  namingsApi.getNamings(params).then((data) => {
    tableData.value = data.rows;
    totalCount.value = data.count;
  });
}

function onApproved(id, approved = 1) {
  namingsApi.approve(id, approved).then(() => {
    currentChange(currentPage.value);
  });
}

function currentChange(page) {
  currentPage.value = page;
  fetchNamings(page);
}

function showDetail(id) {
  showFormModal.value = true;
  namingsApi.getNaming(id).then((naming) => {
    selectedNaming.value = naming;
  });
}

currentChange(currentPage.value);
</script>

<template>
  <page-header>
    <el-row class="row-bg">
      <el-col :span="12">
        {{ route.query.title }}
      </el-col>
    </el-row>
  </page-header>
  <div>
    <el-radio-group v-model="approved" size="large">
      <el-radio-button label=""> 所有 </el-radio-button>
      <el-radio-button label="PENDING"> 未审核 </el-radio-button>
      <el-radio-button label="APPROVED"> 已通过 </el-radio-button>
      <el-radio-button label="REJECTED"> 已驳回 </el-radio-button>
    </el-radio-group>
  </div>
  <el-divider />
  <el-table :data="tableData" size="large" stripe cell-class-name="monospace">
    <el-table-column prop="id" label="ID" width="100" />
    <el-table-column label="审核" width="60">
      <template #default="scope">
        <el-icon color="red" v-if="scope.row.approved === 2"><CircleCloseFilled /></el-icon>
        <el-icon color="green" v-if="scope.row.approved === 1"><SuccessFilled /></el-icon>
        <el-icon color="orange" v-if="scope.row.approved === 0"><QuestionFilled /></el-icon>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="userName" label="用户" width="150" />
    <el-table-column prop="createdAt" label="创建时间" width="200" />
    <el-table-column label="操作" width="200">
      <template #default="scope">
        <el-button size="small" type="success" @click="onApproved(scope.row.id, 'APPROVED')"> 通过 </el-button>
        <el-button size="small" type="danger" @click="onApproved(scope.row.id, 'REJECTED')">驳回</el-button>
        <el-button size="small" type="primary" @click="showDetail(scope.row.id)">查看</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="pagination-wrapper">
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      @current-change="currentChange"
    />
  </div>
  <el-dialog v-model="showFormModal" title="征名详情" top="20px" width="50%">
    <el-descriptions direction="vertical" :column="2" border>
      <el-descriptions-item label="名称" span="2">{{ selectedNaming.name }}</el-descriptions-item>
      <el-descriptions-item label="释义" span="2">{{ selectedNaming.comment }}</el-descriptions-item>
      <el-descriptions-item label="用户">{{ selectedNaming.userName }}</el-descriptions-item>
      <el-descriptions-item label="手机号">{{ selectedNaming.phone }}</el-descriptions-item>
      <el-descriptions-item label="地址">{{ selectedNaming.addr }}</el-descriptions-item>
      <el-descriptions-item label="ID">{{ selectedNaming.id }}</el-descriptions-item>
      <el-descriptions-item label="用户 ID">{{ selectedNaming.userId }}</el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ selectedNaming.createdAt }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>
