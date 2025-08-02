import { useAxiosService } from '@/composables/useAxiosService'

const { axios } = useAxiosService()

export interface menu {
  menuId: number
  menuName: string
  genreIds: number[]
  categoryIds: number[]
}

export const useMenuStore = defineStore('menu', () => {
  const getMenus = async (): Promise<menu[]> => {
    try {
      const response = await axios.get('/v1/menus')
      return response.data.menus
    }
    catch (error) {
      console.error('Failed to fetch menus:', error)
      return []
    }
  }

  // メニューを作成する
  const createMenu = async (menu: menu): Promise<menu> => {
    try {
      const response = await axios.post('/v1/menus', menu)
      return response.data.menu
    }
    catch (error) {
      console.error('Failed to create menu:', error)
      return {} as menu
    }
  }

  // メニューを更新する
  const updateMenu = async (menu: menu): Promise<menu> => {
    try {
      const response = await axios.put(`/v1/menus/${menu.menuId}`, menu)
      return response.data.menu
    }
    catch (error) {
      console.error('Failed to update menu:', error)
      return {} as menu
    }
  }

  // メニューを削除する
  const deleteMenu = async (menuId: number): Promise<void> => {
    try {
      await axios.delete(`/v1/menus/${menuId}`)
    }
    catch (error) {
      console.error('Failed to delete menu:', error)
    }
  }

  // メニューに紐づくジャンルを更新する
  const updateMenuGenre = async (menuId: number, genreIds: number[]): Promise<menu> => {
    try {
      const response = await axios.patch(`/v1/menus/${menuId}/genres`, { genreIds })
      return response.data.menu
    }
    catch (error) {
      console.error('Failed to update menu genre:', error)
      // TODO:空のmenuオブジェクトだと通信の成功が判断しづらいので、エラーをスローするか、返すかを検討する
      return {} as menu
    }
  }

  // メニューに紐づくカテゴリを更新する
  const updateMenuCategory = async (menuId: number, categoryIds: number[]): Promise<menu> => {
    try {
      const response = await axios.patch(`/v1/menus/${menuId}/categories`, { categoryIds })
      return response.data.menu
    }
    catch (error) {
      console.error('Failed to update menu category:', error)
      // TODO:空のmenuオブジェクトだと通信の成功が判断しづらいので、エラーをスローするか、返すかを検討する
      return {} as menu
    }
  }

  return {
    getMenus,
    createMenu,
    updateMenu,
    deleteMenu,
    updateMenuGenre,
    updateMenuCategory,
  }
})
