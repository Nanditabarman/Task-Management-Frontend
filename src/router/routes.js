const routes = [
  {
    path: "/",
    component: () => import("layouts/AuthLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/IndexPage.vue"),
        name: "IndexPage",
      },
      {
        path: "Register",
        component: () => import("pages/RegisterPage.vue"),
        name: "RegisterPage",
      },
    ],
  },

  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "Dashboard",
        component: () => import("src/components/Dashboard.vue"),
        name: "Dashboard",
      },
    ],
  },

  {
    path: "/task-table",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/pages/Tasks/IndexPage.vue"),
        meta: {
          name: "task-table.index",
          requiresAuth: true,
          acl: "user.index",
        },
      },
    ],
  },
  {
    path: "/employee",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/pages/Employee/IndexPage.vue"),
        meta: {
          name: "employee.index",
          requiresAuth: true,
          acl: "user.index",
        },
      },
    ],
  },
  {
    path: "/taskstatus",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/pages/TaskStatus/TaskTable.vue"),
        meta: {
          name: "taskstatus.index",
          requiresAuth: true,
          acl: "user.index",
        },
      },
    ],
  },

  {
    path: "/dashboard",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        component: () => import("src/components/Dashboard.vue"),
        meta: {
          name: "dashboard.index",
          requiresAuth: true,
          acl: "user.index",
        },
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
