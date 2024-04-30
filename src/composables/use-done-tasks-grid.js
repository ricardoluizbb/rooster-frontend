import { ref } from "vue";
import { api } from "../boot/axios";

export function useDoneTaskGrid() {
  const doneTasksLoading = ref(false);
  const doneTasks = ref([]);

  const fetchDoneTasks = async () => {
    try {
      doneTasksLoading.value = true;
      const response = await api.get("tasks/done-tasks");
      const data = await response.data;
      doneTasks.value = data;
    } catch (error) {
      $q.notify({
        message: "Houve um erro ao carregar as tarefas",
        color: "negative",
        actions: [{ label: "Fechar", color: "white" }],
        icon: "error_outline",
      });
    } finally {
      doneTasksLoading.value = false;
    }
  };

  return {
    doneTasksLoading,
    doneTasks,
    fetchDoneTasks,
  };
}
