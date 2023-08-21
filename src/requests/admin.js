import http from "@/utils/http";

function login(postData) {
  return http.post("login", postData);
}

export default {
  login,
};
