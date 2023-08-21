import http from "@/utils/http";

function getRegions() {
  return http.get("regions");
}

function getBindings(sourceType, sourceId) {
  return http.get(`regions/bindings?sourceType=${sourceType}&sourceId=${sourceId}`);
}

function createBind(regionId, sourceType, sourceId) {
  return http.post(`regions/${regionId}/bind?sourceType=${sourceType}&sourceId=${sourceId}`);
}

function removeBind(regionId, sourceType, sourceId) {
  return http.remove(`regions/${regionId}/bind?sourceType=${sourceType}&sourceId=${sourceId}`);
}

export default {
  getRegions,
  createBind,
  removeBind,
  getBindings,
};
