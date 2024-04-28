<template>
  <q-page class="page-container flex flex-center">
    <q-card style="width: 400px; height: 300px">
      <q-card-section class="text-center">
        <q-img
          src="../assets/rooster1.svg"
          style="height: 67px; max-width: 282px"
        ></q-img>
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
          :loading="sendButtonLoading"
          style="width: 100%"
          dense
          color="primary"
          label="Criar conta"
          @click="submit(email)"
        />
      </q-card-section>
      <q-card-section class="text-center">
        <span class="text-caption"
          >Digite seu e-mail para criar uma conta!</span
        >
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useLogin } from "../composables/use-login";

const { createAccountForm } = useLogin();

const email = ref("");
const sendButtonLoading = ref(false);
const $q = useQuasar;

async function submit() {
  sendButtonLoading.value = true;
  await createAccountForm(email);
  sendButtonLoading.value = false;
}
</script>

<style scoped>
.page-container {
  background-color: #3c59ac;
}
</style>
