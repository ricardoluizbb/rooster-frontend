<template>
  <q-page class="bg-primary flex flex-center">
    <q-card class="form-card flex">
      <q-card-section class="half-width q-pa-none">
        <q-img class="full-height" src="../../assets/clock.jpg" />
      </q-card-section>
      <q-card-section class="half-width self-center">
        <q-card-section class="text-center">
          <q-img
            src="../../assets/rooster1.svg"
            style="height: 67px; max-width: 282px"
          ></q-img>
        </q-card-section>
        <q-card-section>
          <q-input
            rounded
            dense
            type="email"
            class="q-mb-md"
            v-model="email"
            label="E-mail"
            outlined
          />
          <q-input
            rounded
            dense
            type="email"
            class="q-mb-md"
            v-model="password"
            label="Senha"
            outlined
          />
          <q-btn
            rounded
            dense
            :disabled="!email"
            :loading="sendButtonLoading"
            class="full-width"
            color="primary"
            label="Entrar"
            @click="submit(email)"
          />
        </q-card-section>
        <q-card-section class="text-center">
          <q-btn
            @click="router.push('/create-account')"
            dense
            flat
            color="primary"
            no-caps=""
            >Criar uma conta</q-btn
          >
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useLogin } from "../../composables/use-login";
import router from "../../router/index";

const { sendLoginForm } = useLogin();

const email = ref("");
const password = ref("");
const sendButtonLoading = ref(false);
const $q = useQuasar;

const submit = async () => {
  await sendLoginForm(email);
};
</script>

<style scoped>
.form-card {
  width: 720px;
  height: 530px;
}

.half-width {
  flex: 1;
}
</style>
