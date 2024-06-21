<template>
  <q-layout view="lhh lpR lFf " class="bg-deep-purple-1">
    <q-header bordered class="bg-deep-purple-1 q-pt-sm">
      <q-toolbar class="bg-deep-purple-1">
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" color="deep-purple-6" />

        <q-toolbar-title class="text-blue-grey-10 text-weight-bold">
          <p>{{ user ? user.name : 'Overview' }}<br><span class="text-subtitle1">
              {{ formattedDateTime }}</span>
          </p>
        </q-toolbar-title>
        <div class="col-auto q-mr-md">
          <q-input rounded outlined v-model="text" label="Search Something " class="text-deep-purple-6">
            <template v-slot:append>
              <q-icon name="search" class="text-deep-purple-6" />
            </template>
          </q-input>
        </div>
        <div class="col-auto q-mr-md">
          <q-avatar clickable @click="openLogoutDialog">
            <img src="/admin.jpg">
          </q-avatar>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="q-pa-md"
      style=" background-image: linear-gradient(to right, rgba(151, 66, 255, 0.242), rgba(132, 31, 255, 0.232)), url('/mp-menu.jpg'); background-position: center; background-size: cover;">
      <q-list class=" bg-white q-pa-md" style="border-radius: 10px;">
        <q-separator />
        <q-item-label header class="text-grey-10 text-weight-bold text-subtitle1 text-center"> TASK MANAGEMENT
        </q-item-label>
        <q-avatar style="margin-left: 35%;" size="70px">
          <img src="/admin.jpg">
        </q-avatar>
        <q-separator class="q-my-md" />

        <EssentialLink active-class="active-item" v-for="link in essentialLinks" :key="link.title" :title="link.title"
          :link="link.link" :icon="link.icon" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
    <LogoutDialog ref="logoutDialog" />
  </q-layout>

</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { fetchAuthUser } from "src/store/Auth/actions.js";
import EssentialLink from "components/EssentialLink.vue";
import { useQuasar } from "quasar";
import { useRouter, useRoute } from "vue-router";
import LogoutDialog from 'src/components/LogoutDialog.vue'

const linksList = [
  {
    title: "DashBoard",
    icon: "dashboard",
    link: "/dashboard",
  },
  {
    title: "Tasks List",
    icon: "task",
    link: "/task-table",
  },
  {
    title: "Employee List",
    icon: "groups",
    link: "/employee",
  },
  {
    title: "Settings",
    icon: "checklist_rtl",
    link: "https://forum.quasar.dev",
  },
  {
    title: "Help Center",
    icon: "contacts",
    link: "https://forum.quasar.dev",
  },
];

export default defineComponent({
  name: "MainLayout",
  components: {
    EssentialLink,
    LogoutDialog
  },
  setup() {
    const leftDrawerOpen = ref(false);
    const user = ref(null);
    const $q = useQuasar();
    const router = useRouter();
    const logoutDialog = ref(null)

    const getUserData = () => {
      fetchAuthUser()
        .then(response => {
          user.value = response.data;
        })
        .catch(error => {
          console.error('Error fetching authenticated user:', error);
        });
    };

    const formattedDateTime = computed(() => {
      const now = new Date();
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
      return now.toLocaleString('en-US', options);
    });



    const openLogoutDialog = () => {
      logoutDialog.value.show = true
    }




    onMounted(() => {
      getUserData();
    });

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      formattedDateTime,
      user,
      logoutDialog,
      openLogoutDialog,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

<style>
.q-drawer {
  border-right: 2px solid black;
  background-color: rgba(151, 66, 255, 0.242), rgba(132, 31, 255, 0.232);
}
</style>
