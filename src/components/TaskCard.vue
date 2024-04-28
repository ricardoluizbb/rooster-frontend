<template>
  <div>
    <q-expansion-item class="expansion-item" switch-toggle-side>
      <!-- Closed Expansion item -->
      <template v-slot:header>
        <div style="width: 100%" class="row justify-between">
          <div
            style="min-width: 200px"
            v-if="!isEditing"
            class="flex column task-title"
          >
            <q-skeleton v-if="editTitleLoading" class="q-mb-sm" width="350px" />
            <span v-else @click.stop="startEditing">{{ task.title }}</span>
            <span class="text-grey-7">
              {{ convertMillisecondsToTime(totalInMilliseconds) }}
            </span>
          </div>
          <div v-else>
            <q-input
              autofocus
              v-model="editedTitle"
              dense
              style="width: 500px"
              outlined
              @click.stop
              @keypress.enter="stopEditing(task.id)"
              @blur="cancelEditing(task.id)"
            />
          </div>
          <div v-if="!isEditing" class="column text-caption text-center">
            <span>Cronômetro</span>
            <q-chip dense class="text-grey-7">{{ formattedTime }}</q-chip>
          </div>
          <div class="row">
            <q-btn
              v-if="disableStartBtn"
              class="q-pr-sm"
              flat
              dense
              icon="stop_circle"
              label="Parar"
              color="primary"
              :loading="pauseLoading"
              @click.stop="pauseTask(task.id)"
            />
            <q-btn
              v-else
              class="q-pr-sm"
              flat
              dense
              icon="play_circle"
              label="Iniciar"
              color="primary"
              :loading="startLoading"
              @click.stop="startTask(task.id)"
            />
            <q-btn
              flat
              dense
              icon="check_circle"
              label="Concluir"
              color="positive"
              :disable="disableStartBtn"
              @click.stop="showDoneTaskDialog = true"
            />
            <q-btn
              flat
              dense
              icon="delete"
              label="Excluir"
              color="negative"
              :disable="disableStartBtn"
              @click.stop="showDeleteDialog = true"
            />
          </div>
        </div>
      </template>

      <!-- Opened expansion item -->
      <q-card bordered class="row justify-between task-card">
        <RegisteredTimesTable
          @timeUpdated="updateTotalTime(taskID)"
          :task="task"
          :gridLoading="gridLoading"
        />
        <CreateObservation :task="task" class="q-mb-md" />
      </q-card>

      <!-- Delete task dialog -->
      <ConfirmationDialog
        :confirmationDialogLoading="deleteTaskLoading"
        :showDialog="showDeleteDialog"
        :actionLabel="'Excluir'"
        :actionLabelColor="'negative'"
        :title="'Excluir'"
        :subtitle="'Tem certeza que quer excluir essa tarefa?'"
        @update:showDialog="(value) => (showDeleteDialog = value)"
        @cancelAction="showDeleteDialog = false"
        @confirmAction="deleteTask(task.id)"
      />

      <!-- Conclude task dialog -->
      <ConfirmationDialog
        :confirmationDialogLoading="doneTaskLoading"
        :showDialog="showDoneTaskDialog"
        :actionLabel="'Concluir'"
        :actionLabelColor="'positive'"
        :title="'Concluir'"
        :subtitle="'Tem certeza que quer concluir essa tarefa?'"
        @update:showDialog="(value) => (showDoneTaskDialog = value)"
        @cancelAction="showDoneTaskDialog = false"
        @confirmAction="completeTask(task.id)"
      />
    </q-expansion-item>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref, onMounted, onBeforeUnmount } from "vue";
import axios from "axios";
import CreateObservation from "../components/CreateObservation.vue";
import { useTaskCard } from "../composables/use-task-card";
import { useTaskGrid } from "../composables/use-task-grid";
import RegisteredTimesTable from "../components/RegisteredTimesTable.vue";
import ConfirmationDialog from "./ConfirmationDialog.vue";
import { api } from "../boot/axios";

const deleteTaskLoading = ref(false);
const doneTaskLoading = ref(false);
const gridLoading = ref(false);
const editTitleLoading = ref(false);

const isEditing = ref(false);
const editedTitle = ref("");
const showDeleteDialog = ref(false);
const showDoneTaskDialog = ref(false);

const props = defineProps(["task"]);
const emit = defineEmits(["taskDeleted"]);

const {
  formattedTime,
  startTask,
  pauseTask,
  cancelDeleteTask,
  isValidDate,
  totalInMilliseconds,
  getTotalTime,
  startLoading,
  pauseLoading,
  disableStartBtn,
} = useTaskCard(props.task);

const { fetchTasks } = useTaskGrid();

async function updateTotalTime(taskID) {
  gridLoading.value = true;
  await getTotalTime(props.task.id);
  await fetchTasks();
  gridLoading.value = false;
}

const deleteTask = async (taskID) => {
  try {
    deleteTaskLoading.value = true;
    await api.delete(`tasks/${taskID}`);
    await fetchTasks();
    deleteTaskLoading.value = false;
    showDeleteDialog.value = false;
  } catch (error) {
    console.error(error);
  }
};

const completeTask = async (taskID) => {
  doneTaskLoading.value = true;
  try {
    await api.put(`tasks/${taskID}/complete`);
    await fetchTasks();
  } catch (error) {
    console.error("Erro ao concluir a tarefa:", error);
  } finally {
    doneTaskLoading.value = false;
  }
};

const startEditing = () => {
  isEditing.value = true;
  editedTitle.value = props.task.title;
};

const stopEditing = (taskID) => {
  updateTaskTitle(taskID, editedTitle);
  isEditing.value = false;
};

const cancelEditing = () => {
  isEditing.value = false;
};

const updateTaskTitle = async (taskID, newTitle) => {
  editTitleLoading.value = true;
  try {
    await api.put(`tasks/${taskID}`, {
      Title: newTitle.value,
    });
    await fetchTasks();
  } catch (error) {
    console.error(error);
  } finally {
    editTitleLoading.value = false;
  }
};

const convertMillisecondsToTime = (milliseconds) => {
  if (!milliseconds) {
    return "00h 00m 00s";
  }
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const pad = (num) => (num < 10 ? `0${num}` : num);

  return `${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`;
};

onMounted(() => {
  // Adiciona um ouvinte para o mudança de evento antes de descarregar o componente
  window.addEventListener("beforeunload", saveTaskTime);
});

onBeforeUnmount(() => {
  // Remove o ouvinte do evento antes de descarregar o componente
  window.removeEventListener("beforeunload", saveTaskTime);
});

const saveTaskTime = () => {
  // Salva o tempo atual do cronômetro no armazenamento local
  localStorage.setItem("taskTime", totalInMilliseconds.value.toString());
};
</script>

<style scoped>
.expansion-item {
  width: 100%;
  max-width: 950px;
  margin: 0 auto;
}

.task-card {
  width: 100%;
  border-radius: 10px;
  height: 100%;
}

.task-title {
  width: 300px;
  word-break: break-all;
}
</style>
