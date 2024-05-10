import { ref } from "vue";
import { api } from "../boot/axios";

const tasks = ref([]);

async function fetchTasks() {
  try {
    const response = await api.get("tasks");
    tasks.value = response.data;
  } catch (error) {
    console.error("Erro ao obter tasks:", error);
  }
}

export function useTaskGrid() {
  return {
    tasks,
    fetchTasks,
  };
}
