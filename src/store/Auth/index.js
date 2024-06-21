// src/store/Auth/index.js

import * as actions from "./actions";
import * as getters from "./getters";
import { defineStore } from "pinia"; // Correct import statement
import { createState } from "./state";

export const useAuthStore = defineStore("auth", {
  state: createState(),
  actions,
  getters,
});
