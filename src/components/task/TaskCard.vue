<template>
  <div>
    <q-expansion-item popup class="expansion-item" switch-toggle-side>
      <!-- Closed Expansion item -->
      <template v-slot:header>
        <div style="width: 100%" class="row justify-between">
          <div
            style="min-width: 200px"
            v-if="!isEditingTitle"
            class="flex column task-title"
          >
            <q-skeleton v-if="editTitleLoading" class="q-mb-sm" width="350px" />
            <span v-else @click.stop="startEditingTitle(task)">{{
              task.title
            }}</span>
            <span class="text-grey-7">
              {{ convertMillisecondsToTime() }}
            </span>
          </div>
          <div v-else>
            <q-input
              autofocus
              v-model="editedTitle"
              dense
              style="width: 500px"
              outlined
              @keypress.enter="stopEditingTitle(task.id)"
              @blur="cancelEditingTitle(task.id)"
            />
          </div>
          <div v-if="!isEditingTitle" class="row q-gutter-xs">
            <div class="column text-caption text-center q-pr-md">
              <span>Cronômetro</span>
              <q-chip dense class="text-grey-7">{{ formattedTime }}</q-chip>
            </div>
            <q-btn
              v-if="disableStartBtn"
              no-caps
              flat
              dense
              icon="stop_circle"
              color="primary"
              :loading="pauseLoading"
              @click.stop="pauseTask(task.id)"
            >
              <q-tooltip>Pausar</q-tooltip>
            </q-btn>
            <q-btn
              v-else
              flat
              dense
              icon="play_circle"
              color="primary"
              :loading="startLoading"
              @click.stop="startTask(task.id)"
            >
              <q-tooltip>Iniciar</q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              icon="check_circle"
              color="positive"
              :disable="disableStartBtn"
              @click.stop="showDoneTaskDialog = true"
            >
              <q-tooltip>Concluir</q-tooltip>
            </q-btn>
            <q-btn
              flat
              dense
              icon="delete"
              color="negative"
              :disable="disableStartBtn"
              @click.stop="showDeleteDialog = true"
            >
              <q-tooltip>Excluir</q-tooltip>
            </q-btn>
          </div>
        </div>
      </template>

      <!-- Opened expansion item -->
      <q-card bordered class="row justify-between task-card">
        <RegisteredTimesTable
          @timeUpdated="updateTotalTime(task.id)"
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
import CreateObservation from "./CreateObservation.vue";
import { useTaskCard } from "../../composables/use-task-card";
import RegisteredTimesTable from "./RegisteredTimesTable.vue";
import ConfirmationDialog from "../shared/ConfirmationDialog.vue";

const props = defineProps(["task"]);
const emit = defineEmits(["taskDeleted"]);

const {
  formattedTime,
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
  startTask,
  pauseTask,
  updateTotalTime,
  deleteTask,
  completeTask,
  startEditingTitle,
  stopEditingTitle,
  cancelEditingTitle,
  convertMillisecondsToTime,
  getTotalTime,
} = useTaskCard(props.task);

getTotalTime(props.task.id);
</script>

<style scoped>
.expansion-item {
  width: 100%;
  margin: 0 auto;
}

.task-card {
  width: 100%;
  border-radius: 10px;
  height: 100%;
}

.task-title {
  width: 600px;
  word-break: break-all;
}
</style>
