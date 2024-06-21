<template>
  <div class="col-12 col-md-6 col-lg-6">
    <q-page class="flex flex-center">
      <q-card flat class="card-min-width bg-indigo-2">
        <q-card-section class="row justify-center">
          <div class="text-h5 text-center text-weight-bold text-blue-grey-10">
            Login
          </div>
        </q-card-section>
        <q-card-section class="q-pb-sm">
          <div class="col-12 col-sm-12 col-md-12 col-lg-12 q-mb-md text-white">
            <q-form @submit.prevent="handleLogin">
              <q-input color="deep-purple-7" type="email" outlined v-model="loginForm.email" dense label="Your email*"
                lazy-rules :rules="[val => val && val.length > 0 || 'Please enter your Email']" />
              <q-input color="deep-purple-7" type="password" outlined v-model="loginForm.password" dense
                label="Your Password*" lazy-rules
                :rules="[val => val && val.length > 0 || 'Please enter your Password']" />
            </q-form>
          </div>
          <div class="q-pl-sm q-gutter-sm">
            <q-btn @click="handleLogin" label="Login" rounded color="green" class="full-width" />
          </div>
        </q-card-section>
        <q-card-section class="text-center q-pl-md">
          <q-btn to="Register" label="Register" rounded color="deep-purple-6" class="full-width" no-caps />
          <p class="text-grey-14">Not registered? Create an Account</p>
        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>

<script>
import { reactive } from "vue";
import { useRouter } from 'vue-router';
import { useQuasar } from "quasar";
import { login } from "src/store/Auth/actions.js";

export default {
  name: 'IndexPage',
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const loginForm = reactive({
      email: "",
      password: ""
    });

    const handleLogin = () => {
      login(loginForm)
        .then(authUserResponse => {
          $q.notify({
            progress: true,
            message: "Sucessfully login",
            color: "positive",
            position: "top-right",
          });
          router.push({ name: "Dashboard" });
        })
        .catch(error => {
          console.error('An error occurred:', error);
          $q.notify({
            message: error.response.data.message || 'An error occurred',
            color: 'negative',
            icon: 'error',
            position: 'top',
          });
        });
    };

    return {
      loginForm,
      handleLogin,
    };
  },
};
</script>

<style>
.card-min-width {
  width: 500px;
  min-height: 400px;
}

q-input {
  border-color: whitesmoke;
}
</style>
