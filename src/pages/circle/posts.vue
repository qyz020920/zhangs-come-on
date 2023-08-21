<script setup>
import { SuccessFilled, CircleCloseFilled, QuestionFilled, Plus } from "@element-plus/icons-vue";
import RichTextEditor from "@/components/RichTextEditor.vue";
import PageHeader from "@/components/PageHeader.vue";
import { ref, reactive, computed } from "vue";
import groupsApi from "@/requests/groups.js";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import user from "@/requests/user";
import http from "@/utils/http";

const uploadUrl = http.IMAGE_UPLOAD_URL_FILE;
const header = {
  Authorization: `Bearer ${localStorage.getItem("token")}`,
};

const route = useRoute();
const collection = ref([]);
const groups = ref([]);
const currentid = ref("");
const tableData = ref([]);
const currentPage = ref(1);
const totalCount = ref(10);
const searchText = ref("");
const selectedUser = ref({});
const showDialog = ref(false);
const form = reactive({});

async function getGroups() {
  const gruopsRes = await groupsApi.groups({ page: 1, limit: 1000 });
  groups.value = gruopsRes.rows;
}
getGroups();

async function getPosts( page ) {
  const postsRes = await groupsApi.queryPosts({ page: page, limit: 10 });
  totalCount.value = postsRes.count;
  tableData.value = postsRes.rows;
}

async function switchGroups(id) {
  currentid.value = id;
  const postsRes = await groupsApi.queryPosts({
    page: 1,
    limit: 10,
    groupId: id,
  });
  tableData.value = postsRes.rows;
  totalCount.value = postsRes.count;
}

function changeID(id) {
  user.getUserInfo(id).then((res) => {
    if (res.wxName == "") {
      ElMessage("此用户没有填写信息");
    } else {
      ElMessage({
        message: res.wxName,
        type: "success",
        duration: 5000,
      });
    }
  });
}

function handlegroupsIdSelect(id) {
  form.groupId = id;
}

const filteredItems = computed(() => {
  const search = searchText.value.toLowerCase();
  return tableData.value.filter((item) =>
    item.title.toLowerCase().includes(search)
  );
});

function newPosts() {
  Object.keys(form).forEach((key) => {
    form[key] = undefined;
  });
  showDialog.value = true;
}

function edit(rowId) {
  groupsApi.queryPostsDetails(rowId).then((res) => {
    Object.keys(res).forEach((key) => {
      form[key] = res[key];
    });
  });
  showDialog.value = true;
}

function removePost(rowId) {
  groupsApi.removePosts(rowId).then(() => {
    getPosts(currentPage.value);
  });
}

function deleteImage(index) {
  form.attachments.splice(index, 1);
}

const handleAvatarSuccess = (response) => {
  const newid = response.id;
  const attachments = form.attachments;
  if (form.id) {
    attachments.forEach((item) => {
      collection.value.push(item.id);
    });
    collection.value.push(newid);
    form.attachmentIds = collection;
  } else {
    collection.value.push(newid);
    form.attachmentIds = collection.value;
  }
};

function handleRemove(e) {
  form.attachmentIds.splice(e.response.id);
}

function onSubmit() {
  showDialog.value = false;
  if (form.id) {
    const attachments = form.attachments;
    attachments.forEach((item) => {
      collection.value.push(item.id);
    });
    form.attachmentIds = collection;
    groupsApi.updatePosts(form).then(() => {
      getPosts(currentPage.value);
    });
    form.attachmentIds = [];
  } else {
    groupsApi.createPosts(form).then(() => {
      getPosts();
    });
  }
}

function currentChange(page) {
  window.scrollTo(0, 0);
  const id = currentid.value;
  groupsApi
    .queryPosts({ page: page, limit: 10, groupId: id })
    .then((postsRes) => {
      tableData.value = postsRes.rows;
      totalCount.value = postsRes.count;
    });
  currentPage.value = page;
  getPosts(page);
}

getPosts(currentPage.value);
</script>

<template>
  <page-header>
    <el-row>
      <el-col :span="12">
        {{ route.meta.title }}
      </el-col>
    </el-row>
  </page-header>

  <el-row>
    <el-col :span="19">
      <el-input v-model="groups.id" type="hidden" />
      <el-select
        v-model="groups.id"
        placeholder="圈子名称"
        size="small"
        @change="switchGroups"
      >
        <el-option
          v-for="item in groups"
          :key="item.id"
          :value="item.id"
          :label="item.name"
        />
      </el-select>
    </el-col>
    <el-col :span="2">
      <el-input placeholder="搜索" v-model="searchText" />
    </el-col>
    <el-col :span="2" class="add">
      <el-button @click="newPosts">添加</el-button>
    </el-col>
  </el-row>
  
  <el-table :data="filteredItems" size="large" cell-class-name="monospace">
    <el-table-column prop="id" label="ID" align="center" />
    <el-table-column prop="title" label="帖子标题" align="center" />
    <el-table-column prop="content" label="帖子内容" align="center" />
    <el-table-column label="图片" width="160" align="center">
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
    <el-table-column
      prop="countOfLikes"
      label="点赞数"
      width="75"
      align="center"
    />
    <el-table-column prop="groupName" label="圈子名称" align="center" />
    <el-table-column prop="approved" label="审核" align="center">
      <template #default="scope">
        <el-icon color="red" v-if="scope.row.approved == 2"><CircleCloseFilled/></el-icon>
        <el-icon color="green" v-if="scope.row.approved == 1"><SuccessFilled/></el-icon>
        <el-icon color="orange" v-if="scope.row.approved == 0"><QuestionFilled/></el-icon>
      </template>
    </el-table-column>
    <el-table-column
      prop="createdAt"
      label="创建时间"
      align="center"
      width="200px"
    />
    <el-table-column label="操作" width="200">
      <template #default="scope">
        <el-button size="small" type="warning">置顶</el-button>
        <el-button size="small" type="primary" @click="edit(scope.row.id)">编辑</el-button>
        <el-popconfirm
          title="确认删除吗？"
          confirm-button-text="确定"
          cancel-button-text="取消"
          @confirm="removePost(scope.row.id)"
        >
          <template #reference>
            <el-button size="small" type="danger">删除</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>

  <el-dialog v-model="showDialog" top="50px">
    <el-form :model="form">
      <el-form-item label="圈子名称" label-width="120px">
        <el-input v-model="form.groupId" type="hidden" />
        <el-select
          v-model="groups.id"
          placeholder="圈子名称"
          size="small"
          @change="handlegroupsIdSelect"
        >
          <el-option
            v-for="item in groups"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="账号选择" label-width="120px">
        <el-input v-model="form.userId" class="input" @change="changeID" />
      </el-form-item>
      <el-form-item label="帖子标题" label-width="120px">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="审核" label-width="120px">
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
      <el-form-item label="内容" label-width="120px">
        <div style="width: 100%">
          <RichTextEditor v-model:content="form.content" />
        </div>
      </el-form-item>

      <el-form-item label="上传图片" label-width="120px">
        <el-upload
          :limit="9"
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
    </el-form>

    <template #footer>
      <span>
        <el-button @click="showDialog = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </span>
    </template>
  </el-dialog>

  <div>
    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
      @current-change="currentChange"
    />
  </div>
</template>
<style scoped>
.add {
  margin-left: 20px;
}
.showImage {
  width: 40px;
  height: 40px;
  margin: 1px;
}
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
.name {
  margin: 0px 60px;
}
</style>
