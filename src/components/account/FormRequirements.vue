<template>
  <div class="row">
    <q-icon v-if="checked" size="18px" color="positive" name="check_circle" />
    <q-icon
      v-else
      size="18px"
      color="secondary"
      name="radio_button_unchecked"
    />
    <span class="q-pl-xs">{{ requirement }}</span>
  </div>
</template>

<script setup>
const props = defineProps(["checked", "requirement"]);
</script>
