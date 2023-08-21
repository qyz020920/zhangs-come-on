<script setup>
import adminApi from "@/requests/admin";
import { reactive } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const loginForm = reactive({
  username: "",
  password: "",
});

function submitForm() {
  adminApi.login(loginForm).then((res) => {
    console.log(res);
    localStorage.setItem("token", res.data);
    router.push("/");
  });
}
</script>

<template>
  <el-row>
    <el-col :span="8" />
    <el-col :span="8">
      <el-form label-width="100px" :model="loginForm">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm"> 登录 </el-button>
        </el-form-item>
      </el-form>
    </el-col>
    <el-col :span="8" />
  </el-row>
</template>

<style scoped></style>
