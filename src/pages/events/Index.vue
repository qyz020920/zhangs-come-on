<script setup>
import { SuccessFilled, CircleCloseFilled, Plus } from "@element-plus/icons-vue";
import PageHeader from "@/components/PageHeader.vue";
import ImageUploader from "@/components/ImageUploader.vue";
import RichTextEditor from "@/components/RichTextEditor.vue";
import RegionBinding from "@/components/RegionBinding.vue";
import LinkEditor from "@/components/LinkEditor.vue";
import eventApi from "@/requests/event";
import organizerApi from "@/requests/organizer";
import { ref, reactive, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const tableData = ref([]);
const showModal = ref(false);
const form = reactive({});
const currentPage = ref(1);
const totalCount = ref(10);
const organizerHolder = ref("");
const organizers = ref([]);

function fetchEvents(page) {
  eventApi
    .getEvents({
      page: page,
      limit: 10,
    })
    .then((data) => {
      totalCount.value = data.count;
      tableData.value = data.rows;
    });
}

function editEvent(eventId) {
  eventApi.getEvent(eventId).then((event) => {
    Object.keys(event).forEach((key) => {
      form[key] = event[key];
    });
    form["organizerId"] = event["organizer"]["id"];
    organizerApi.getOrganizer(event.organizer.id).then((organizer) => {
      organizerHolder.value = organizer.name;
    });
    showModal.value = true;
  });
}

function newEvent() {
  Object.keys(form).forEach((key) => {
    form[key] = undefined;
  });
  organizerHolder.value = "";
  showModal.value = true;
}

function removeEvent(eventId) {
  eventApi.removeEvent(eventId).then(fetchEvents);
}

function onSubmit() {
  if (form.id) {
    eventApi.updateEvent(form).then(() => {
      fetchEvents();
      showModal.value = false;
    });
  } else {
    eventApi.createEvent(form).then(() => {
      fetchEvents();
      showModal.value = false;
    });
  }
}

function imageUploaded(imageUrl) {
  form.image = imageUrl;
}

function shareImageUploaded(imageUrl) {
  form.shareImage = imageUrl;
}

async function fetchOrganizers() {
  const data = await organizerApi.getOrganizers();
  organizers.value = data.rows;
}

function handleOrganizerSelect(organizerId) {
  form.organizerId = organizerId;
}

function showEvent(id) {
  router.push(`/events/${id}`);
}

function currentChange(page) {
  currentPage.value = page;
  fetchEvents(page);
}

fetchOrganizers();
fetchEvents(currentPage.value);
</script>

<template>
  <page-header>
    <el-row class="row-bg">
      <el-col :span="12">
        {{ route.meta.title }}
      </el-col>
      <el-col :span="12" style="text-align: right">
        <el-button type="primary" @click="newEvent">新建活动</el-button>
      </el-col>
    </el-row>
  </page-header>
  <el-table :data="tableData" size="large" stripe cell-class-name="monospace">
    <el-table-column prop="id" label="ID" width="60" />
    <el-table-column prop="title" label="标题" />
    <el-table-column label="生效范围" width="150">
      <template #default="scope">
        <RegionBinding source-type="EVENT" :source-id="scope.row.id" :selected-regions="scope.row.regions" />
      </template>
    </el-table-column>
    <el-table-column prop="organizer.name" label="主办方" width="250" />
    <el-table-column prop="status" label="状态" width="100" />
    <el-table-column prop="online" label="上线" width="60">
      <template #default="scope">
        <el-icon color="green" v-if="scope.row.online"><SuccessFilled /></el-icon>
        <el-icon color="red" v-if="!scope.row.online"><CircleCloseFilled /></el-icon>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="200">
      <template #default="scope">
        <el-button size="small" type="primary" @click="showEvent(scope.row.id)">查看</el-button>
        <el-button size="small" type="success" @click="editEvent(scope.row.id)">编辑</el-button>
        <el-popconfirm
          title="确认删除吗？"
          confirm-button-text="确定"
          cancel-button-text="取消"
          @confirm="removeEvent(scope.row.id)"
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

  <el-dialog v-model="showModal" width="80%" top="20px">
    <el-form :model="form" label-width="120px">
      <el-form-item label="名称">
        <el-input v-model="form.title" />
      </el-form-item>
      <el-form-item label="类型">
        <el-input v-model="form.type" />
      </el-form-item>
      <el-form-item label="内容">
        <div style="width: 80%">
          <RichTextEditor v-model:content="form.content" />
        </div>
      </el-form-item>
      <el-form-item label="主办方">
        <el-input v-model="form.organizerId" type="hidden" />
        <el-select v-model="organizerHolder" filterable @change="handleOrganizerSelect">
          <el-option v-for="item in organizers" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="链接">
        <LinkEditor v-model="form.link" />
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker v-model="form.startTime" type="datetime" placeholder="Pick a day" />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker v-model="form.endTime" type="datetime" placeholder="Pick a day" />
      </el-form-item>
      <el-form-item label="地址">
        <el-input v-model="form.address" />
      </el-form-item>
      <el-form-item label="发布">
        <el-switch v-model="form.online" />
      </el-form-item>
      <el-form-item label="图片">
        <el-input v-model="form.image" />
        <el-divider />
        <image-uploader :image-url="form.image" @on-success="imageUploaded">
          <img v-if="form.image" :src="form.image" class="image" />
          <el-icon v-else class="uploader-icon"><Plus /></el-icon>
        </image-uploader>
      </el-form-item>
      <el-form-item label="分享标题">
        <el-input v-model="form.shareContent" />
      </el-form-item>
      <el-form-item label="分享图片">
        <el-input v-model="form.shareImage" />
        <el-divider />
        <image-uploader :image-url="form.shareImage" @on-success="shareImageUploaded">
          <img v-if="form.shareImage" :src="form.shareImage" class="image" />
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
