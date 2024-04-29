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
          type="email"
          class="q-mb-md"
          dense
          v-model="email"
          label="E-mail"
          outlined
        />
        <q-btn
          :disabled="!email"
          :loading="sendButtonLoading"
          style="width: 100%"
          dense
          color="primary"
          label="Enviar"
          @click="submit(email)"
        />
      </q-card-section>
      <q-card-section class="text-center q-py-none">
        <span class="text-caption"
          >Digite seu e-mail para receber um token de acesso ao Rooster.</span
        >
      </q-card-section>
      <q-card-section class="text-center">
        <q-btn
          @click="router.push('/create-account')"
          dense
          flat
          color="primary"
          >Criar conta</q-btn
        >
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useLogin } from "../composables/use-login";
import router from "../router/index";

const { sendLoginForm } = useLogin();

const email = ref("");
const sendButtonLoading = ref(false);
const $q = useQuasar;

const submit = async () => {
  await sendLoginForm(email);
};
</script>

<style scoped>
.page-container {
  background-color: #3c59ac;
}
</style>
