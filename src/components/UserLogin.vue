<template>
  <q-page class="page-container flex flex-center">
    <q-card style="width: 400px; height: 200px">
      <q-card-section class="q-pt-none">
        <div class="text-h6 text-center q-mt-md">Login</div>
      </q-card-section>
      <q-card-section>
        <q-input
          class="q-mb-md"
          dense
          v-model="email"
          label="E-mail"
          outlined
        />
        <q-btn
          style="width: 100%"
          dense
          color="primary"
          label="Enviar"
          @click="submit"
        />
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";

const email = ref("");
const $q = useQuasar;

function submit() {
  $q.dialog.notify({
    message: "E-mail enviado",
    position: "bottom",
  });
}
</script>

<style scoped>
.page-container {
  background-color: #458bd1;
}
</style>
