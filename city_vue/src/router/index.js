import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from "../views/login/LoginView.vue";
import AdminView from "../views/admin/AdminView.vue";
import AicamView from "../views/admin/pages/aicam/AicamView.vue";
import RadioView from "../views/admin/pages/radio/RadioView.vue";
import AicamDashboard from "../views/admin/pages/aicam/dashboard/AicamDashboard.vue";
import AicamReport from "../views/admin/pages/aicam/report/AicamReport.vue";
import AicamCctv from "../views/admin/pages/aicam/cctv/AicamCctv.vue";
import AicamNotify from "../views/admin/pages/aicam/notify/NotifyView.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main",
      redirect: "/login",
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminView,
      redirect: "/admin/aicam",
      children: [
        {
          path: "aicam",
          name: "aicam",
          component: AicamView,
          redirect: "/admin/aicam/dashboard",
          children: [
            {
              path: "dashboard",
              name: "aicamDashboard",
              component: AicamDashboard,
            },
            {
              path: "report",
              name: "aicamReport",
              component: AicamReport,
            },
            {
              path: "cctv",
              name: "aicamCctv",
              component: AicamCctv,
            },
            {
              path: "notify",
              name: "aicamNotify",
              component: AicamNotify,
            },
          ],
        },
        {
          path: "radio",
          name: "radio",
          component: RadioView,
        },
      ],
    },
  ],
});

export default router;
