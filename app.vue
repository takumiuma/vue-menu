<template>
  <v-app>
    <NuxtLayout>
      <v-main><NuxtPage /></v-main>
    </NuxtLayout>
    <v-snackbar
      v-model="notification.show"
      :color="notificationColor"
      :timeout="3000"
      location="top"
      @update:model-value="onSnackbarClose"
    >
      {{ notification.message }}
      <template #actions>
        <v-btn color="white" variant="text" @click="hideNotification"> 閉じる </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup lang="ts">
import { useNotificationStore } from '~/composables/useNotification'

const notificationStore = useNotificationStore()
const { notification } = storeToRefs(notificationStore)
const { hideNotification } = notificationStore

const notificationColor = computed(() => {
  switch (notification.value.type) {
    case 'success':
      return 'success'
    case 'error':
      return 'error'
    case 'info':
      return 'info'
    default:
      return 'info'
  }
})

const onSnackbarClose = (value: boolean) => {
  if (!value) {
    hideNotification()
  }
}
</script>
