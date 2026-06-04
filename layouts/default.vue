<template>
  <div>
    <v-overlay v-model="overlay" class="align-center justify-center">
      <v-progress-circular size="64" indeterminate />
    </v-overlay>
    <TheHeader />
    <slot />
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useLoadingOverlayStore } from '~/composables/useLoadingOverlayService'

const overStore = useLoadingOverlayStore()
const { overlay } = storeToRefs(overStore)
</script>
