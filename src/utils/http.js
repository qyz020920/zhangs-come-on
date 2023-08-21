import axios from "axios";

import { ElMessage } from "element-plus";

// const BASE_URL = "http://127.0.0.1:9090/api/admin";
// const BASE_URL = "https://bloodcare.china-xianxue.com/api/admin";
const BASE_URL = "https://dev.blood-donor-care.com/api/admin";
const IMAGE_UPLOAD_URL = `${BASE_URL}/upload/image`;
const IMAGE_UPLOAD_URL_FILE = `${BASE_URL}/upload/image/file`;

function getClient() {
  return axios.create({
    baseURL: BASE_URL,
    timeout: 1000,
  });
}

async function get(path, params = {}) {
  const response = await getClient()
    .get(path, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      params,
    })
    .catch((error) => {
      return resolveError(error);
    });
  return response.data;
}

async function postWithAnnoymouse(path, data) {
  return getClient()
    .post(path, data)
    .catch((error) => {
      return resolveError(error);
    });
}

async function post(path, data) {
  return getClient()
    .post(path, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .catch((error) => {
      return resolveError(error);
    });
}

async function remove(path, data) {
  return getClient()
    .delete(path, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .catch((error) => {
      return resolveError(error);
    });
}

async function put(path, data) {
  return getClient()
    .put(path, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .catch((error) => {
      return resolveError(error);
    });
}

function resolveError(error) {
  console.log(error);
  let message = "未知错误";
  if (error.response) {
    message = error.response.data.message;
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.replace("/#/login");
    }
  } else {
    if (error.code === "ERR_NETWORK") {
      message = "无法连接到服务器";
    } else {
      message = error.message;
    }
  }

  ElMessage({
    showClose: true,
    grouping: true,
    message,
    type: "error",
  });
}

export default {
  get,
  post,
  postWithAnnoymouse,
  put,
  remove,
  IMAGE_UPLOAD_URL,
  IMAGE_UPLOAD_URL_FILE,
};
