import http from "@/utils/http";

function getNamings(params) {
  return http.get("namings", params);
}

function getNaming(id) {
  return http.get(`namings/${id}`);
}

function getNamingCount(type, approved) {
  if (approved !== undefined) {
    return http.get(`namings/namings/count?type=${type}&approved=${approved}`);
  } else {
    return http.get(`namings/namings/count?type=${type}`);
  }
}

function approve(id, approved) {
  return http.post(`namings/${id}/approved?approved=${approved}`);
}

export default {
  getNamings,
  getNaming,
  approve,
  getNamingCount,
};
