import { ref, onBeforeUnmount, onMounted } from "vue";
import { useTaskGrid } from "../composables/use-task-grid";
import { useQuasar } from "quasar";
import { api } from "../boot/axios";

export function useTaskCard(task) {
  const { fetchTasks } = useTaskGrid();

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
  const deleteTaskLoading = ref(false);
  const showDeleteDialog = ref(false);
  const showDoneTaskDialog = ref(false);
  const doneTaskLoading = ref(false);
  const gridLoading = ref(false);
  const editTitleLoading = ref(false);
  const isEditingTitle = ref(false);
  const editedTitle = ref("");
  const checkLoading = ref(false);
  const editingId = ref(null);
  const dateMask = ref("##/##/#### ##:##:##");
  const editedTimeRecord = ref({
    start_time: "",
    end_time: "",
  });

  const startTask = async (taskID) => {
    if (!taskID) {
      console.error("taskID is undefined or null");
      return;
    }

    try {
      startLoading.value = true;
      disableStartBtn.value = true;
      await api.post(`tasks/${taskID}/start`);
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
      const response = await api.post(`tasks/${taskID}/pause`);
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

  const deleteTask = async (taskID) => {
    try {
      deleteTaskLoading.value = true;
      await api.delete(`tasks/${taskID}`);
      await fetchTasks();
      $q.notify({
        message: "Tarefa excluída com sucesso",
        color: "positive",
        actions: [{ label: "Fechar", color: "white" }],
        icon: "check",
      });
    } catch (error) {
      $q.notify({
        message: "Erro ao excluir a tarefa",
        color: "negative",
        actions: [{ label: "Fechar", color: "white" }],
        icon: "error_outline",
      });
    } finally {
      deleteTaskLoading.value = false;
      showDeleteDialog.value = false;
    }
  };

  const completeTask = async (taskID) => {
    try {
      doneTaskLoading.value = true;
      await api.put(`tasks/${taskID}/complete`);
      await fetchTasks();
      $q.notify({
        message: "Tarefa concluida com sucesso",
        color: "positive",
        actions: [{ label: "Fechar", color: "white" }],
        icon: "check",
      });
    } catch (error) {
      $q.notify({
        message: "Erro ao concluir a tarefa",
        color: "negative",
        actions: [{ label: "Fechar", color: "white" }],
        icon: "error_outline",
      });
    } finally {
      showDoneTaskDialog.value = false;
      doneTaskLoading.value = false;
    }
  };

  const getTotalTime = async (taskID) => {
    try {
      const response = await api.get(`tasks/${taskID}/total-time`);
      totalInMilliseconds.value = response.data.total_time;
    } catch (error) {
      console.error("Error fetching total time:", error);
    }
  };

  const updateTotalTime = async (taskID) => {
    gridLoading.value = true;
    await getTotalTime(taskID);
    await fetchTasks();
    gridLoading.value = false;
  };

  const updateTaskTitle = async (taskID, newTitle) => {
    try {
      editTitleLoading.value = true;
      await api.put(`tasks/${taskID}`, {
        Title: newTitle.value,
      });
      await fetchTasks();
      $q.notify({
        message: "O titulo da tarefa foi atualizado com sucesso",
        color: "positive",
        actions: [{ label: "Fechar", color: "white" }],
        icon: "check",
      });
    } catch (error) {
      $q.notify({
        message: "Houve um erro ao atualizar o titulo da tarefa",
        color: "negative",
        actions: [{ label: "Fechar", color: "white" }],
        icon: "error_outline",
      });
    } finally {
      editTitleLoading.value = false;
    }
  };

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

  const startEditingTitle = (task) => {
    isEditingTitle.value = true;
    editedTitle.value = task.title;
  };

  const stopEditingTitle = (taskID) => {
    updateTaskTitle(taskID, editedTitle);
    isEditingTitle.value = false;
  };

  const cancelEditingTitle = () => {
    isEditingTitle.value = false;
  };

  const convertMillisecondsToTime = () => {
    if (!totalInMilliseconds.value) {
      return "00h 00m 00s";
    }
    const totalSeconds = Math.floor(totalInMilliseconds.value / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (num) => (num < 10 ? `0${num}` : num);

    return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
  };

  const formatDate = (dataString) => {
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

  const toggleEditingMode = (registeredTimeID, task) => {
    if (editingId.value === registeredTimeID) {
      // Se já estiver editando, salve as alterações aqui
      editingId.value = null;
      editedTimeRecord.value = {};
    } else {
      // Se não estiver editando, inicie a edição
      editingId.value = registeredTimeID;
      const timeRecordToEdit = task.registered_times.find(
        (timeRecord) => timeRecord.id === registeredTimeID
      );
      if (timeRecordToEdit) {
        editedTimeRecord.value = { ...timeRecordToEdit };
        // Formatando as datas ao iniciar a edição
        editedTimeRecord.value.start_time = formatDateForInput(
          editedTimeRecord.value.start_time
        );
        editedTimeRecord.value.end_time = formatDateForInput(
          editedTimeRecord.value.end_time
        );
      }
    }
  };

  const updateRegisteredTime = async (registeredTimeID, taskID) => {
    try {
      checkLoading.value = true;
      await api.put(`tasks/${taskID}/registered-times/${registeredTimeID}`, {
        startTime: transformToISOFormat(editedTimeRecord.value.start_time),
        endTime: transformToISOFormat(editedTimeRecord.value.end_time),
      });

      editingId.value = null;
      checkLoading.value = false;
    } catch (error) {
      console.error("Erro ao atualizar o tempo registrado:", error);
    }
  };

  const transformToISOFormat = (inputDate) => {
    const [datePart, timePart] = inputDate.split(" ");
    const [day, month, year] = datePart.split("/");
    const [hour, minute, second] = timePart.split(":");

    const isoDate = new Date(year, month - 1, day, hour, minute, second);

    return isoDate.toISOString();
  };

  const formatDateForInput = (dateString) => {
    // Formata a data para o formato adequado ao exibir no input
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().padStart(4, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
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
    deleteTaskLoading,
    showDeleteDialog,
    showDoneTaskDialog,
    doneTaskLoading,
    gridLoading,
    editTitleLoading,
    isEditingTitle,
    editedTitle,
    checkLoading,
    editingId,
    dateMask,
    editedTimeRecord,
    toggleEditingMode,
    updateRegisteredTime,
    startTask,
    pauseTask,
    isValidDate,
    formatDate,
    deleteTask,
    completeTask,
    updateTotalTime,
    updateTaskTitle,
    startEditingTitle,
    stopEditingTitle,
    cancelEditingTitle,
    convertMillisecondsToTime,
    getTotalTime,
  };
}
