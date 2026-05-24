import type { Auth0Client } from '@auth0/auth0-spa-js'
import { createAuth0Client } from '@auth0/auth0-spa-js'

// シングルトン: アプリ全体で1つのクライアント・1回だけ初期化
let _client: Auth0Client | null = null
let _initPromise: Promise<void> | null = null

export const useAuth0 = () => {
  const config = useRuntimeConfig()
  const isAuthenticated = useState<boolean>('auth0IsAuthenticated', () => false)

  const init = (): Promise<void> => {
    if (_initPromise) return _initPromise

    _initPromise = (async () => {
      _client = await createAuth0Client({
        domain: config.public.AUTH0_DOMAIN as string,
        clientId: config.public.AUTH0_CLIENT_ID as string,
        authorizationParams: {
          audience: config.public.AUTH0_AUDIENCE as string,
        },
      })

      // Auth0 リダイレクトコールバックの処理（1回だけ実行）
      if (
        (window.location.search.includes('code=') && window.location.search.includes('state=')) ||
        window.location.search.includes('error=')
      ) {
        await _client.handleRedirectCallback()
        // クエリパラメーターを削除（ルーターを発火させずにURLだけ更新）
        window.history.replaceState({}, '', '/')
      }

      isAuthenticated.value = await _client.isAuthenticated()
    })()

    return _initPromise
  }

  const getAccessToken = async (): Promise<string | null> => {
    if (!_client) return null
    try {
      return await _client.getTokenSilently({
        authorizationParams: {
          audience: config.public.AUTH0_AUDIENCE as string,
        },
      })
    } catch (error) {
      console.error('Failed to get access token:', error)
      return null
    }
  }

  const getUser = async (): Promise<{ sub?: string } | null> => {
    if (!_client) return null
    return (await _client.getUser()) ?? null
  }

  const login = async () => {
    await _client?.loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
    })
  }

  const logout = () =>
    _client?.logout({ logoutParams: { returnTo: window.location.origin } })

  return {
    isAuthenticated,
    init,
    getAccessToken,
    getUser,
    login,
    logout,
  }
}
