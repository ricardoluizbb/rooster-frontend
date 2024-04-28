<template>
  <div class="flex row justify-center">
    <q-input
      autofocus
      v-model="newTaskTitle"
      class="input-field q-mr-md"
      dense
      outlined
      label="Crie uma tarefa..."
      @keyup.enter="createTask"
    />
    <q-btn
      color="primary"
      :loading="createLoading"
      :disable="!newTaskTitle"
      @click="createTask"
      >Criar</q-btn
    >
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useCreateTask } from "../composables/use-create-task";

const { newTaskTitle, createTask, createLoading } = useCreateTask();
</script>

<style scoped>
.input-field {
  width: 500px;
}
</style>
