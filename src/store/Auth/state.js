import { reactive } from "vue";
export const createState = () => ({
  loginFrom: reactive({
    email: "",
    password: "",
    password_confirmation: "",
  }),
  registerFrom: reactive({
    name: "",
    phone_number: "",
    email: "",
    password: "",
    password_confirmation: "",
  }),
  result: {},
});
