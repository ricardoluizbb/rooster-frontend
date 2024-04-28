<template>
  <q-dialog persistent v-model="localShowDialog">
    <q-card>
      <q-card-section>
        <h6 class="q-mt-none q-mb-none">{{ title }}</h6>
      </q-card-section>

      <q-card-section>
        <p>{{ subtitle }}</p>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="primary" @click="cancelDelete" />
        <q-btn
          :loading="confirmationDialogLoading"
          flat
          :label="actionLabel"
          :color="actionLabelColor"
          @click="confirmDelete"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";

const props = defineProps([
  "showDialog",
  "confirmationDialogLoading",
  "title",
  "subtitle",
  "actionLabel",
  "actionLabelColor",
]);
const emit = defineEmits(["cancelAction", "confirmAction"]);

const localShowDialog = ref(props.showDialog);

watch(
  () => props.showDialog,
  (newVal) => {
    localShowDialog.value = newVal;
  }
);

const cancelDelete = () => {
  emit("update:showDialog", false);
  emit("cancelAction");
};

const confirmDelete = () => {
  emit("confirmAction");
};
</script>
