import { createPinia } from "pinia";
import { useTaskStore } from "./state";

const pinia = createPinia();

export { useTaskStore };

export default pinia;
