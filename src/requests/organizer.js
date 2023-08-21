import http from "@/utils/http";

function getOrganizers() {
  return http.get("organizers");
}

function getOrganizer(organizerId) {
  return http.get(`organizers/${organizerId}`);
}

function createOrganizer(organizer) {
  return http.post("organizers", organizer);
}

function updateOrganizer(organizer) {
  return http.put(`organizers/${organizer.id}`, organizer);
}

function removeOrganizer(organizerId) {
  return http.remove(`organizers/${organizerId}`);
}

export default {
  getOrganizers,
  getOrganizer,
  createOrganizer,
  updateOrganizer,
  removeOrganizer,
};
