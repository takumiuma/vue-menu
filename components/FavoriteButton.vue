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
      console.error('Failed to load favorites:', error)
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
  try {
    const token = await getAccessToken()
    if (!token) {
      showError('認証トークンの取得に失敗しました')
      return
    }

    if (isFavorite.value) {
      // 削除
      await favoriteStore.removeFromFavorites(favoriteId.value!, token)
      showSuccess('お気に入りから削除しました')
    } else {
      // 追加
      await favoriteStore.addToFavorites(props.menuId, token)
      showSuccess('お気に入りに追加しました')
    }

    emit('favoriteChanged', !isFavorite.value)
  } catch (error) {
    handleError(error)
  } finally {
    loading.value = false
  }
}

const handleError = (error: unknown) => {
  const err = error as { response?: { status?: number } }
  if (err.response?.status === 401) {
    showError('ログインが必要です')
  } else if (err.response?.status === 409) {
    showError('既にお気に入りに追加されています')
  } else {
    showError('操作に失敗しました')
  }
}

const showSuccess = (message: string) => {
  // NuxtのshowErrorは使えるが、successメッセージ用の標準機能はないため、
  // console.logで対応（実際の実装ではVuetifyのsnackbarなどを使用することが多い）
  console.log('Success:', message)
}

const showError = (message: string) => {
  console.error('Error:', message)
}
</script>
