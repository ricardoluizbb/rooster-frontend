<template>
  <p class="text-h6 text-center">Tarefas concluídas</p>
  <div class="grid-container" v-if="doneTasksLoading">
    <q-skeleton v-for="index in 8" :key="index" class="q-mb-sm" height="40px" />
  </div>
  <div v-else>
    <q-list bordered separator class="grid-container">
      <q-item v-for="task in doneTasks" :key="task.id">
        <q-item-section class="task-title">
          <q-item-label class="q-text-wrap">{{ task.title }}</q-item-label>
        </q-item-section>
        <q-item-section side top>
          <q-icon name="check_circle" color="positive" />
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { useDoneTaskGrid } from "../../composables/use-done-tasks-grid";

const { doneTasksLoading, doneTasks, fetchDoneTasks } = useDoneTaskGrid();

fetchDoneTasks();
</script>

<style scoped>
.grid-container {
  max-width: 500px;
  height: 700px;
  margin: 0 auto;
  overflow: auto;
  border: 1px solid #eff0f2;
  border-radius: 10px;
}

.task-title {
  word-break: break-all;
}
</style>
