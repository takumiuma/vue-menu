<script setup>
import { storeToRefs } from 'pinia';
const counterStore = useCounterStore();
const { increment } = counterStore;
const { count } = storeToRefs(counterStore);
</script>

<template>
  <v-container>
    <h1>Count:{{ count }}</h1>
    <v-btn @click="increment">+1する</v-btn>
    <nuxt-link to="/" class="ml-4">もどる</nuxt-link>
  </v-container>
</template>
