<template>
  <q-card class="q-mt-md" flat>
    <div class="q-mr-lg" style="width: 395px">
      <div v-if="!task.tag" class="row">
        <p class="text-h6 text-weight-regular">Observação</p>
        <q-input
          :disable="observationBtnLoading"
          v-model="observationText"
          @keypress.enter="addObservation(task.id)"
          label="Pressione enter para criar"
          class="full-width"
          type="text"
          dense
          outlined
        />
      </div>
      <div v-else>
        <p class="text-h6 text-weight-regular">Observação</p>
        <div class="row" v-if="isEditing">
          <q-input
            v-model="observationText"
            @keypress.enter="addObservation(task.id)"
            @click.stop="startEditing"
            class="full-width"
            type="text"
            outlined
            dense
          />
        </div>
        <p
          @click.stop="startEditing"
          v-else
          class="observation text-justify text-body3"
          style="word-break: break-word"
        >
          {{ task.tag }}
        </p>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { ref, defineProps } from "vue";
import { useTaskGrid } from "../../composables/use-task-grid";
import { api } from "../../boot/axios";

const { fetchTasks } = useTaskGrid();

const observationText = ref("");
const isEditing = ref(false);
const props = defineProps(["task"]);
const observationBtnLoading = ref(false);

const addObservation = async (taskID) => {
  try {
    observationBtnLoading.value = true;
    await api.post(`tasks/${taskID}/tags`, {
      tag: observationText.value,
    });

    observationText.value = "";
    await fetchTasks();
    isEditing.value = false;
    observationBtnLoading.value = false;
  } catch (error) {
    console.error(error);
  }
};

const startEditing = () => {
  observationText.value = props.task.tag;
  isEditing.value = true;
};
</script>

<style scoped>
.observation {
  cursor: pointer;
}
</style>
