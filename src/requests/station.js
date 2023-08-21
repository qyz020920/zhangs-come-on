import http from "@/utils/http";

function getStations() {
  return http.get("stations");
}

function getStation(id) {
  return http.get(`stations/${id}`);
}

function updateStation(station) {
  return http.put(`stations/${station.id}`, station);
}

function createStation(station) {
  return http.post("stations", station);
}

export default {
  getStations,
  getStation,
  updateStation,
  createStation,
};
