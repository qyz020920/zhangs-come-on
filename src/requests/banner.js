import http from "@/utils/http";

function getBanners(params = { page: 1, limit: 10 }) {
  return http.get("banners", params);
}

function getBanner(bannerId) {
  return http.get(`banners/${bannerId}`);
}

function createBanner(banner) {
  return http.post("banners", banner);
}

function updateBanner(banner) {
  return http.put(`banners/${banner.id}`, banner);
}

function removeBanner(bannerId) {
  return http.remove(`banners/${bannerId}`);
}

export default {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  removeBanner,
};
