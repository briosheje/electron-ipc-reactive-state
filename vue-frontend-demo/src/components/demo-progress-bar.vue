<script setup lang="ts">
import { useDemoProgressBar } from '../composables/useDemoProgressBar/useDemoProgressBar';

const { current, max } = useDemoProgressBar();
</script>

<template>
  <progress :max="max" :value="current" />
  <span>Current progress is {{ current }} of {{ max }}</span>
</template>

<style lang="scss" scoped></style>
