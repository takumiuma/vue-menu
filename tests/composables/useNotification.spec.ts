import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useNotificationStore, useNotification } from '~/composables/useNotification'

describe('useNotification', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('useNotificationStore', () => {
    it('初期状態が正しく設定される', () => {
      const store = useNotificationStore()

      expect(store.notification.show).toBe(false)
      expect(store.notification.message).toBe('')
      expect(store.notification.type).toBe('info')
    })

    it('showSuccess が正しく動作する', () => {
      const store = useNotificationStore()

      store.showSuccess('成功しました')

      expect(store.notification.show).toBe(true)
      expect(store.notification.message).toBe('成功しました')
      expect(store.notification.type).toBe('success')
    })

    it('showError が正しく動作する', () => {
      const store = useNotificationStore()

      store.showError('エラーが発生しました')

      expect(store.notification.show).toBe(true)
      expect(store.notification.message).toBe('エラーが発生しました')
      expect(store.notification.type).toBe('error')
    })

    it('showInfo が正しく動作する', () => {
      const store = useNotificationStore()

      store.showInfo('情報メッセージ')

      expect(store.notification.show).toBe(true)
      expect(store.notification.message).toBe('情報メッセージ')
      expect(store.notification.type).toBe('info')
    })

    it('hideNotification が正しく動作する', () => {
      const store = useNotificationStore()

      store.showSuccess('成功しました')
      expect(store.notification.show).toBe(true)

      store.hideNotification()
      expect(store.notification.show).toBe(false)
    })
  })

  describe('useNotification composable', () => {
    it('ストアの関数にアクセスできる', () => {
      const { showSuccess, showError, showInfo } = useNotification()
      const store = useNotificationStore()

      showSuccess('成功しました')
      expect(store.notification.type).toBe('success')
      expect(store.notification.message).toBe('成功しました')

      showError('エラーです')
      expect(store.notification.type).toBe('error')
      expect(store.notification.message).toBe('エラーです')

      showInfo('情報です')
      expect(store.notification.type).toBe('info')
      expect(store.notification.message).toBe('情報です')
    })
  })
})
