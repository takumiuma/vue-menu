import { useAxiosService } from '~/composables/useAxiosService'

export interface Favorite {
  favoriteId: number
  menuId: number
}

export const useFavoriteService = () => {
  const { axios } = useAxiosService()

  const addFavorite = async (menuId: number, token: string): Promise<{ favoriteId: number }> => {
    try {
      const response = await axios.post(
        '/v1/favorites',
        { menuId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return { favoriteId: response.data.favoriteId }
    } catch (error) {
      console.error('Failed to add favorite:', error)
      throw error
    }
  }

  const removeFavorite = async (favoriteId: number, token: string): Promise<void> => {
    try {
      await axios.delete(`/v1/favorites/${favoriteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.error('Failed to remove favorite:', error)
      throw error
    }
  }

  const getFavorites = async (token: string): Promise<Favorite[]> => {
    try {
      const response = await axios.get('/v1/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data.favorites
    } catch (error) {
      console.error('Failed to get favorites:', error)
      throw error
    }
  }

  return {
    addFavorite,
    removeFavorite,
    getFavorites,
  }
}