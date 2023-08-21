<script setup>
import { SuccessFilled, CircleCloseFilled, Plus } from "@element-plus/icons-vue";
import PageHeader from "@/components/PageHeader.vue";
import creativeApi from "@/requests/creative.js";
import { ref, reactive, computed } from "vue";
import { useRoute } from "vue-router";

const count = ref(0);
const route = useRoute();
const currentPage = ref(1);
const totalCount = ref(10);
const tableData = ref([]);
const showForm = ref(false);
const form = reactive({ type: "CULTURAL_PRODUCTS" });

async function getcategories(page) {
  let categories = await creativeApi.getCategories({
    page: page,
    limit: 10,
    type: "CULTURAL_PRODUCTS",
  });
  tableData.value = categories.rows;
  totalCount.value = categories.count;
}

function newcategory() {
  Object.keys(form).forEach((key) => {
    form[key] = undefined;
  });
  form.type = "CULTURAL_PRODUCTS";
  form.published = true;
  showForm.value = true;
}

function edit(id) {
  creativeApi.getCategoriesQuery(id).then((res) => {
    Object.keys(res).forEach((key) => {
      form[key] = res[key];
    });
  });
  showForm.value = true;
}

function remove(id) {
  creativeApi.removeCategories(id).then(() => {
    getcategories();
  });
}

function onSubmit() {
  if (form.id) {
    creativeApi.updateCategories(form).then((res) => {
      tableData.value = res.rows;
      getcategories();
      showForm.value = false;
    });
  } else {
    creativeApi.createCategories(form).then((res) => {
      tableData.value = res.rows;
      getcategories();
      showForm.value = false;
    });
  }
}

const handleInput = (event) => {
  const value = event;
  const regExp = /^[a-zA-Z0-9\u4e00-\u9fa5]+$/;

  if (regExp.test(value)) {
    let num = 0;
    for (let i = 0; i < value.length; i++) {
      const code = value.charCodeAt(i);
      if (code >= 0 && code <= 128) {
        num += 1;
      } else {
        num += 2;
      }
      if (num > 16) {
        form.title = value.slice(0, i);
        break;
      }
    }
    count.value = num;
  } else {
    form.title = "";
    count.value = 0;
  }
};

function currentChange(page) {
  currentPage.value = page;
  getcategories(page);
}

getcategories(currentPage.value);
</script>

<template>
  <page-header>
    <el-row class="row-bg">
      <el-col :span="12">
        {{ route.meta.title }}
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button type="primary" @click="newcategory">新建类别</el-button>
      </el-col>
    </el-row>
  </page-header>

  <el-table :data="tableData" style="width: 100%">
    <el-table-column prop="id" label="ID" width="160" />
    <el-table-column prop="title" label="字典名称" width="800" />
    <el-table-column label="启用">
      <template #default="{ row }">
        <el-icon color="green" v-if="row.published"><SuccessFilled /></el-icon>
        <el-icon color="red" v-else><CircleCloseFilled /></el-icon>
      </template>
    </el-table-column>
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

  <el-dialog v-model="showForm" top="100px">
    <el-form :model="form">
      <el-form-item label="类别名称" label-width="120px">
        <el-input
          v-model="form.title"
          maxlength="16"
          @input="handleInput"
          placeholder="类别不能超过8个字/16个字符(一个汉字2个字符)只能是汉字和字母,不能有特殊符号"
        />
      </el-form-item>
      <el-form-item label="启用" label-width="120px">
        <el-switch v-model="form.published" />
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
</style>
