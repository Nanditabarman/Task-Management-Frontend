import { useTaskStore } from "./state";

export const useTaskActions = () => {
  const taskStore = useTaskStore();

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/tasks");
      const tasks = await response.json();
      taskStore.tasks = tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const createTask = async (newTask) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/tasks/store", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
      const result = await response.json();
      // Handle result as needed
      return result;
    } catch (error) {
      console.error("Error creating task:", error);
      return false;
    }
  };

  const editTask = async (updatedTask) => {
    // Implement editing task logic
  };

  const deleteTask = async (taskId) => {
    // Implement deleting task logic
  };

  return {
    fetchTasks,
    createTask,
    editTask,
    deleteTask,
  };
};
