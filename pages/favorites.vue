<template>
  <v-container>
    <h1 class="text-h4 font-weight-bold mb-4">お気に入りメニュー</h1>

    <!-- ローディング状態 -->
    <div v-if="loading" class="d-flex justify-center my-8">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <!-- お気に入りリスト -->
    <v-row v-else-if="favorites.length > 0">
      <v-col v-for="favorite in favorites" :key="favorite.favoriteId" cols="12" md="6" lg="4">
        <v-card>
          <v-card-title>{{ favorite.menuName }}</v-card-title>
          <v-card-text>
            <div class="mb-2">
              <span class="font-weight-bold">ジャンル:</span>
              {{ getGenreNames(favorite.genreIds) }}
            </div>
            <div>
              <span class="font-weight-bold">カテゴリ:</span>
              {{ getCategoryNames(favorite.categoryIds) }}
            </div>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <FavoriteButton
              :menu-id="favorite.menuId"
              @favorite-changed="onFavoriteRemoved"
            />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- 空のお気に入りリスト -->
    <v-alert v-else type="info" class="mt-4"> お気に入りがありません </v-alert>
  </v-container>
</template>

<script setup lang="ts">
import { useFavoriteStore } from '~/store/favorite'

// Set page title for SEO
useHead({
  title: 'Vue Menu - お気に入り',
})

const favoriteStore = useFavoriteStore()
const { isAuthenticated, init, getAccessToken } = useAuth0()

// ローディング状態
const loading = ref(true)

// ジャンルとカテゴリのマスターデータ
const GENRES = [
  { id: 1, name: '和食' },
  { id: 2, name: '中華料理' },
  { id: 3, name: '洋食' },
  { id: 4, name: '韓国料理' },
  { id: 5, name: 'ファーストフード' },
  { id: 6, name: 'その他' },
]

const CATEGORIES = [
  { id: 1, name: '肉' },
  { id: 2, name: '魚' },
  { id: 3, name: '野菜' },
  { id: 4, name: 'ご飯もの' },
  { id: 5, name: '麺類' },
  { id: 6, name: 'パン' },
  { id: 7, name: 'スープ・汁物' },
  { id: 8, name: 'その他' },
]

// お気に入りリスト（リアクティブな参照）
const favorites = computed(() => favoriteStore.favorites)

// アクセストークンを取得
const loadFavoritesList = async () => {
  try {
    const token = await getAccessToken()
    if (!token) {
      console.error('Failed to get access token')
      return
    }
    await favoriteStore.loadFavorites(token)
  } catch (error) {
    console.error('Failed to load favorites:', error)
  } finally {
    loading.value = false
  }
}

// ジャンル名を取得
const getGenreNames = (genreIds: readonly number[]): string => {
  return genreIds
    .map((id) => GENRES.find((genre) => genre.id === id)?.name)
    .filter((name): name is string => name !== undefined)
    .join(', ')
}

// カテゴリ名を取得
const getCategoryNames = (categoryIds: readonly number[]): string => {
  return categoryIds
    .map((id) => CATEGORIES.find((category) => category.id === id)?.name)
    .filter((name): name is string => name !== undefined)
    .join(', ')
}

// お気に入りが削除されたときの処理
const onFavoriteRemoved = () => {
  // FavoriteButtonコンポーネントがストアを更新するので、
  // このハンドラでは特に何もする必要がない
  // favoritesはcomputedプロパティなので自動的に更新される
}

// マウント時の処理
onMounted(async () => {
  await init()

  // 未認証の場合はホームにリダイレクト
  if (!isAuthenticated.value) {
    navigateTo('/')
    return
  }

  // お気に入りリストを取得
  await loadFavoritesList()
})
</script>
