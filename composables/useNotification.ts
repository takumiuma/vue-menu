export interface NotificationState {
  show: boolean
  message: string
  type: 'success' | 'error' | 'info'
}

export const useNotificationStore = defineStore('notification', () => {
  const notification = ref<NotificationState>({
    show: false,
    message: '',
    type: 'info',
  })

  const showSuccess = (message: string) => {
    notification.value = {
      show: true,
      message,
      type: 'success',
    }
  }

  const showError = (message: string) => {
    notification.value = {
      show: true,
      message,
      type: 'error',
    }
  }

  const showInfo = (message: string) => {
    notification.value = {
      show: true,
      message,
      type: 'info',
    }
  }

  const hideNotification = () => {
    notification.value.show = false
  }

  return {
    notification: readonly(notification),
    showSuccess,
    showError,
    showInfo,
    hideNotification,
  }
})

export const useNotification = () => {
  const store = useNotificationStore()
  return {
    showSuccess: store.showSuccess,
    showError: store.showError,
    showInfo: store.showInfo,
  }
}
