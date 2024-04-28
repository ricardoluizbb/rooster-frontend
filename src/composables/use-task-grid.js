import { ref } from "vue";
import axios from "axios";

const tasks = ref([]);

async function fetchTasks() {
  try {
    const response = await axios.get("http://localhost:8081/tasks", {
      withCredentials: true
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
