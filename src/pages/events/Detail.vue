<script setup>
import { SuccessFilled, CircleCloseFilled, QuestionFilled } from "@element-plus/icons-vue";
import PageHeader from "@/components/PageHeader.vue";

import eventApi from "@/requests/event";
import commentApi from "@/requests/comment";
import { useRoute } from "vue-router";
import { ref, reactive } from "vue";

const route = useRoute();

const event = ref({});
const comments = ref([]);
const statisticsCards = [...Array(4).keys()];
const showFormModal = ref(false);
let form = reactive({});

async function fetchEvent() {
  const eventsRes = await eventApi.getEvent(route.params.id);
  event.value = eventsRes;
  const commentsRes = await commentApi.getComments({ targetType: "EVENT", targetId: route.params.id });
  comments.value = commentsRes.rows;
}

async function approve(id, approvement) {
  commentApi.approveComment(id, approvement).then(fetchEvent);
}

fetchEvent();
</script>

<template>
  <page-header>
    <el-row class="row-bg">
      <el-col :span="12">
        {{ event.title }}
      </el-col>
    </el-row>
  </page-header>
  <el-row :gutter="20">
    <el-col :span="8">
      <div>活动详情</div>
      <el-divider />
      <div>
        <el-image :src="event.image" style="width: 300px" />
      </div>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="id" class-name="monospace">{{ event.id }}</el-descriptions-item>
        <el-descriptions-item label="标题" class-name="monospace">{{ event.title }}</el-descriptions-item>
        <el-descriptions-item label="内容" class-name="monospace">{{ event.content }}</el-descriptions-item>
        <el-descriptions-item label="地址" class-name="monospace">{{ event.address }}</el-descriptions-item>
        <el-descriptions-item label="状态" class-name="monospace">{{ event.status }}</el-descriptions-item>
        <el-descriptions-item label="开始时间" class-name="monospace">{{ event.startTime }}</el-descriptions-item>
        <el-descriptions-item label="结束时间" class-name="monospace">{{ event.endTime }}</el-descriptions-item>
        <el-descriptions-item label="发布" class-name="monospace">{{ event.online }}</el-descriptions-item>
        <el-descriptions-item label="类型" class-name="monospace">{{ event.type }}</el-descriptions-item>
        <el-descriptions-item label="链接" class-name="monospace">{{ event.link }}</el-descriptions-item>
        <el-descriptions-item label="生效类型" class-name="monospace">{{ event.sourceType }}</el-descriptions-item>
        <el-descriptions-item label="生效代码" class-name="monospace">{{ event.sourceCode }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" class-name="monospace">{{ event.createdAt }}</el-descriptions-item>
        <el-descriptions-item label="更新时间" class-name="monospace">{{ event.updatedAt }}</el-descriptions-item>
      </el-descriptions>
    </el-col>
    <el-col :span="16">
      <div>评论</div>
      <el-divider />
      <el-table :data="comments" size="large" stripe cell-class-name="monospace">
        <el-table-column prop="userId" label="用户" width="100" />
        <el-table-column prop="comment" label="评论" />
        <el-table-column prop="online" label="上线" width="60">
          <template #default="scope">
            <el-icon color="gray" v-if="scope.row.approved === 0"><QuestionFilled /></el-icon>
            <el-icon color="green" v-if="scope.row.approved === 1"><SuccessFilled /></el-icon>
            <el-icon color="red" v-if="scope.row.approved === 2"><CircleCloseFilled /></el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="时间" width="200" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button size="small" type="success" @click="approve(scope.row.id, 'APPROVED')">通过</el-button>
            <el-button size="small" type="danger" @click="approve(scope.row.id, 'REJECTED')">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
  <el-divider />
  <div>统计</div>
  <el-divider />
  <el-row :gutter="20">
    <el-col :span="6" v-for="item of statisticsCards">
      <el-card shadow="never">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
          </div>
        </template>
        <div>一些统计信息</div>
      </el-card>
    </el-col>
  </el-row>
</template>

<style scoped>
.image {
  width: 60px;
}
</style>
