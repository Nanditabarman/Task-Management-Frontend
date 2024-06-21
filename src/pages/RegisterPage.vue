<template>
  <div class="col-12 col-md-6 col-lg-6">
    <q-page class="flex flex-center ">
      <q-card flat class="card-min-width bg-indigo-2">
        <q-card-section class="row justify-center">
          <div class="text-h5 text-center text-weight-bold text-blue-grey-10">
            Register
          </div>
        </q-card-section>
        <q-card-section class="q-pb-sm">
          <q-form @submit.prevent="register" class="q-pb-md">
            <div class="q-col-gutter-md row">
              <div class="col-12 col-md-6 col-lg-6  q-pb-md">
                <q-input color="deep-purple-7" type="text" outlined v-model="registerFrom.name" label="Name" lazy-rules
                  :rules="[val => val && val.length > 0 || 'Please Enter Your name']" hint="Please Enter Your Name" />
              </div>
              <div class="col-12 col-md-6 col-lg-6 q-pb-md">
                <q-input color="deep-purple-7" type="email" outlined v-model="registerFrom.email" label="Your Email*"
                  lazy-rules :rules="[val => val && val.length > 0 || 'Please Enter Your Email']"
                  hint="Please Enter Your Email" />
              </div>
            </div>
            <q-input color="deep-purple-7" type="number" outlined v-model="registerFrom.phone_number" label="Phone Number"
              lazy-rules :rules="[val => val && val.length > 0 || 'Please Enter Your Phone Number']" />

            <q-input color="deep-purple-7" type="password" outlined v-model="registerFrom.password" label="Password"
              lazy-rules :rules="[val => val && val.length > 0 || 'Please Enter Your password']" />
            <q-input color="deep-purple-7" type="password" outlined v-model="registerFrom.password_confirmation"
              label="Comfirmation Password" lazy-rules
              :rules="[val => val && val.length > 0 || 'Comfirmation Password']" />
          </q-form>
          <div class="q-pl-sm q-gutter-sm">
            <q-btn @click="register" label="Register" rounded color="green" class="full-width" no-caps />
          </div>
        </q-card-section>
        <q-card-section class="text-center q-pl-md">
          <q-btn to="./" label="Login" rounded color="deep-purple-6" class="full-width" no-caps />
          <p class="text-grey-14">Already Have an Account?</p>
        </q-card-section>
      </q-card>
    </q-page>
  </div>
</template>

<script>
import { reactive, ref } from "vue";
import { useAuthActions } from 'src/store/Auth/actions';
import { useRouter } from 'vue-router';

export default {
  name: 'RegisterPage',
  setup() {
    const router = useRouter();
    const registerFrom = reactive({
      name: "",
      phone_number: "",
      email: '',
      password: '',
      password_confirmation: '',
    });

    const { register: performRegister } = useAuthActions(); // Use a different variable name
    const RegiaterResult = ref(null);
    const register = () => {
      performRegister(registerFrom)
        .then(result => {
          RegiaterResult.value = result;
          if (RegiaterResult.value === true) {
            alert('Regiater Successfully');
            router.push({ name: "IndexPage", });
          } else {
            alert('Regiater Failed');
          }
        })
        .catch(error => {
          console.error('An error occurred:', error);
        });
    };

    return {
      registerFrom,
      register,
      RegiaterResult,
    };
  },
};
</script>

<style>
.create-account-card {
  width: 700px;
  max-height: 100%;
}
</style>
