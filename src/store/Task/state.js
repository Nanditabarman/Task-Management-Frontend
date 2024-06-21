import { defineStore } from "pinia";

export const useTaskStore = defineStore({
  id: "task",
  state: () => ({
    tasks: [],
    // Other state variables if needed
  }),
});
