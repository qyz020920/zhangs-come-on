<script setup>
import { Plus } from "@element-plus/icons-vue";
import PageHeader from "@/components/PageHeader.vue";
import ImageUploader from "@/components/ImageUploader.vue";
import LinkEditor from "@/components/LinkEditor.vue";

import stationApi from "@/requests/station";
import stationUtils from "@/utils/station";
import stationServiceApi from "@/requests/station-service";
import { useRoute } from "vue-router";
import { ref, reactive } from "vue";

const route = useRoute();

const station = ref({});
const stationTableData = ref([]);
const stationServicesTableData = ref([]);

const showFormModal = ref(false);
let form = reactive({});

function edit(stationServiceId) {
  stationServiceApi.getStationService(stationServiceId).then((stationService) => {
    Object.keys(stationService).forEach((key) => {
      form[key] = stationService[key];
    });
    showFormModal.value = true;
  });
}

function remove(stationServiceId) {
  stationServiceApi.removeStationService(stationServiceId).then(fetchStationServices);
}

function create() {
  Object.keys(form).forEach((key) => {
    form[key] = undefined;
  });
  form.stationCode = station.value.code;
  showFormModal.value = true;
}

const imageUploaded = (imageUrl) => {
  form.icon = imageUrl;
};

function onSubmit() {
  showFormModal.value = false;
  if (form.id) {
    stationServiceApi.updateStationService(form.id, form).then(fetchStationServices);
  } else {
    stationServiceApi.createStationService(form).then(fetchStationServices);
  }
}

function fetchStationServices() {
  stationApi.getStation(route.params.id).then((stationData) => {
    station.value = stationData;
    stationTableData.value = Object.keys(stationUtils.attrsMap).map((item) => {
      return {
        key: stationUtils.attrsMap[item],
        value: stationData[item],
      };
    });

    stationServiceApi.getStationServices(stationData.code).then((stationServicesData) => {
      stationServicesTableData.value = stationServicesData.rows;
    });
  });
}

fetchStationServices();
</script>

<template>
  <page-header>
    <el-row class="row-bg">
      <el-col :span="12">
        {{ station.name }}
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button type="primary" @click="create">新建血站服务</el-button>
      </el-col>
    </el-row>
  </page-header>
  <el-row :gutter="20">
    <el-col :span="14"
      ><el-table :data="stationServicesTableData" size="large" stripe cell-class-name="monospace">
        <el-table-column label="图标" width="60">
          <template #default="scope">
            <el-image :src="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="enabled" label="启用" width="100" />
        <el-table-column prop="type" label="类型" width="100" />
        <el-table-column prop="showIndex" label="索引" width="100" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="primary" @click="edit(scope.row.id)">编辑</el-button>
            <el-popconfirm
              title="确认删除吗？"
              confirm-button-text="确定"
              cancel-button-text="取消"
              @confirm="remove(scope.row.id)"
            >
              <template #reference>
                <el-button size="small" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>

  <el-dialog v-model="showFormModal" :title="form.name" top="20px" width="50%">
    <el-form :model="form" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="图标">
        <el-input v-model="form.icon" />
        <el-divider />
        <image-uploader :image-url="form.icon" @on-success="imageUploaded">
          <img v-if="form.icon" :src="form.icon" class="image" />
          <el-icon v-else class="uploader-icon"><Plus /></el-icon>
        </image-uploader>
      </el-form-item>
      <el-form-item label="启用">
        <el-switch v-model="form.enabled" />
      </el-form-item>
      <el-form-item label="链接">
        <LinkEditor v-model="form.link" />
      </el-form-item>
      <el-form-item label="类型">
        <el-radio-group v-model="form.type">
          <el-radio :label="0">首页服务</el-radio>
          <el-radio :label="1">个人页面服务</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="索引">
        <el-input v-model="form.showIndex" />
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
