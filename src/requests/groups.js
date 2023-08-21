import http from "@/utils/http";

function groups(params = { page: 1, limit: 10 }) {
  return http.get("groups", params);
}

function creategroups(groups) {
  return http.post("groups", groups);
}

function groupsQuery(id) {
  return http.get(`groups/${id}`);
}

function updateGroups(groups) {
  return http.put(`groups/${groups.id}`, groups);
}

function removeGroups(id) {
  return http.remove(`groups/${id}`);
}

function queryGroupsPosts(id) {
  return http.get(`groups/${id}/posts`);
}

function queryGroupsUsers(id) {
  return http.get(`groups/${id}/users`);
}


function queryPosts(params = { page: 1, limit: 10 }) {
  return http.get("posts", params);
}

function createPosts(posts) {
  return http.post("posts", posts);
}

function queryPostsDetails(id) {
  return http.get(`posts/${id}`);
}

function updatePosts(form) {
  return http.put(`posts/${form.id}`, form);
}

function removePosts(id) {
  return http.remove(`posts/${id}`);
}

function reviewPosts(id) {
  return http.post(`posts/${id}/approved`);
}

function queryPostslistnum(id) {
  return http.get(`posts/${id}/comments`);
}

function queryPostsusernum(id) {
  return http.get(`posts/${id}/like`);
}

export default {
  groups,
  groupsQuery,
  creategroups,
  updateGroups,
  removeGroups,
  queryGroupsPosts,
  queryGroupsUsers,
  queryPosts,
  createPosts,
  queryPostsDetails,
  updatePosts,
  removePosts,
  reviewPosts,
  queryPostslistnum,
  queryPostsusernum,
};
