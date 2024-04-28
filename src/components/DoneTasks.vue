<template>
  <div>
    <p class="text-h6 text-center">Tarefas concluídas</p>

    <div v-if="!doneTasks.length && !doneTasksLoading" class="text-caption">
      <p class="message text-grey-7">Não há tarefas concluídas</p>
      <q-list class="grid-container" />
    </div>

    <div class="grid-container" v-else-if="doneTasksLoading">
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
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const doneTasks = ref([]);
const doneTasksLoading = ref(false);

const fetchDoneTasks = async () => {
  try {
    doneTasksLoading.value = true;
    const response = await fetch("http://localhost:8081/tasks/done-tasks");
    const data = await response.json();

    doneTasks.value = data;
  } catch (error) {
    console.error("Erro ao obter tarefas concluídas", error);
  } finally {
    doneTasksLoading.value = false;
  }
};

onMounted(() => {
  fetchDoneTasks();
});
</script>

<style scoped>
.grid-container {
  max-width: 500px;
  height: 400px;
  margin: 0 auto;
  overflow: auto;
  border: 1px solid #eff0f2;
  border-radius: 10px;
}

.task-title {
  word-break: break-all;
}
</style>
