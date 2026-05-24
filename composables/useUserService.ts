import { useAxiosService } from '~/composables/useAxiosService'

export interface UserInfo {
  userId: number
  auth0Sub: string
}

export const useUserService = () => {
  const { axios } = useAxiosService()

  const createOrGetUser = async (auth0Sub: string): Promise<UserInfo> => {
    try {
      const response = await axios.post('/v1/users', { auth0Sub })
      return response.data.user as UserInfo
    } catch (error) {
      console.error('Failed to create or get user:', error)
      throw error
    }
  }

  return {
    createOrGetUser,
  }
}
