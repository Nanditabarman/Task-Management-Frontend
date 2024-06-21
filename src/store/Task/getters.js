import { useTaskStore } from "./state";

export const useTaskGetters = () => {
  const taskStore = useTaskStore();

  const getTasks = () => taskStore.tasks;

  return {
    getTasks,
  };
};
