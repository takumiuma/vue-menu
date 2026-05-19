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
import { useFavoriteStore } from '~/store/favorite';

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
const { isAuthenticated, init, getAccessToken } = useAuth0()

onMounted(async () => {
  await init()

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

// アクセストークンを取得は useAuth0 の getAccessToken を使用

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
