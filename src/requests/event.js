import http from "@/utils/http";

function getEvents(params = { page: 1, limit: 10 }) {
  return http.get("events", params);
}

function getEvent(eventId) {
  return http.get(`events/${eventId}`);
}

function createEvent(event) {
  return http.post("events", event);
}

function updateEvent(event) {
  return http.put(`events/${event.id}`, event);
}

function removeEvent(eventId) {
  return http.remove(`events/${eventId}`);
}

export default {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  removeEvent,
};
