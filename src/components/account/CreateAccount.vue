<template>
  <q-page class="bg-primary flex flex-center">
    <q-card class="form-card flex">
      <q-card-section class="half-width q-pa-none">
        <q-img class="full-height" src="../../assets/clock.jpg"></q-img>
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
            type="text"
            class="q-mb-md"
            v-model="name"
            label="Nome"
            outlined
          />
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
            :type="isPwd ? 'password' : 'text'"
            class="q-mb-md"
            v-model="password"
            label="Senha"
            outlined
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-input
            rounded
            dense
            :type="isPwdConfirmation ? 'password' : 'text'"
            class="q-mb-md"
            v-model="confirmPassword"
            label="Confirme sua senha"
            outlined
          >
            <template v-slot:append>
              <q-icon
                :name="isPwdConfirmation ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwdConfirmation = !isPwdConfirmation"
              />
            </template>
          </q-input>
          <q-btn
            rounded
            dense
            :disabled="!(email && name && password && confirmPassword)"
            :loading="sendButtonLoading"
            class="full-width"
            color="primary"
            label="Criar conta"
            @click="sendForm"
            @keypress.enter="sendForm"
          />
        </q-card-section>
        <q-card-section class="text-center">
          <q-btn
            @click="router.push('/login')"
            dense
            flat
            color="primary"
            no-caps=""
            >Já possui uma conta?</q-btn
          >
        </q-card-section>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { useLogin } from "../../composables/use-login";
import router from "../../router/index";

const {
  createAccountForm,
  sendButtonLoading,
  email,
  name,
  isPwd,
  isPwdConfirmation,
  password,
  confirmPassword,
} = useLogin();

const sendForm = async () => {
  await createAccountForm(name, email, password, confirmPassword);
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
