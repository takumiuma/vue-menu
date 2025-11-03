import { useNotification } from './useNotification'

interface ErrorResponse {
  response?: {
    status?: number
  }
}

export const useErrorHandler = () => {
  const router = useRouter()
  const { showError } = useNotification()

  const handleAuthError = async (error: ErrorResponse) => {
    if (error.response?.status === 401) {
      await router.push('/login')
      showError('ログインが必要です')
    }
  }

  const handleNetworkError = (error: ErrorResponse) => {
    if (!error.response) {
      // ネットワークエラー（接続失敗、タイムアウトなど）
      showError('ネットワークエラーが発生しました')
      return true
    }
    return false
  }

  const handleServerError = (error: ErrorResponse) => {
    const status = error.response?.status
    if (status && status >= 500) {
      showError('サーバーエラーが発生しました')
      return true
    }
    return false
  }

  const handleError = async (error: unknown, customMessage?: string) => {
    const err = error as ErrorResponse

    // 401エラーの場合はログインページにリダイレクト
    if (err.response?.status === 401) {
      await handleAuthError(err)
      return
    }

    // 409エラー（重複）の場合
    if (err.response?.status === 409) {
      showError('既にお気に入りに追加されています')
      return
    }

    // ネットワークエラーの場合
    if (handleNetworkError(err)) {
      return
    }

    // サーバーエラーの場合
    if (handleServerError(err)) {
      return
    }

    // その他のエラー
    showError(customMessage || '操作に失敗しました')
  }

  return {
    handleAuthError,
    handleNetworkError,
    handleServerError,
    handleError,
  }
}
