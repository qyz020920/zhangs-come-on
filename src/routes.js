import { createRouter, createWebHashHistory } from "vue-router";

import Users from "./pages/users/Index.vue";
import UserDetail from "./pages/users/Detail.vue";
import Events from "./pages/events/Index.vue";
import EventDetail from "./pages/events/Detail.vue";
import Banners from "./pages/banners/Index.vue";
import Organizers from "./pages/organizers/Index.vue";
import Namings from "./pages/namings/Index.vue";
import Stations from "./pages/stations/Index.vue";
import StationDetail from "./pages/stations/Detail.vue";
import Dashboard from "./pages/Dashboard.vue";
import Login from "./pages/Login.vue";
import IdentityUpdateApplies from "./pages/users/IdentityUpdateApplies.vue";
import UserDonateSummaries from "./pages/users/DonateSummaries.vue";
import Create from "./pages/circle/groups.vue";
import Manage from "./pages/circle/posts.vue";
import commodityManagement from "./pages/creative/commodityManagement.vue";
import Category from "./pages/creative/category.vue";

const routes = [
  {
    path: "/login",
    meta: { title: "登录", loginLayout: true },
    component: Login,
  },
  {
    path: "/",
    meta: { title: "首页" },
    component: Dashboard,
  },
  {
    path: "/users",
    meta: { title: "用户" },
    component: Users,
  },
  {
    path: "/users/:id",
    meta: { title: "用户详情" },
    component: UserDetail,
  },
  {
    path: "/identity-update-applies",
    meta: { title: "信息更正申请" },
    component: IdentityUpdateApplies,
  },
  {
    path: "/user-donate-summaries",
    meta: { title: "献血数据" },
    component: UserDonateSummaries,
  },
  {
    path: "/namings",
    meta: { title: "征名活动" },
    component: Namings,
  },
  {
    path: "/events",
    meta: { title: "新版活动" },
    component: Events,
  },
  {
    path: "/events/:id",
    meta: { title: "新版活动详情" },
    component: EventDetail,
  },
  {
    path: "/banners",
    meta: { title: "新版 Banner" },
    component: Banners,
  },
  {
    path: "/stations",
    meta: { title: "血站管理" },
    component: Stations,
  },
  {
    path: "/stations/:id",
    meta: { title: "血站详情" },
    name: "station-detail",
    component: StationDetail,
  },
  {
    path: "/organizers",
    meta: { title: "机构管理" },
    component: Organizers,
  },
  {
    path: "/groups",
    meta: { title: "创建圈子" },
    component: Create,
  },
  {
    path: "/posts",
    meta: { title: "帖子管理" },
    component: Manage,
  },
  {
    path: "/commodity-management",
    meta: { title: "商品管理" },
    component: commodityManagement,
  },
  {
    path: "/category",
    meta: { title: "产品类别字典" },
    component: Category,
  },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 };
  },
});
