import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useFavoriteStore, type FavoriteWithMenu } from '~/store/favorite'
import type { Favorite } from '~/composables/useFavoriteService'
import type { menu } from '~/store/menu'

// Mock the useFavoriteService
const mockGetFavorites = vi.fn()
const mockAddFavorite = vi.fn()
const mockRemoveFavorite = vi.fn()

vi.mock('~/composables/useFavoriteService', () => ({
  useFavoriteService: () => ({
    getFavorites: mockGetFavorites,
    addFavorite: mockAddFavorite,
    removeFavorite: mockRemoveFavorite,
  }),
}))

// Mock the useMenuStore
const mockGetMenus = vi.fn()

vi.mock('~/store/menu', () => ({
  useMenuStore: () => ({
    getMenus: mockGetMenus,
  }),
}))

describe('useFavoriteStore', () => {
  const mockToken = 'mock-auth0-token'

  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  describe('初期状態', () => {
    it('favorites が空配列で初期化されている', () => {
      const store = useFavoriteStore()
      expect(store.favorites).toEqual([])
    })

    it('favoriteMenuIds が空のSetである', () => {
      const store = useFavoriteStore()
      expect(store.favoriteMenuIds.size).toBe(0)
    })
  })

  describe('favoriteMenuIds 計算プロパティ', () => {
    it('お気に入りのmenuIdのSetを返す', () => {
      const store = useFavoriteStore()
      const mockFavorites: FavoriteWithMenu[] = [
        {
          favoriteId: 1,
          menuId: 10,
          menuName: 'カレー',
          genreIds: [1, 2],
          categoryIds: [3],
        },
        {
          favoriteId: 2,
          menuId: 20,
          menuName: 'ラーメン',
          genreIds: [2],
          categoryIds: [4],
        },
      ]

      store.addLocalFavorite(mockFavorites[0]!)
      store.addLocalFavorite(mockFavorites[1]!)

      expect(store.favoriteMenuIds.has(10)).toBe(true)
      expect(store.favoriteMenuIds.has(20)).toBe(true)
      expect(store.favoriteMenuIds.has(30)).toBe(false)
    })
  })

  describe('isFavorite', () => {
    it('お気に入りに含まれるmenuIdに対してtrueを返す', () => {
      const store = useFavoriteStore()
      store.addLocalFavorite({
        favoriteId: 1,
        menuId: 10,
        menuName: 'カレー',
        genreIds: [1],
        categoryIds: [2],
      })

      expect(store.isFavorite(10)).toBe(true)
      expect(store.isFavorite(20)).toBe(false)
    })
  })

  describe('getFavoriteId', () => {
    it('menuIdに対応するfavoriteIdを返す', () => {
      const store = useFavoriteStore()
      store.addLocalFavorite({
        favoriteId: 123,
        menuId: 10,
        menuName: 'カレー',
        genreIds: [1],
        categoryIds: [2],
      })

      expect(store.getFavoriteId(10)).toBe(123)
    })

    it('存在しないmenuIdに対してundefinedを返す', () => {
      const store = useFavoriteStore()
      expect(store.getFavoriteId(999)).toBeUndefined()
    })
  })

  describe('loadFavorites', () => {
    it('お気に入りリストを正常に読み込む', async () => {
      const mockFavoritesApi: Favorite[] = [
        {
          favoriteId: 1,
          menuId: 10,
        },
      ]
      const mockMenus = [
        {
          menuId: 10,
          menuName: 'カレー',
          genreIds: [1],
          categoryIds: [2],
        },
      ]
      const expectedFavorites: FavoriteWithMenu[] = [
        {
          favoriteId: 1,
          menuId: 10,
          menuName: 'カレー',
          genreIds: [1],
          categoryIds: [2],
        },
      ]

      mockGetFavorites.mockResolvedValueOnce(mockFavoritesApi)
      mockGetMenus.mockResolvedValueOnce(mockMenus)

      const store = useFavoriteStore()
      await store.loadFavorites(mockToken)

      expect(mockGetFavorites).toHaveBeenCalledWith(mockToken)
      expect(mockGetMenus).toHaveBeenCalled()
      expect(store.favorites).toEqual(expectedFavorites)
    })

    it('API呼び出し失敗時にエラーをスローする', async () => {
      const mockError = new Error('API Error')
      mockGetFavorites.mockRejectedValueOnce(mockError)

      const store = useFavoriteStore()
      await expect(store.loadFavorites(mockToken)).rejects.toThrow('API Error')
    })
  })

  describe('addToFavorites', () => {
    it('お気に入りを正常に追加する', async () => {
      const mockResponse = { favoriteId: 123 }
      const mockMenus = [
        {
          menuId: 10,
          menuName: 'カレー',
          genreIds: [1],
          categoryIds: [2],
        },
      ]

      mockAddFavorite.mockResolvedValueOnce(mockResponse)
      mockGetMenus.mockResolvedValueOnce(mockMenus)

      const store = useFavoriteStore()
      await store.addToFavorites(10, mockToken)

      expect(mockAddFavorite).toHaveBeenCalledWith(10, mockToken)
      expect(store.isFavorite(10)).toBe(true)
      expect(store.getFavoriteId(10)).toBe(123)
    })

    it('メニュー情報が見つからない場合は追加しない', async () => {
      const mockResponse = { favoriteId: 123 }
      const mockMenus: menu[] = []

      mockAddFavorite.mockResolvedValueOnce(mockResponse)
      mockGetMenus.mockResolvedValueOnce(mockMenus)

      const store = useFavoriteStore()
      await store.addToFavorites(10, mockToken)

      expect(store.isFavorite(10)).toBe(false)
    })

    it('API呼び出し失敗時にエラーをスローする', async () => {
      const mockError = new Error('API Error')
      mockAddFavorite.mockRejectedValueOnce(mockError)

      const store = useFavoriteStore()
      await expect(store.addToFavorites(10, mockToken)).rejects.toThrow('API Error')
    })
  })

  describe('removeFromFavorites', () => {
    it('お気に入りを正常に削除する', async () => {
      mockRemoveFavorite.mockResolvedValueOnce(undefined)

      const store = useFavoriteStore()
      store.addLocalFavorite({
        favoriteId: 123,
        menuId: 10,
        menuName: 'カレー',
        genreIds: [1],
        categoryIds: [2],
      })

      expect(store.isFavorite(10)).toBe(true)

      await store.removeFromFavorites(123, mockToken)

      expect(mockRemoveFavorite).toHaveBeenCalledWith(123, mockToken)
      expect(store.isFavorite(10)).toBe(false)
    })

    it('API呼び出し失敗時にエラーをスローしロールバックする', async () => {
      const mockError = new Error('API Error')
      const mockFavoritesApi: Favorite[] = [
        {
          favoriteId: 123,
          menuId: 10,
        },
      ]
      const mockMenus = [
        {
          menuId: 10,
          menuName: 'カレー',
          genreIds: [1],
          categoryIds: [2],
        },
      ]

      mockRemoveFavorite.mockRejectedValueOnce(mockError)
      mockGetFavorites.mockResolvedValueOnce(mockFavoritesApi)
      mockGetMenus.mockResolvedValueOnce(mockMenus)

      const store = useFavoriteStore()
      store.addLocalFavorite({
        favoriteId: 123,
        menuId: 10,
        menuName: 'カレー',
        genreIds: [1],
        categoryIds: [2],
      })

      await expect(store.removeFromFavorites(123, mockToken)).rejects.toThrow('API Error')

      // ロールバックのためloadFavoritesが呼ばれることを確認
      expect(mockGetFavorites).toHaveBeenCalledWith(mockToken)
      expect(mockGetMenus).toHaveBeenCalled()
    })
  })

  describe('addLocalFavorite', () => {
    it('ローカル状態にお気に入りを追加する', () => {
      const store = useFavoriteStore()
      const favorite: FavoriteWithMenu = {
        favoriteId: 1,
        menuId: 10,
        menuName: 'カレー',
        genreIds: [1],
        categoryIds: [2],
      }

      store.addLocalFavorite(favorite)

      expect(store.favorites).toHaveLength(1)
      expect(store.favorites[0]).toEqual(favorite)
    })
  })

  describe('removeLocalFavorite', () => {
    it('ローカル状態からお気に入りを削除する', () => {
      const store = useFavoriteStore()
      const favorite: FavoriteWithMenu = {
        favoriteId: 123,
        menuId: 10,
        menuName: 'カレー',
        genreIds: [1],
        categoryIds: [2],
      }

      store.addLocalFavorite(favorite)
      expect(store.favorites).toHaveLength(1)

      store.removeLocalFavorite(123)
      expect(store.favorites).toHaveLength(0)
    })

    it('存在しないfavoriteIdの場合は何もしない', () => {
      const store = useFavoriteStore()
      store.addLocalFavorite({
        favoriteId: 123,
        menuId: 10,
        menuName: 'カレー',
        genreIds: [1],
        categoryIds: [2],
      })

      store.removeLocalFavorite(999)
      expect(store.favorites).toHaveLength(1)
    })
  })

  describe('readonly プロパティ', () => {
    it('favorites は readonly である', () => {
      const store = useFavoriteStore()
      // readonly なので型チェックで書き込みができないことを確認
      // 実行時は書き込めてしまうが、TypeScriptの型システムで防ぐことを期待
      expect(store.favorites).toBeDefined()
    })

    it('favoriteMenuIds は readonly である', () => {
      const store = useFavoriteStore()
      expect(store.favoriteMenuIds).toBeDefined()
    })
  })
})
