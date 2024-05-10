<template>
  <q-page-container>
    <q-page class="flex container">
      <q-img
        src="../assets/rooster-splash.png"
        style="height: 400px; width: 400px"
      />
      <q-inner-loading :showing="splashLoading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </q-page>
  </q-page-container>
</template>

<script setup>
const props = defineProps(["splashLoading"]);
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
