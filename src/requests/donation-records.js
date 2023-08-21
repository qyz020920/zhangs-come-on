import http from "@/utils/http";

function getAll(userId) {
  return http.get(`donation-records?userId=${userId}`);
}

export default {
  getAll,
};
