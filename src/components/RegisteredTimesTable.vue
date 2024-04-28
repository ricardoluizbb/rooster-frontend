<template>
  <q-card flat class="q-mt-md q-ml-md">
    <q-card-section class="q-pt-none">
      <p class="text-center text-h6 text-weight-regular">Tempos Registrados</p>
      <q-list v-if="!gridLoading">
        <div v-if="task.timesRecord.length">
          <div v-for="timeRecord in task.timesRecord" :key="timeRecord.id"
            :class="{ 'q-pb-sm': editingId === timeRecord.id }">
            <!-- Modo de edição -->
            <div class="row align-center">
              <template v-if="editingId === timeRecord.id">
                <div class="row">
                  <q-input v-model="editedTimeRecord.start_time" dense outlined label="Início" :mask="dateMask" />
                  <q-input v-model="editedTimeRecord.end_time" dense outlined label="Fim" :mask="dateMask" />
                </div>
              </template>
              <template v-else>
                <q-card class="times-info row justify-between" :style="{ width: cardWidth }"
                  @click="toggleEditingMode(timeRecord.id)" flat>
                  <span class="text-caption">
                    {{ formatarData(timeRecord.start_time) }}
                  </span>
                  <q-icon color="grey-7" name="arrow_right_alt" />
                  <span class="text-caption">
                    {{ formatarData(timeRecord.end_time) }}
                  </span>
                </q-card>
              </template>

              <!-- Adiciona botão de editar/salvar -->
              <q-btn v-if="editingId === timeRecord.id" icon="done" size="10px" flat color="grey-7"
                @click="updateRegisteredTime(timeRecord.id)" :loading="checkLoading" :disable="!isInputValid">
                <q-tooltip v-if="!isInputValid">Preencha neste formato: 01/01/2001 12:00:00</q-tooltip>
              </q-btn>
            </div>
          </div>
        </div>
        <div v-else flat class="empty-time text-center">
          <span class="text-caption text-grey-7">Não há registros</span>
        </div>
      </q-list>
      <q-list v-else>
        <q-skeleton class="q-mb-sm" :style="{ width: skeletonWidth }" />
        <q-skeleton class="q-mb-sm" :style="{ width: skeletonWidth }" />
        <q-skeleton class="q-mb-sm" :style="{ width: skeletonWidth }" />
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
import axios from "axios";
import { ref, defineProps, defineEmits, computed, onMounted } from "vue";
import { useTaskCard } from "../composables/use-task-card";
import { useTaskGrid } from "../composables/use-task-grid";

const props = defineProps(["task", "gridLoading"]);
const emit = defineEmits(["timeUpdated"]);

const { formatarData } = useTaskCard(props.task);
const { RegisteredTimesLoading } = useTaskGrid();
const checkLoading = ref(false);

const editingId = ref(null);
const editedTimeRecord = ref({
  start_time: "",
  end_time: "",
});

const dateMask = "##/##/#### ##:##:##";

const isInputValid = computed(() => {
  // Verifica se o input contém todos os caracteres do dateMask
  return (
    editedTimeRecord.value.start_time.length === dateMask.length &&
    editedTimeRecord.value.end_time.length === dateMask.length
  );
});

const toggleEditingMode = (id) => {
  if (editingId.value === id) {
    // Se já estiver editando, salve as alterações aqui
    editingId.value = null;
    editedTimeRecord.value = {};
  } else {
    // Se não estiver editando, inicie a edição
    editingId.value = id;
    const timeRecordToEdit = props.task.timesRecord.find(
      (timeRecord) => timeRecord.id === id
    );
    if (timeRecordToEdit) {
      editedTimeRecord.value = { ...timeRecordToEdit };
      // Formatando as datas ao iniciar a edição
      editedTimeRecord.value.start_time = formatDateForInput(
        editedTimeRecord.value.start_time
      );
      editedTimeRecord.value.end_time = formatDateForInput(
        editedTimeRecord.value.end_time
      );
    }
  }
};

const updateRegisteredTime = async (id) => {
  const url = `http://localhost:8081/tasks/${props.task.id}/registered-times/${id}`;
  try {
    checkLoading.value = true;
    const response = await axios.put(url, {
      startTime: transformToISOFormat(editedTimeRecord.value.start_time),
      endTime: transformToISOFormat(editedTimeRecord.value.end_time),
    });

    editingId.value = null;
    emit("timeUpdated");
    checkLoading.value = false;
  } catch (error) {
    console.error("Erro ao atualizar o tempo registrado:", error);
  }
};

const transformToISOFormat = (inputDate) => {
  const [datePart, timePart] = inputDate.split(" ");
  const [day, month, year] = datePart.split("/");
  const [hour, minute, second] = timePart.split(":");

  const isoDate = new Date(year, month - 1, day, hour, minute, second);

  return isoDate.toISOString();
};

const formatDateForInput = (dateString) => {
  // Formata a data para o formato adequado ao exibir no input
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString().padStart(4, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};

const cardWidth = computed(() => {
  return window.innerWidth > 600 ? "395px" : "100%";
});

const skeletonWidth = computed(() => {
  return window.innerWidth > 600 ? "395px" : "100%";
});
</script>

<style scoped>
.times-info {
  cursor: pointer;
}

.empty-time {
  height: 100px;
  width: 260px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
