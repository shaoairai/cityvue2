import { createRouter, createWebHashHistory } from "vue-router";
import LoginView from "../views/login/LoginView.vue";
import AdminView from "../views/admin/AdminView.vue";
import AicamView from "../views/admin/pages/aicam/AicamView.vue";
import RadioView from "../views/admin/pages/radio/RadioView.vue";
import AicamDashboard from "../views/admin/pages/aicam/dashboard/AicamDashboard.vue";
import AicamReport from "../views/admin/pages/aicam/report/AicamReport.vue";
import AicamCctv from "../views/admin/pages/aicam/cctv/AicamCctv.vue";
import AicamNotify from "../views/admin/pages/aicam/notify/NotifyView.vue";
import CamList from "../views/admin/pages/aicam/cctv/camlist/CamList.vue";
import CreatecamView from "../views/admin/pages/aicam/cctv/camlist/CreatecamView.vue";
import RadioDashboard from "../views/admin/pages/radio/dashboard/RadioDashboard.vue";
import RadioReport from "../views/admin/pages/radio/report/RadioReport.vue";
import RadioFocus from "../views/admin/pages/radio/focus/RadioFocus.vue";
import FrigateareaView from "../views/admin/pages/aicam/cctv/camlist/FrigateArea.vue";
import AccountView from "../views/admin/pages/accountview/AccountView.vue";

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
              redirect: "/admin/aicam/cctv/setting",
              children: [
                {
                  path: "setting",
                  name: "setting",
                  component: CamList,
                },
                {
                  path: "create",
                  name: "create",
                  component: CreatecamView,
                },
                {
                  path: "frigatearea",
                  name: "frigatearea",
                  component: FrigateareaView,
                },
              ],
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
          redirect: "/admin/radio/dashboard",
          children: [
            {
              path: "dashboard",
              name: "radioDashboard",
              component: RadioDashboard,
            },
            {
              path: "report",
              name: "radioReport",
              component: RadioReport,
            },
            {
              path: "focus",
              name: "focus",
              component: RadioFocus,
            },
          ],
        },
        {
          path: "account",
          name: "account",
          component: AccountView,
        },
      ],
    },
  ],
});

export default router;
