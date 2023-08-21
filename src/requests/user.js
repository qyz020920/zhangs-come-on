import http from "@/utils/http";

function getUsers(params = { page: 1, limit: 10 }) {
  return http.get("users", params);
}

function getUserInfo(id) {
  return http.get(`users/${id}`);
}

function getUsersCount() {
  return http.get("users/count");
}

function getIdentityUpdateApplies() {
  return http.get("users/identityUpdateApplies");
}

function updateIdentityUpdateApplies(id, status, reason) {
  return http.post(`users/identityUpdateApplies/${id}?approved=${status}&reason=${reason}`);
}

function getDonateSummaries() {
  return http.get("users/donateSummaries");
}

export default {
  getUsers,
  getUserInfo,
  getIdentityUpdateApplies,
  updateIdentityUpdateApplies,
  getDonateSummaries,
  getUsersCount,
};
