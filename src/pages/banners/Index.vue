<script setup>
import {SuccessFilled,CircleCloseFilled,Plus} from "@element-plus/icons-vue";
import PageHeader from "@/components/PageHeader.vue";
import ImageUploader from "@/components/ImageUploader.vue";
import RegionBinding from "@/components/RegionBinding.vue";
import LinkEditor from "@/components/LinkEditor.vue";
import domainApi from "@/requests/banner";
import { ref, reactive } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const tableData = ref([]);
const showFormModal = ref(false);
const form = reactive({});
const currentPage = ref(1);
const totalCount = ref(10);
const types = [
  {
    value: 11,
    label: "HOME_P1",
  },
  {
    value: 12,
    label: "HOME_P2",
  },
  {
    value: 13,
    label: "HOME_P3",
  },
  {
    value: 21,
    label: "EVENT_P1",
  },
  {
    value: 31,
    label: "CULTURAL_P1",
  },
];
const typesMap = Object.fromEntries(
  types.map((item) => [item.value, item.label])
);

async function fetchAll(page) {
  const data = await domainApi.getBanners({
    page: page,
    limit: 10,
  });
  tableData.value = data.rows;
  totalCount.value = data.count;
}

async function editDomain(domainId) {
  const banner = await domainApi.getBanner(domainId);
  Object.keys(banner).forEach((key) => {
    form[key] = banner[key];
  });

  showFormModal.value = true;
}

function newDomain() {
  Object.keys(form).forEach((key) => {
    form[key] = undefined;
  });
  showFormModal.value = true;
}

function removeDomain(domainId) {
  domainApi.removeBanner(domainId).then(fetchAll);
}

function onSubmit() {
  if (form.id) {
    domainApi.updateBanner(form).then(() => {
      fetchAll();
      showFormModal.value = false;
    });
  } else {
    domainApi.createBanner(form).then(() => {
      fetchAll();
      showFormModal.value = false;
    });
  }
}

function imageUploaded(imageUrl) {
  form.image = imageUrl;
}

function currentChange(page) {
  currentPage.value = page;
  fetchAll(page);
}

async function switchBanner(id) {
  const bannerRes = await domainApi.getBanners({
    page: 1,
    limit: 10,
    type: id,
  });
  tableData.value = bannerRes.rows;
  totalCount.value = bannerRes.count;
}

fetchAll(currentPage.value);
</script>

<template>
  <page-header>
    <el-row class="row-bg">
      <el-col :span="12">
        {{ route.meta.title }}
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button type="primary" @click="newDomain">新建 Banner</el-button>
      </el-col>
    </el-row>

    <el-input v-model="tableData.id" type="hidden" />
    <el-select
      v-model="types.label"
      placeholder="Select"
      @change="switchBanner"
    >
      <el-option
        v-for="item in types"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </page-header>
  <el-table :data="tableData" size="large" stripe cell-class-name="monospace">
    <el-table-column prop="id" label="ID" width="60" />
    <el-table-column prop="title" label="标题" />
    <el-table-column label="生效范围" width="150">
      <template #default="scope">
        <RegionBinding
          source-type="BANNER"
          :source-id="scope.row.id"
          :selected-regions="scope.row.regions"
        />
      </template>
    </el-table-column>
    <el-table-column prop="type" label="类型" width="100">
      <template #default="scope">
        {{ typesMap[scope.row.type] }}
      </template>
    </el-table-column>
    <el-table-column prop="published" label="上线" width="60">
      <template #default="scope">
        <el-icon color="green" v-if="scope.row.published"><SuccessFilled/></el-icon>
        <el-icon color="red" v-if="!scope.row.published"><CircleCloseFilled/></el-icon>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="200">
      <template #default="scope">
        <el-button size="small" type="success" @click="editDomain(scope.row.id)"
          >编辑</el-button
        >
        <el-popconfirm
          title="确认删除吗？"
          confirm-button-text="确定"
          cancel-button-text="取消"
          @confirm="removeDomain(scope.row.id)"
        >
          <template #reference>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-popconfirm>
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

  <el-dialog v-model="showFormModal" width="50%" top="20px">
    <el-form :model="form" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="form.type">
          <el-option
            v-for="item in types"
            :key="item.value"
            :value="item.value"
            :label="item.label"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="链接">
        <LinkEditor v-model="form.link" />
      </el-form-item>
      <el-form-item label="发布">
        <el-switch v-model="form.published" />
      </el-form-item>
      <el-form-item label="图片">
        <el-input v-model="form.image" />
        <el-divider />
        <image-uploader :image-url="form.image" @on-success="imageUploaded">
          <img v-if="form.image" :src="form.image" class="image" />
          <el-icon v-else class="uploader-icon"><Plus /></el-icon>
        </image-uploader>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.image {
  max-width: 300px;
}
</style>
