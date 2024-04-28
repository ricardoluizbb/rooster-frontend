import { ref, onBeforeUnmount, onMounted } from "vue";
import axios from "axios";
import { useTaskGrid } from "../composables/use-task-grid";
import { useQuasar } from "quasar";

export function useTaskCard(task) {
  const { tasks, fetchTasks } = useTaskGrid();

  const formattedTime = ref("00:00:00");
  const startTime = ref("");
  const endTime = ref("");
  let timerInterval;
  let elapsedPausedTime = 0;
  const timesRecord = ref([]);
  const totalInMilliseconds = ref(0);
  const $q = useQuasar();
  const pauseLoading = ref(false);
  const startLoading = ref(false);
  const disableStartBtn = ref(false);

  const startTask = async (taskID) => {
    if (!taskID) {
      console.error("taskID is undefined or null");
      return;
    }

    try {
      startLoading.value = true;
      disableStartBtn.value = true;
      await axios.post(`http://localhost:8081/tasks/${taskID}/start`);
      startTimer();
      startLoading.value = false;
    } catch (error) {
      console.error(error);
    }
  };

  const startTimer = () => {
    const startTimeStamp = new Date().getTime();
    timerInterval = setInterval(() => {
      const currentTimeStamp = new Date().getTime();
      const elapsedTime = Math.max(
        currentTimeStamp - startTimeStamp + elapsedPausedTime,
        0
      );
      formattedTime.value = formatTime(elapsedTime);
    }, 1000);
  };

  const pauseTask = async (taskID) => {
    if (!taskID) {
      console.error("taskID is undefined or null");
      return;
    }

    try {
      pauseLoading.value = true;
      const response = await axios.post(
        `http://localhost:8081/tasks/${taskID}/pause`
      );
      timesRecord.value = response.data.time_record;
      clearInterval(timerInterval);
      formattedTime.value = timesRecord.value
        ? "00:00:00"
        : formattedTime.value;
      await fetchTasks();
      await getTotalTime(taskID);
    } catch (error) {
      $q.notify({
        message: "É necessário ter iniciado a tarefa",
        color: "negative",
        actions: [{ label: "Fechar", color: "white" }],
        icon: "error_outline",
      });
    } finally {
      disableStartBtn.value = false;
      pauseLoading.value = false;
    }
  };

  async function getTotalTime(taskID) {
    try {
      const response = await axios.get(
        `http://localhost:8081/tasks/${taskID}/total-time`
      );
      totalInMilliseconds.value = response.data.total_time;
    } catch (error) {
      console.error("Error fetching total time:", error);
    }
  }

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  const formatTime = (milliseconds) => {
    if (isNaN(milliseconds)) {
      return "00:00:00";
    }

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    const formattedHours = addZero(hours % 60);
    const formattedMinutes = addZero(minutes % 60);
    const formattedSeconds = addZero(seconds % 60);

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  };

  // Se for de 0 a 9, adiciona um zero à
  const addZero = (num) => {
    return num < 10 ? `0${num}` : num;
  };

  onBeforeUnmount(() => {
    clearInterval(timerInterval);
  });

  onMounted(() => {
    getTotalTime(task.id);
  });

  const formatarData = (dataString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    };

    return new Date(dataString).toLocaleDateString("pt-BR", options);
  };

  return {
    formattedTime,
    startTime,
    endTime,
    timesRecord,
    totalInMilliseconds,
    startLoading,
    pauseLoading,
    disableStartBtn,
    startTask,
    pauseTask,
    isValidDate,
    formatarData,
    getTotalTime,
  };
}
