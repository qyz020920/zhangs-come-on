import http from "@/utils/http";

function getComments(params) {
  return http.get("comments", params);
}

function getComment(id) {
  return http.get(`comments/${id}`);
}

function approveComment(id, approvement) {
  return http.post(`comments/${id}/approved?approvement=${approvement}`);
}

function removeComment(id) {
  return http.remove(`comments/${id}`);
}

export default {
  getComments,
  getComment,
  approveComment,
  removeComment,
};
