import { useAxiosService } from '@/composables/useAxiosService'
import { MOCK_MENUS } from '~/data/mockMenus'

const { axios } = useAxiosService()

export interface menu {
  menuId: number
  menuName: string
  genreIds: number[]
  categoryIds: number[]
}

// プレビューモード用インメモリストア（シングルトン）
const previewMenus = ref<menu[]>(MOCK_MENUS.map((m) => ({ ...m, genreIds: [...m.genreIds], categoryIds: [...m.categoryIds] })))
let previewNextId = MOCK_MENUS.length + 1

const cloneMenu = (m: menu): menu => ({ ...m, genreIds: [...m.genreIds], categoryIds: [...m.categoryIds] })

export const useMenuStore = defineStore('menu', () => {
  const config = useRuntimeConfig()
  const isPreviewMode = !config.public.AUTH0_DOMAIN || !config.public.AUTH0_CLIENT_ID

  const getMenus = async (): Promise<menu[]> => {
    if (isPreviewMode) {
      return previewMenus.value.map(cloneMenu)
    }
    try {
      const response = await axios.get('/v1/menus')
      return response.data.menus
    } catch (error) {
      console.error('Failed to fetch menus:', error)
      return []
    }
  }

  // メニューを作成する
  const createMenu = async (newMenu: menu): Promise<menu> => {
    if (isPreviewMode) {
      const created = cloneMenu({ ...newMenu, menuId: previewNextId++ })
      previewMenus.value.push(created)
      return cloneMenu(created)
    }
    try {
      const response = await axios.post('/v1/menus', newMenu)
      return response.data.menu
    } catch (error) {
      console.error('Failed to create menu:', error)
      return {} as menu
    }
  }

  // メニューを更新する
  const updateMenu = async (updatedMenu: menu): Promise<menu> => {
    if (isPreviewMode) {
      const index = previewMenus.value.findIndex((m) => m.menuId === updatedMenu.menuId)
      if (index !== -1) {
        previewMenus.value[index] = cloneMenu(updatedMenu)
        return cloneMenu(previewMenus.value[index]!)
      }
      return {} as menu
    }
    try {
      const response = await axios.put(`/v1/menus/${updatedMenu.menuId}`, updatedMenu)
      return response.data.menu
    } catch (error) {
      console.error('Failed to update menu:', error)
      return {} as menu
    }
  }

  // メニューを削除する
  const deleteMenu = async (menuId: number): Promise<void> => {
    if (isPreviewMode) {
      const index = previewMenus.value.findIndex((m) => m.menuId === menuId)
      if (index !== -1) previewMenus.value.splice(index, 1)
      return
    }
    try {
      await axios.delete(`/v1/menus/${menuId}`)
    } catch (error) {
      console.error('Failed to delete menu:', error)
    }
  }

  // メニューに紐づくジャンルを更新する
  const updateMenuGenre = async (menuId: number, genreIds: number[]): Promise<menu> => {
    if (isPreviewMode) {
      const index = previewMenus.value.findIndex((m) => m.menuId === menuId)
      if (index !== -1) {
        previewMenus.value[index]!.genreIds = [...genreIds]
        return cloneMenu(previewMenus.value[index]!)
      }
      return {} as menu
    }
    try {
      const response = await axios.patch(`/v1/menus/${menuId}/genres`, { genreIds })
      return response.data.menu
    } catch (error) {
      console.error('Failed to update menu genre:', error)
      // TODO:空のmenuオブジェクトだと通信の成功が判断しづらいので、エラーをスローするか、返すかを検討する
      return {} as menu
    }
  }

  // メニューに紐づくカテゴリを更新する
  const updateMenuCategory = async (menuId: number, categoryIds: number[]): Promise<menu> => {
    if (isPreviewMode) {
      const index = previewMenus.value.findIndex((m) => m.menuId === menuId)
      if (index !== -1) {
        previewMenus.value[index]!.categoryIds = [...categoryIds]
        return cloneMenu(previewMenus.value[index]!)
      }
      return {} as menu
    }
    try {
      const response = await axios.patch(`/v1/menus/${menuId}/categories`, { categoryIds })
      return response.data.menu
    } catch (error) {
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
