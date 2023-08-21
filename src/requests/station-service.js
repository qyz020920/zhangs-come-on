import http from "@/utils/http";

function getStationServices(stationCode, params = {}) {
  return http.get("stationServices", { stationCode, ...params });
}

function getStationService(id) {
  return http.get(`stationServices/${id}`);
}

function updateStationService(id, stationService) {
  return http.put(`stationServices/${id}`, stationService);
}

function createStationService(stationService) {
  return http.post("stationServices", stationService);
}

function removeStationService(id) {
  return http.remove(`stationServices/${id}`);
}

export default {
  getStationServices,
  getStationService,
  updateStationService,
  createStationService,
  removeStationService,
};
