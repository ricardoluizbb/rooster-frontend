<template>
  <div>
    <div class="grid-container q-mb-md">
      <q-list>
        <TaskCard v-for="task in tasks" :key="task.id" :task="task" />
      </q-list>
    </div>
  </div>
</template>

<script setup>
import TaskCard from "./TaskCard.vue";
import { useTaskGrid } from "../../composables/use-task-grid";

const { tasks, fetchTasks } = useTaskGrid();

fetchTasks();
</script>

<style scoped>
.grid-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  height: 500px;
  overflow: auto;

  border-radius: 10px;
}
</style>
