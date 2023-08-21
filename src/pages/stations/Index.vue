<script setup>
import { SuccessFilled, CircleCloseFilled, Plus } from "@element-plus/icons-vue";
import ImageUploader from "@/components/ImageUploader.vue";
import PageHeader from "@/components/PageHeader.vue";
import stationApi from "@/requests/station";
import { ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const tableData = ref([]);
const showFormModal = ref(false);
let form = reactive({});

function fetchStations() {
  stationApi.getStations().then((data) => (tableData.value = data.rows));
}

function showStation(stationId) {
  router.push(`/stations/${stationId}`);
}

function editStation(stationId) {
  stationApi.getStation(stationId).then((station) => {
    Object.keys(station).forEach((key) => {
      form[key] = station[key];
    });
    console.log(station);
    showFormModal.value = true;
  });
}

function newStation() {
  Object.keys(form).forEach((key) => {
    form[key] = undefined;
  });
  form.status = 0
  showFormModal.value = true;
}

const imageUploaded = (imageUrl) => {
  form.logoUrl = imageUrl;
};

function onSubmit() {
  showFormModal.value = false;
  if (form.id) {
    stationApi.updateStation(form).then(() => {
      fetchStations();
    });
  } else {
    stationApi.createStation(form).then(() => {
      fetchStations();
    });
  }
}

fetchStations();
</script>

<template>
  <page-header>
    <el-row class="row-bg">
      <el-col :span="12">
        {{ route.meta.title }}
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button type="primary" @click="newStation">新建血站</el-button>
      </el-col>
    </el-row>
  </page-header>
  <el-table :data="tableData" size="large" stripe cell-class-name="monospace">
    <el-table-column prop="id" label="ID" width="60" />
    <el-table-column prop="indexLetter" label="索引" width="60" />
    <el-table-column label="启用" width="60">
      <template #default="scope">
        <el-icon color="green" v-if="scope.row.enabled"><SuccessFilled /></el-icon>
        <el-icon color="red" v-if="!scope.row.enabled"><CircleCloseFilled /></el-icon>
      </template>
    </el-table-column>
    <el-table-column prop="name" label="" width="60">
      <template #default="scope">
        <el-image :src="scope.row.logoUrl" fit="fill" />
      </template>
    </el-table-column>
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="city" label="城市" />
    <el-table-column prop="status" label="状态">
      <template #default="scope">
        <el-icon color="green" v-if="scope.row.status == 0"><SuccessFilled /></el-icon>
        <el-icon color="red" v-if="scope.row.status == 1"><CircleCloseFilled /></el-icon>
      </template>
    </el-table-column>
    <el-table-column prop="code" label="血站编码" width="100" />
    <el-table-column prop="cityCode" label="城市编码" width="100" />
    <el-table-column label="开通服务" width="100">
      <template #default="scope">
        <el-icon color="green" v-if="scope.row.hasLocalService"><SuccessFilled /></el-icon>
        <el-icon color="red" v-if="!scope.row.hasLocalService"><CircleCloseFilled /></el-icon>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="150">
      <template #default="scope">
        <el-button size="small" type="primary" @click="editStation(scope.row.id)">编辑</el-button>
        <el-button size="small" type="primary" @click="showStation(scope.row.id)">服务</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="showFormModal" :title="form.name" top="20px" width="50%">
    <el-form :model="form" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="图标">
        <el-input v-model="form.logoUrl" />
        <el-divider />
        <image-uploader :image-url="form.logoUrl" @on-success="imageUploaded">
          <img v-if="form.logoUrl" :src="form.logoUrl" class="image" />
          <el-icon v-else class="uploader-icon"><Plus /></el-icon>
        </image-uploader>
      </el-form-item>
      <el-form-item label="编码">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="城市">
        <el-input v-model="form.city" />
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status" :active-value="0" :inactive-value="1" @change="changeStatus" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.remark" />
      </el-form-item>
      <el-form-item label="城市编码">
        <el-input v-model="form.cityCode" />
      </el-form-item>
      <el-form-item label="启用">
        <el-switch v-model="form.enabled" />
      </el-form-item>
      <el-form-item label="本地服务">
        <el-switch v-model="form.hasLocalService" />
      </el-form-item>
      <el-form-item label="索引">
        <el-input v-model="form.indexLetter" />
      </el-form-item>
      <el-form-item label="纬度">
        <el-input v-model="form.latitude" />
      </el-form-item>
      <el-form-item label="经度">
        <el-input v-model="form.longitude" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.image {
  width: 60px;
}
</style>
