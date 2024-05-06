<template>
  <div class="flex row justify-center">
    <q-img
      src="../../assets/rooster1.svg"
      style="height: 134px; max-width: 565px"
      class="q-mb-md"
    ></q-img>
    <q-input
      hint="Pressione enter para criar"
      autofocus
      v-model="newTaskTitle"
      class="input-field q-mr-md"
      outlined
      rounded
      label="Crie uma tarefa..."
      @keyup.enter="createTask"
    />
  </div>
</template>

<script setup>
import { useCreateTask } from "../../composables/use-create-task";

const { newTaskTitle, createTask } = useCreateTask();
</script>

<style scoped>
.input-field {
  width: 800px;
}
</style>
