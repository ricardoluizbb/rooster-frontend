<template>
  <q-page class="flex column flex-center">
    <q-page-container>
      <template v-if="selectedTab === 'MyTasks'">
        <CreateTask class="q-mb-xl" />
        <TaskGrid />
      </template>
      <template v-else-if="selectedTab === 'DoneTasks'">
        <DoneTasks />
      </template>
    </q-page-container>
  </q-page>
</template>

<script setup>
import { defineProps } from "vue";
import { defineComponent } from "vue";
import CreateTask from "../components/CreateTask.vue";
import TaskGrid from "../components/TaskGrid.vue";
import DoneTasks from "../components/DoneTasks.vue";

const props = defineProps(["selectedTab"]);
</script>

<style scoped>
.q-page-container {
  max-width: 950px;
  width: 100%;
  margin: 0 auto;
}
</style>
