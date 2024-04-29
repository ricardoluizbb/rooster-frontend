<template>
  <router-view />
</template>

<script>
// Criar uma splash aqui pra dar um get antes de entrar
// Criar outra instância do axios? sem interceptor
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
});
</script>
