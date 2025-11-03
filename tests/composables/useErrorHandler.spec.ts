import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationStore } from '~/composables/useNotification'

// Mock router
const mockPush = vi.fn()
vi.mock('#app', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('useErrorHandler', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('handleAuthError', () => {
    it('401エラーの場合、エラーメッセージを表示する', async () => {
      const { useErrorHandler } = await import('~/composables/useErrorHandler')
      const { handleAuthError } = useErrorHandler()
      const notificationStore = useNotificationStore()

      const error = {
        response: {
          status: 401,
        },
      }

      await handleAuthError(error)

      expect(notificationStore.notification.show).toBe(true)
      expect(notificationStore.notification.message).toBe('ログインが必要です')
      expect(notificationStore.notification.type).toBe('error')
    })

    it('401以外のエラーの場合、何もしない', async () => {
      const { useErrorHandler } = await import('~/composables/useErrorHandler')
      const { handleAuthError } = useErrorHandler()
      const notificationStore = useNotificationStore()

      const error = {
        response: {
          status: 500,
        },
      }

      await handleAuthError(error)

      expect(notificationStore.notification.show).toBe(false)
    })
  })

  describe('handleNetworkError', () => {
    it('レスポンスがない場合、ネットワークエラーメッセージを表示する', async () => {
      const { useErrorHandler } = await import('~/composables/useErrorHandler')
      const { handleNetworkError } = useErrorHandler()
      const notificationStore = useNotificationStore()

      const error = {}

      const result = handleNetworkError(error)

      expect(result).toBe(true)
      expect(notificationStore.notification.show).toBe(true)
      expect(notificationStore.notification.message).toBe('ネットワークエラーが発生しました')
    })

    it('レスポンスがある場合、falseを返す', async () => {
      const { useErrorHandler } = await import('~/composables/useErrorHandler')
      const { handleNetworkError } = useErrorHandler()

      const error = {
        response: {
          status: 500,
        },
      }

      const result = handleNetworkError(error)

      expect(result).toBe(false)
    })
  })

  describe('handleServerError', () => {
    it('500系エラーの場合、サーバーエラーメッセージを表示する', async () => {
      const { useErrorHandler } = await import('~/composables/useErrorHandler')
      const { handleServerError } = useErrorHandler()
      const notificationStore = useNotificationStore()

      const error = {
        response: {
          status: 500,
        },
      }

      const result = handleServerError(error)

      expect(result).toBe(true)
      expect(notificationStore.notification.show).toBe(true)
      expect(notificationStore.notification.message).toBe('サーバーエラーが発生しました')
    })

    it('500系以外のエラーの場合、falseを返す', async () => {
      const { useErrorHandler } = await import('~/composables/useErrorHandler')
      const { handleServerError } = useErrorHandler()

      const error = {
        response: {
          status: 404,
        },
      }

      const result = handleServerError(error)

      expect(result).toBe(false)
    })
  })

  describe('handleError', () => {
    it('401エラーの場合、認証エラー処理を呼び出す', async () => {
      const { useErrorHandler } = await import('~/composables/useErrorHandler')
      const { handleError } = useErrorHandler()
      const notificationStore = useNotificationStore()

      const error = {
        response: {
          status: 401,
        },
      }

      await handleError(error)

      expect(notificationStore.notification.message).toBe('ログインが必要です')
    })

    it('409エラーの場合、重複メッセージを表示する', async () => {
      const { useErrorHandler } = await import('~/composables/useErrorHandler')
      const { handleError } = useErrorHandler()
      const notificationStore = useNotificationStore()

      const error = {
        response: {
          status: 409,
        },
      }

      await handleError(error)

      expect(notificationStore.notification.message).toBe('既にお気に入りに追加されています')
    })

    it('ネットワークエラーの場合、ネットワークエラーメッセージを表示する', async () => {
      const { useErrorHandler } = await import('~/composables/useErrorHandler')
      const { handleError } = useErrorHandler()
      const notificationStore = useNotificationStore()

      const error = {}

      await handleError(error)

      expect(notificationStore.notification.message).toBe('ネットワークエラーが発生しました')
    })

    it('500系エラーの場合、サーバーエラーメッセージを表示する', async () => {
      const { useErrorHandler } = await import('~/composables/useErrorHandler')
      const { handleError } = useErrorHandler()
      const notificationStore = useNotificationStore()

      const error = {
        response: {
          status: 500,
        },
      }

      await handleError(error)

      expect(notificationStore.notification.message).toBe('サーバーエラーが発生しました')
    })

    it('その他のエラーの場合、カスタムメッセージを表示する', async () => {
      const { useErrorHandler } = await import('~/composables/useErrorHandler')
      const { handleError } = useErrorHandler()
      const notificationStore = useNotificationStore()

      const error = {
        response: {
          status: 400,
        },
      }

      await handleError(error, 'カスタムエラーメッセージ')

      expect(notificationStore.notification.message).toBe('カスタムエラーメッセージ')
    })

    it('カスタムメッセージがない場合、デフォルトメッセージを表示する', async () => {
      const { useErrorHandler } = await import('~/composables/useErrorHandler')
      const { handleError } = useErrorHandler()
      const notificationStore = useNotificationStore()

      const error = {
        response: {
          status: 400,
        },
      }

      await handleError(error)

      expect(notificationStore.notification.message).toBe('操作に失敗しました')
    })
  })
})
