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
import { onMounted, onUpdated } from "vue";

const { tasks, fetchTasks } = useTaskGrid();

onMounted(async () => {
  await fetchTasks();
});
</script>

<style scoped>
.grid-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  height: 350px;
  overflow: auto;
  border: 1px solid #eff0f2;
  border-radius: 10px;
}
</style>
