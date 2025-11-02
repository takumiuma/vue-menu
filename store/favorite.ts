import { useFavoriteService } from '~/composables/useFavoriteService'
import { useMenuStore } from '~/store/menu'

// お気に入りの詳細情報を含む型定義（ストア内部で使用）
export interface FavoriteWithMenu {
  favoriteId: number
  menuId: number
  menuName: string
  genreIds: number[]
  categoryIds: number[]
}

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
      const menuStore = useMenuStore()

      // お気に入りリストとメニューリストを取得
      const favoritesData = await getFavorites(token)
      const menus = await menuStore.getMenus()

      // お気に入りとメニュー情報を結合
      favorites.value = favoritesData
        .map((fav) => {
          const menu = menus.find((m) => m.menuId === fav.menuId)
          if (menu) {
            return {
              favoriteId: fav.favoriteId,
              menuId: fav.menuId,
              menuName: menu.menuName,
              genreIds: menu.genreIds,
              categoryIds: menu.categoryIds,
            }
          }
          return null
        })
        .filter((item): item is FavoriteWithMenu => item !== null)
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
          menuId: menuId,
          menuName: menuInfo.menuName,
          genreIds: menuInfo.genreIds,
          categoryIds: menuInfo.categoryIds,
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
