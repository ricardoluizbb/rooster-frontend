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
          :disable="!email"
          :loading="sendButtonLoading"
          style="width: 100%"
          dense
          color="primary"
          label="Criar conta"
          @click="submit(email)"
        />
      </q-card-section>
      <q-card-section class="text-center q-py-none">
        <span class="text-caption"
          >Digite seu e-mail para criar uma conta!</span
        >
      </q-card-section>
      <q-card-section class="text-center">
        <q-btn @click="router.push('/login')" dense flat color="primary"
          >Já possui uma conta?</q-btn
        >
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useLogin } from "../composables/use-login";
import router from "../router/index";

const { createAccountForm } = useLogin();

const email = ref("");

async function submit() {
  await createAccountForm(email);
}
</script>

<style scoped>
.page-container {
  background-color: #3c59ac;
}
</style>
