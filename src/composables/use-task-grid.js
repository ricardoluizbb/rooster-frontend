import { ref } from "vue";
import { api } from "../boot/axios";

const tasks = ref([]);

async function fetchTasks() {
  try {
    const response = await api.get("tasks", {
      withCredentials: true,
    });
    tasks.value = response.data.map((task) => ({
      ...task,
      timesRecord: task.registered_times || [],
    }));
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
