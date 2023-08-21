import http from "@/utils/http";

function getProducts(params) {
  return http.get("cultural-products",params);
}

function getProductsQuery(id) {
  return http.get(`cultural-products/${id}`);
}

function createProducts(params) {
  return http.post("cultural-products", params);
}

function updateProducts(params) {
  return http.put(`cultural-products/${params.id}`, params);
}

function removeProducts(id) {
  return http.remove(`cultural-products/${id}`);
}

function getCategories(params) {
  return http.get("categories", params);
}

function getCategoriesQuery(id) {
  return http.get(`categories/${id}`);
}

function createCategories(params) {
  return http.post("categories", params);
}

function updateCategories(params) {
  return http.put(`categories/${params.id}`, params);
}

function removeCategories(id) {
  return http.remove(`categories/${id}`);
}

export default {
  getProducts,
  getProductsQuery,
  createProducts,
  updateProducts,
  removeProducts,
  getCategories,
  getCategoriesQuery,
  createCategories,
  updateCategories,
  removeCategories,
};
