<script setup>
import { SuccessFilled, CircleCloseFilled, Plus } from "@element-plus/icons-vue";
import ImageUploader from "@/components/ImageUploader.vue";
import PageHeader from "@/components/PageHeader.vue";
import organizerApi from "@/requests/organizer";
import groupsApi from "@/requests/groups.js";
import { ref, reactive, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const currentPage = ref(1);
const totalCount = ref(10);
const tableData = ref([]);
const searchText = ref("");
const showEditForm = ref(false);
const form = reactive({});

async function getgroups(page) {
  const groupsRes = await groupsApi.groups({ page: page, limit: 10 });
  totalCount.value = groupsRes.count;
  tableData.value = groupsRes.rows.sort((a, b) => {
    return b.recommendSort - a.recommendSort;
  });
}

const filteredItems = computed(() => {
  const search = searchText.value.toLowerCase();
  return tableData.value.filter((item) =>
    item.name.toLowerCase().includes(search)
  );
});

const imageUploaded = (imageUrl) => {
  form.logoUrl = imageUrl;
};

function newGroups(organizerId) {
  Object.keys(form).forEach((key) => {
    form[key] = undefined;
  });
  showEditForm.value = true;
  form.organizerId = organizerId;
}

function edit(rowId) {
  groupsApi.groupsQuery(rowId).then((res) => {
    Object.keys(res).forEach((key) => {
      form[key] = res[key];
    });
  });

  showEditForm.value = true;
}

async function fetchOrganizers() {
  const data = await organizerApi.getOrganizers();
  form.organizerId = data.rows[1].id;
}

function removeGroups(rowId) {
  groupsApi.removeGroups(rowId).then(() => {
    getgroups(currentPage.value);
  });
}

function currentChange(page) {
  currentPage.value = page;
  getgroups(page);
}

function onSubmit() {
  showEditForm.value = false;
  if (form.id) {
    groupsApi.updateGroups(form).then(() => {
      getgroups(currentPage.value);
    });
  } else {
    groupsApi.creategroups(form).then(() => {
      getgroups();
    });
  }
}
fetchOrganizers();
getgroups(currentPage.value);
</script>

<template>
  <page-header>
    <el-row class="row-bg">
      <el-col :span="12">
        {{ route.meta.title }}
      </el-col>
    </el-row>
  </page-header>
  <el-row>
    <el-col :span="18">
      <el-select v-model="value" class="m-2" placeholder="Select" size="small">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-col>
    <el-col :span="2">
      <el-input v-model="searchText" class="w-50 m-2" placeholder="搜索" />
    </el-col>
    <el-col :span="2" class="add">
      <el-button @click="newGroups(form.organizerId)">添加</el-button>
    </el-col>
  </el-row>

  <el-table :data="filteredItems" size="large" cell-class-name="monospace">
    <el-table-column prop="id" label="ID" align="center" width="50" />
    <el-table-column prop="name" label="圈子名称" align="center" />
    <el-table-column label="图片" align="center">
      <template #default="{ row }">
        <el-image :src="row.logoUrl" class="showImage"></el-image>
      </template>
    </el-table-column>
    <el-table-column prop="description" label="简介" align="center" />
    <el-table-column prop="createdAt" label="创建时间" align="center" />
    <el-table-column prop="recommend" label="是否推荐" align="center">
      <template #default="scope">
        <el-icon color="green" v-if="scope.row.recommend"><SuccessFilled /></el-icon>
        <el-icon color="red" v-if="!scope.row.recommend"><CircleCloseFilled /></el-icon>
      </template>
    </el-table-column>
    <el-table-column prop="sort" label="推荐排序" align="center" />
    <el-table-column label="操作" align="center">
      <template #default="scope">
        <el-button size="small" type="primary" @click="edit(scope.row.id)">编辑</el-button>
        <el-popconfirm
          title="确认删除吗？"
          confirm-button-text="确定"
          cancel-button-text="取消"
          @confirm="removeGroups(scope.row.id)"
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

  <el-dialog v-model="showEditForm" :title="form.name" top="100px">
    <el-form :model="form">
      <el-form-item label="圈子名" label-width="120px">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="图片" label-width="120px">
        <el-input v-model="form.logoUrl" />
        <el-divider />

        <image-uploader :image-url="form.logoUrl" @on-success="imageUploaded">
          <img v-if="form.logoUrl" :src="form.logoUrl" class="image" />
          <el-icon v-else class="uploader-icon"><Plus /></el-icon>
        </image-uploader>
      </el-form-item>

      <el-form-item label="简介" label-width="120px">
        <el-input v-model="form.description" autocomplete="off" />
      </el-form-item>
      <el-form-item label="推荐" label-width="120px">
        <el-switch v-model="form.recommend" />
      </el-form-item>
      <el-form-item label="推荐排序" label-width="120px">
        <el-input v-model="form.sort" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button>取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped>
.add {
  margin-left: 20px;
}
.showImage {
  max-width: 50px;
}
.image {
  max-width: 150px;
}
</style>
