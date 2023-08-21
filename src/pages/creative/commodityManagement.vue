<script setup>
import { QuestionFilled, SuccessFilled, CircleCloseFilled, Plus } from "@element-plus/icons-vue";
import RichTextEditor from "@/components/RichTextEditor.vue";
import ImageUploader from "@/components/ImageUploader.vue";
import PageHeader from "@/components/PageHeader.vue";
import creativeApi from "@/requests/creative.js";
import { ref, reactive, computed } from "vue";
import { useRoute } from "vue-router";
import http from "@/utils/http";

const route = useRoute();
const collection = ref([]);
const currentPage = ref(1);
const totalCount = ref(10);
const tableData = ref([]);
const selectData = ref([]);
const searchText = ref("");
const showForm = ref(false);
const form = reactive({});

const uploadUrl = http.IMAGE_UPLOAD_URL_FILE;
const header = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

async function getCategories() {
  let categories = await creativeApi.getCategories({
    page: 1,
    limit: 1000,
    type: "CULTURAL_PRODUCTS",
  });
  selectData.value = categories.rows;
}
getCategories();

async function getallcommodity(page) {
  let Products = await creativeApi.getProducts({
    page: page,
    limit: 10,
  });
  tableData.value = Products.rows;
  totalCount.value = Products.count;
}

const handleAvatarSuccess = (response) => {
  const newid = response.id;
  const attachments = form.attachments;
  if (form.id) {
    attachments.forEach((item) => {
      collection.value.push(item.id);
    });
    collection.value.push(newid);
    form.attachmentIds = collection.value;
  } else {
    collection.value.push(newid);
    form.attachmentIds = collection.value;
  }
};

const imageUploaded = (imageUrl) => {
  form.content = imageUrl;
};

function deleteImage(index) {
  form.attachments.splice(index, 1);
}

function handleRemove(e) {
  form.attachmentIds.splice(e.response.id);
}

function newProduct() {
  Object.keys(form).forEach((key) => {
    form[key] = undefined;
  });
  showForm.value = true;
}

function edit(id) {
  creativeApi.getProductsQuery(id).then((res) => {
    form.categoryIds = res.categorys.map((item)=>{
      return item.id
    })
    Object.keys(res).forEach((key) => {
      form[key] = res[key];
    });
  });
  showForm.value = true;
}

function remove(id) {
  creativeApi.removeProducts(id).then(() => {
    getallcommodity();
  });
}

function onSubmit() {
  if (form.id) {
    const attachments = form.attachments;
    attachments.forEach((item) => {
      collection.value.push(item.id);
    });
    form.attachmentIds = collection;
    creativeApi.updateProducts(form).then((res) => {
      getallcommodity();
      showForm.value = false;
    });
    form.attachmentIds = [];
  } else {
    creativeApi.createProducts(form).then((res) => {
      tableData.value = res.rows;
      getallcommodity();
      showForm.value = false;
    });
  }
}

function currentChange(page) {
  currentPage.value = page;
  getallcommodity(page);
}

getallcommodity(currentPage.value);
</script>

<template>
  <page-header>
    <el-row class="row-bg">
      <el-col :span="12">
        {{ route.meta.title }}
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button type="primary" @click="newProduct">新建产品</el-button>
      </el-col>
    </el-row>
  </page-header>

  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="id" label="ID" />
    <el-table-column prop="title" label="产品名称" />
    <el-table-column prop="address" label="产品图片" width="180">
      <template #default="{ row }">
        <div v-if="row.attachments.length == 0">
          <el-image></el-image>
        </div>
        <el-image
          v-else
          v-for="(item, index) in row.attachments"
          fit="cover"
          :key="index"
          :src="item.url"
          class="showImage"
        />
      </template>
    </el-table-column>
    <el-table-column prop="attachmentSize" label="图片数量" />
    <el-table-column label="产品类别">
      <template #default="{ row }">
        <el-tag v-for="(item, index) in row.categorys" :key="index">{{
          item.title
        }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="attachments.length" label="上线">
      <template #default="scope">
        <el-icon color="red" v-if="scope.row.approved == 2"><CircleCloseFilled/></el-icon>
        <el-icon color="green" v-if="scope.row.approved == 1"><SuccessFilled/></el-icon>
        <el-icon color="orange" v-if="scope.row.approved == 0"><QuestionFilled/></el-icon>
      </template>
    </el-table-column>
    <el-table-column prop="attachments.length" label="操作">
      <template #default="scope">
        <el-button size="small" type="primary" @click="edit(scope.row.id)"
          >编辑</el-button
        >
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

  <el-dialog v-model="showForm" width="80%">
    <el-form :model="form">
      <el-form-item label="产品名称" label-width="120">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="商品分类" label-width="120">
        <el-select
          v-model="form.categoryIds"
          multiple
          placeholder="Select"
          style="width: 240px"
        >
          <el-option
            v-for="item in selectData"
            :key="item.id"
            :label="item.title"
            :value="item.id"
            :disabled="!item.published"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="上传图片" label-width="120px">
        <el-upload
          :limit="5"
          name="file"
          :headers="header"
          :action="uploadUrl"
          list-type="picture-card"
          :on-success="handleAvatarSuccess"
          :on-remove="handleRemove"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>

        <el-dialog v-model="dialogVisible">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
        <div class="box">
          <div v-for="(item, index) in form.attachments" :key="index">
            <el-input v-model="item.id" type="hidden" />
            <img :src="item.url" class="img" />
            <el-icon class="icon" @click="deleteImage(index)"><CircleCloseFilled/></el-icon>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="发布" label-width="120">
        <el-select
          v-model="form.approved"
          placeholder="请选择状态"
          @change="changeapproved"
        >
          <el-option label="审核中" :value="0"></el-option>
          <el-option label="通过" :value="1"></el-option>
          <el-option label="未通过" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品详情" label-width="120px">
        <div style="width: 80%">
          <RichTextEditor v-model:content="form.content" />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="showForm = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>

  <div class="pagination-wrapper">
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      @current-change="currentChange"
    />
  </div>
</template>
<style scoped>
.box {
  width: 270px;
  display: flex;
  flex-wrap: wrap;
}
.img {
  width: 70px;
  height: 70px;
  margin: 1px;
}
.icon {
  transform: translate(-13px, -57px);
}
.showImage {
  width: 40px;
  height: 40px;
  margin: 1px;
}
.image {
  max-width: 150px;
}
</style>
