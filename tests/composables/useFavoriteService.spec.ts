import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useFavoriteService, type Favorite } from '~/composables/useFavoriteService'

// Mock the useAxiosService
const mockAxios = {
  post: vi.fn(),
  delete: vi.fn(),
  get: vi.fn(),
}

vi.mock('~/composables/useAxiosService', () => ({
  useAxiosService: () => ({ axios: mockAxios }),
}))

describe('useFavoriteService', () => {
  const mockToken = 'mock-auth0-token'
  const { addFavorite, removeFavorite, getFavorites } = useFavoriteService()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('addFavorite', () => {
    it('should add a favorite and return favoriteId', async () => {
      const mockResponse = {
        data: { favoriteId: 123 },
      }
      mockAxios.post.mockResolvedValueOnce(mockResponse)

      const result = await addFavorite(456, mockToken)

      expect(mockAxios.post).toHaveBeenCalledWith(
        '/v1/favorites',
        { menuId: 456 },
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }
      )
      expect(result).toEqual({ favoriteId: 123 })
    })

    it('should throw error when API call fails', async () => {
      const mockError = new Error('API Error')
      mockAxios.post.mockRejectedValueOnce(mockError)

      await expect(addFavorite(456, mockToken)).rejects.toThrow('API Error')

      expect(mockAxios.post).toHaveBeenCalledWith(
        '/v1/favorites',
        { menuId: 456 },
        {
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        }
      )
    })
  })

  describe('removeFavorite', () => {
    it('should remove a favorite successfully', async () => {
      mockAxios.delete.mockResolvedValueOnce({})

      await removeFavorite(123, mockToken)

      expect(mockAxios.delete).toHaveBeenCalledWith('/v1/favorites/123', {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      })
    })

    it('should throw error when API call fails', async () => {
      const mockError = new Error('API Error')
      mockAxios.delete.mockRejectedValueOnce(mockError)

      await expect(removeFavorite(123, mockToken)).rejects.toThrow('API Error')

      expect(mockAxios.delete).toHaveBeenCalledWith('/v1/favorites/123', {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      })
    })
  })

  describe('getFavorites', () => {
    it('should get favorites list successfully', async () => {
      const mockFavorites: Favorite[] = [
        { favoriteId: 1, menuId: 10 },
        { favoriteId: 2, menuId: 20 },
      ]
      const mockResponse = {
        data: { favorites: mockFavorites },
      }
      mockAxios.get.mockResolvedValueOnce(mockResponse)

      const result = await getFavorites(mockToken)

      expect(mockAxios.get).toHaveBeenCalledWith('/v1/favorites', {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      })
      expect(result).toEqual(mockFavorites)
    })

    it('should throw error when API call fails', async () => {
      const mockError = new Error('API Error')
      mockAxios.get.mockRejectedValueOnce(mockError)

      await expect(getFavorites(mockToken)).rejects.toThrow('API Error')

      expect(mockAxios.get).toHaveBeenCalledWith('/v1/favorites', {
        headers: {
          Authorization: `Bearer ${mockToken}`,
        },
      })
    })
  })
})