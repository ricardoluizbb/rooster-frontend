import { ref } from "vue";
import { useTaskGrid } from "../composables/use-task-grid";
import { api } from "../boot/axios";

export function useCreateTask() {
  const newTaskTitle = ref("");
  const { fetchTasks } = useTaskGrid();
  const createLoading = ref(false);

  const createTask = async () => {
    try {
      if (newTaskTitle.value.trim()) {
        await api.post("tasks", {
          title: newTaskTitle.value,
        });
        newTaskTitle.value = "";
      }
      await fetchTasks();
    } catch (error) {
      console.error("Erro ao criar a tarefa:", error);
    }
  };

  return {
    newTaskTitle,
    createLoading,
    createTask,
  };
}
