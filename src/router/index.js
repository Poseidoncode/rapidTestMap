import { createRouter, createWebHashHistory } from "vue-router";
import store from "../store";
import Home from "@/App.vue";

const routes = [
  {
    path: "/",
    name: "home",
    meta: {
      title: "home page",
      needNav: true,
    },
    // redirect: "/home",
    component: () => import("@/views/products.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// router.beforeEach((to, from, next) => {
//   if (!store.getters.g_isLogin && to.name !== "Login") {
//     const _authData = sessionStorage.getItem("authData")
//       ? JSON.parse(sessionStorage.getItem("authData"))
//       : null;

//     if (!!_authData?.token) {
//       store.commit("m_setUserData", _authData);
//       next();
//     } else {
//       next({ name: "Login" });
//     }
//   } else {
//     next();
//   }
// });

export default router;
