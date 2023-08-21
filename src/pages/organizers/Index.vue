<script setup>
import { SuccessFilled, CircleCloseFilled, Plus } from "@element-plus/icons-vue";
import PageHeader from "@/components/PageHeader.vue";
import ImageUploader from "@/components/ImageUploader.vue";
import organizerApi from "@/requests/organizer";
import { ref, reactive } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const tableData = ref([]);
const showFormModal = ref(false);
let form = reactive({});

function fetchOrganizers() {
  organizerApi.getOrganizers().then((data) => {
    tableData.value = data.rows;
  });
}

function editOrganizer(organizerId) {
  organizerApi.getOrganizer(organizerId).then((organizer) => {
    Object.keys(organizer).forEach((key) => {
      form[key] = organizer[key];
    });
    showFormModal.value = true;
  });
}

function newOrganizer() {
  Object.keys(form).forEach((key) => {
    form[key] = undefined;
  });
  showFormModal.value = true;
}

function removeOrganizer(organizerId) {
  organizerApi.removeOrganizer(organizerId).then(fetchOrganizers);
}

function onSubmit() {
  showFormModal.value = false;
  if (form.id) {
    organizerApi.updateOrganizer(form).then(() => {
      fetchOrganizers();
    });
  } else {
    organizerApi.createOrganizer(form).then(() => {
      fetchOrganizers();
    });
  }
}

function imageUploaded(imageUrl) {
  form.icon = imageUrl;
}

fetchOrganizers();
</script>

<template>
  <page-header>
    <el-row class="row-bg">
      <el-col :span="12">
        {{ route.meta.title }}
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button type="primary" @click="newOrganizer">新建</el-button>
      </el-col>
    </el-row>
  </page-header>
  <el-table :data="tableData" size="large" stripe cell-class-name="monospace">
    <el-table-column prop="id" label="ID" width="60" />
    <el-table-column prop="name" label="名称" />
    <el-table-column prop="status" label="状态" width="100" />
    <el-table-column label="操作" width="150">
      <template #default="scope">
        <el-button size="small" type="primary" @click="editOrganizer(scope.row.id)">编辑</el-button>
        <el-popconfirm
          title="确认删除吗？"
          confirm-button-text="确定"
          cancel-button-text="取消"
          @confirm="removeOrganizer(scope.row.id)"
        >
          <template #reference>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="showFormModal" :title="form.title" width="50%" top="20px">
    <el-form :model="form" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="维护人">
        <el-input v-model="form.userId" />
      </el-form-item>
      <el-form-item label="图标">
        <el-input v-model="form.icon" />
        <el-divider />
        <image-uploader :image-url="form.icon" @on-success="imageUploaded">
          <img v-if="form.icon" :src="form.icon" class="image" />
          <el-icon v-else class="uploader-icon"><Plus /></el-icon>
        </image-uploader>
      </el-form-item>
      <el-form-item label="状态">
        <el-switch v-model="form.status" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="form.introduction" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.image {
  width: 100px;
}
</style>
