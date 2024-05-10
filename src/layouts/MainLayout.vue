<template>
  <q-layout v-if="!whoAmILoading" view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="row justify-between">
        <div>
          <span class="text-h6 q-ml-lg">Rooster</span>
        </div>

        <div>
          <q-tabs class="center" v-model="selectedTab" dense>
            <q-tab name="MyTasks" label="Minhas tarefas" />
            <q-tab name="DoneTasks" label="Tarefas concluídas" />
          </q-tabs>
        </div>
        <div>
          <q-btn
            @click="generateReport"
            class="q-mr-lg"
            dense
            flat
            icon="file_download"
          >
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view :selectedTab="selectedTab" />
    </q-page-container>
  </q-layout>
  <q-layout v-else>
    <SplashScreenView :splashLoading="whoAmILoading" />
  </q-layout>
</template>

<script setup>
import { useLogin } from "../composables/use-login";
import SplashScreenView from "../pages/SplashScreenView.vue";
import { api } from "../boot/axios";
import { ref } from "vue";
const selectedTab = ref("MyTasks");

const { whoAmI, whoAmILoading } = useLogin();

whoAmI();

const generateReport = async () => {
  try {
    const response = await api.get("tasks/export-to-excel", {
      responseType: "blob",
    });

    // Criar um URL temporário para o blob e criar um link de download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "TaskTotalTimes.xlsx");
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error("Erro ao gerar relatório:", error);
  }
};
</script>

<style scoped></style>
