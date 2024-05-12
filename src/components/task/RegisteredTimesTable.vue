<template>
  <q-card flat class="q-mt-md q-ml-md">
    <q-card-section class="q-pt-none">
      <p class="text-h6 text-weight-regular">Tempos Registrados</p>
      <q-list v-if="!checkLoading">
        <div v-if="task.registered_times?.length">
          <div
            v-for="timeRecord in task.registered_times"
            :key="timeRecord.id"
            :class="{ 'q-pb-sm': editingId === timeRecord.id }"
          >
            <!-- Modo de edição -->
            <div class="row align-center">
              <template v-if="editingId === timeRecord.id">
                <div class="row">
                  <q-input
                    v-model="editedTimeRecord.start_time"
                    dense
                    outlined
                    label="Início"
                    :mask="dateMask"
                  />
                  <q-input
                    v-model="editedTimeRecord.end_time"
                    dense
                    outlined
                    label="Fim"
                    :mask="dateMask"
                  />
                </div>
              </template>
              <template v-else>
                <q-card
                  class="times-info row justify-between q-pa-xs"
                  :style="{ width: cardWidth }"
                  @click="toggleEditingMode(timeRecord.id, task)"
                  flat
                >
                  <span class="text-body3">
                    {{ formatDate(timeRecord.start_time) }}
                  </span>
                  <q-icon size="20px" color="grey-7" name="arrow_right" />
                  <span class="text-body3">
                    {{ formatDate(timeRecord.end_time) }}
                  </span>
                </q-card>
              </template>

              <!-- Adiciona botão de editar/salvar -->
              <q-btn
                v-if="editingId === timeRecord.id"
                icon="done"
                size="10px"
                flat
                color="grey-7"
                @click="handleUpdateRegisteredTime(timeRecord.id, task.id)"
                :loading="checkLoading"
                :disable="!isInputValid"
              >
                <q-tooltip v-if="!isInputValid"
                  >Preencha neste formato: 01/01/2001 12:00:00</q-tooltip
                >
              </q-btn>
            </div>
          </div>
        </div>
        <span v-else class="text-caption text-grey-7">Não há registros</span>
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
import { defineProps, defineEmits, computed, onMounted } from "vue";
import { useTaskCard } from "../../composables/use-task-card";

const props = defineProps(["task", "gridLoading"]);
const emit = defineEmits(["timeUpdated"]);

const {
  formatDate,
  checkLoading,
  editingId,
  dateMask,
  editedTimeRecord,
  toggleEditingMode,
  updateRegisteredTime,
} = useTaskCard(props.task);

const isInputValid = computed(() => {
  // Verifica se o input contém todos os caracteres do dateMask
  return (
    editedTimeRecord.value.start_time.length === dateMask.value.length &&
    editedTimeRecord.value.end_time.length === dateMask.value.length
  );
});

const handleUpdateRegisteredTime = async (timeRecordID, task) => {
  await updateRegisteredTime(timeRecordID, task);
  emit("timeUpdated");
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
</style>
