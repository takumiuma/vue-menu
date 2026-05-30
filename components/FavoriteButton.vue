<template>
  <v-btn
    :icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
    :color="isFavorite ? 'red' : 'grey'"
    :loading="loading"
    :size="size"
    @click="toggleFavorite"
  />
</template>

<script setup lang="ts">
import type { Auth0Client } from '@auth0/auth0-spa-js'
import { createAuth0Client } from '@auth0/auth0-spa-js'
import { useFavoriteStore } from '~/store/favorite'
import { useNotification } from '~/composables/useNotification'
import { useErrorHandler } from '~/composables/useErrorHandler'

interface Props {
  menuId: number
  size?: string
}

interface Emits {
  (e: 'favoriteChanged', isFavorite: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const favoriteStore = useFavoriteStore()
const config = useRuntimeConfig()
const { showSuccess, showError } = useNotification()
const { handleError } = useErrorHandler()

// Auth0クライアントの初期化
const auth0 = ref<Auth0Client | null>(null)
const isAuthenticated = ref(false)

onMounted(async () => {
  auth0.value = await createAuth0Client({
    domain: config.public.AUTH0_DOMAIN as string,
    clientId: config.public.AUTH0_CLIENT_ID as string,
  })

  isAuthenticated.value = await auth0.value.isAuthenticated()

  // 認証済みかつお気に入り一覧が未取得の場合は取得
  if (isAuthenticated.value && favoriteStore.favorites.length === 0) {
    try {
      const token = await getAccessToken()
      if (token) {
        await favoriteStore.loadFavorites(token)
      }
    } catch (error) {
      await handleError(error, 'お気に入りリストの取得に失敗しました')
    }
  }
})

// Storeから状態を取得
const isFavorite = computed(() => favoriteStore.isFavorite(props.menuId))
const favoriteId = computed(() => favoriteStore.getFavoriteId(props.menuId))

const loading = ref(false)

// アクセストークンを取得
const getAccessToken = async (): Promise<string | null> => {
  if (!auth0.value) return null

  try {
    return await auth0.value.getTokenSilently()
  } catch (error) {
    console.error('Failed to get access token:', error)
    return null
  }
}

const toggleFavorite = async () => {
  if (!isAuthenticated.value) {
    showError('ログインが必要です')
    return
  }

  loading.value = true
  const wasFavorite = isFavorite.value // 操作前の状態を記録
  try {
    const token = await getAccessToken()
    if (!token) {
      showError('認証トークンの取得に失敗しました')
      return
    }

    if (wasFavorite) {
      // 削除
      const currentFavoriteId = favoriteId.value
      if (!currentFavoriteId) {
        showError('お気に入りIDが見つかりません')
        return
      }
      await favoriteStore.removeFromFavorites(currentFavoriteId, token)
      showSuccess('お気に入りから削除しました')
      emit('favoriteChanged', false)
    } else {
      // 追加
      await favoriteStore.addToFavorites(props.menuId, token)
      showSuccess('お気に入りに追加しました')
      emit('favoriteChanged', true)
    }
  } catch (error) {
    await handleError(
      error,
      wasFavorite ? 'お気に入りの削除に失敗しました' : 'お気に入りの追加に失敗しました'
    )
  } finally {
    loading.value = false
  }
}
</script>
