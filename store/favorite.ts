import { useFavoriteService, type FavoriteWithMenu } from '~/composables/useFavoriteService'
import { useMenuStore } from '~/store/menu'

export const useFavoriteStore = defineStore('favorite', () => {
  const favorites = ref<FavoriteWithMenu[]>([])

  // 計算プロパティでお気に入りメニューIDのSetを作成（高速検索用）
  const favoriteMenuIds = computed(() => new Set(favorites.value.map((f) => f.menuId)))

  // お気に入り状態をチェック
  const isFavorite = (menuId: number): boolean => {
    return favoriteMenuIds.value.has(menuId)
  }

  // favoriteIdを取得（削除時に使用）
  const getFavoriteId = (menuId: number): number | undefined => {
    return favorites.value.find((f) => f.menuId === menuId)?.favoriteId
  }

  // API呼び出し関数
  const loadFavorites = async (token: string): Promise<void> => {
    try {
      const { getFavorites } = useFavoriteService()
      const data = await getFavorites(token)
      favorites.value = data
    } catch (error) {
      console.error('Failed to load favorites:', error)
      throw error
    }
  }

  const addToFavorites = async (menuId: number, token: string): Promise<void> => {
    try {
      const { addFavorite } = useFavoriteService()
      const response = await addFavorite(menuId, token)

      // ローカル状態を即座に更新（楽観的更新）
      // メニュー情報を取得
      const menuStore = useMenuStore()
      const menus = await menuStore.getMenus()
      const menuInfo = menus.find((m) => m.menuId === menuId)

      if (menuInfo) {
        addLocalFavorite({
          favoriteId: response.favoriteId,
          userId: 0, // 不要だが型のため
          menuId: menuId,
          menuName: menuInfo.menuName,
          genreIds: menuInfo.genreIds,
          categoryIds: menuInfo.categoryIds,
          createdAt: new Date().toISOString(),
        })
      }
    } catch (error) {
      console.error('Failed to add favorite:', error)
      throw error
    }
  }

  const removeFromFavorites = async (favoriteId: number, token: string): Promise<void> => {
    try {
      const { removeFavorite } = useFavoriteService()
      await removeFavorite(favoriteId, token)

      // ローカル状態を即座に更新
      removeLocalFavorite(favoriteId)
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      // エラー時はローカル状態をロールバック
      await loadFavorites(token)
      throw error
    }
  }

  // ローカル状態更新用のヘルパー関数
  const addLocalFavorite = (favorite: FavoriteWithMenu): void => {
    favorites.value.push(favorite)
  }

  const removeLocalFavorite = (favoriteId: number): void => {
    const index = favorites.value.findIndex((f) => f.favoriteId === favoriteId)
    if (index > -1) {
      favorites.value.splice(index, 1)
    }
  }

  return {
    favorites: readonly(favorites),
    favoriteMenuIds: readonly(favoriteMenuIds),
    isFavorite,
    getFavoriteId,
    loadFavorites,
    addToFavorites,
    removeFromFavorites,
    addLocalFavorite,
    removeLocalFavorite,
  }
})
