import { useMenuStore, type menu } from '~/store/menu';

export interface MenuInfo {
  id: number;
  name: string;
  shopSearch: string;
  recipeSearch: string;
  genreIds: number[];
  categoryIds: number[];
}

const menuList = ref<MenuInfo[]>([]);

/**
 * メニュー情報リストを取得する
 */
const getMenuInfoList = async (): Promise<void> => {
  // piniaのstoreからメニューデータを取得
  const menuData = await useMenuStore().getMenus();
  // メニュー情報リストを整形
  menuList.value = menuData.map(
    (menu: menu): MenuInfo => ({
      id: menu.menuId,
      name: menu.menuName,
      shopSearch: `https://www.google.com/search?q=${menu.menuName} お店 近く`,
      recipeSearch: `https://cookpad.com/search/${menu.menuName}`,
      genreIds: menu.genreIds,
      categoryIds: menu.categoryIds,
    })
  );
};

/**
 * メニューを新規作成する
 */
const createMenu = async (menu: menu): Promise<menu> => {
  return await useMenuStore().createMenu(menu);
};

/**
 * メニューを更新する
 */
const updateMenu = async (menu: menu): Promise<menu> => {
  return await useMenuStore().updateMenu(menu);
};

/**
 * メニューを削除する
 */
const deleteMenu = async (menuId: number): Promise<void> => {
  await useMenuStore().deleteMenu(menuId);
};

/**
 * メニューに紐づくジャンルを更新する
 */
const updateMenuGenre = async (menuId: number, genreIds: number[]): Promise<menu> => {
  const resultMenu = await useMenuStore().updateMenuGenre(menuId, genreIds);
  // メニュー情報リストを更新
  if (Object.keys(resultMenu).length > 0) {
    const index = menuList.value.findIndex((menu) => menu.id === resultMenu.menuId);
    if (index !== -1) {
      menuList.value[index].genreIds = resultMenu.genreIds;
    }
  }
  return resultMenu;
};
/**
 * メニューに紐づくカテゴリを更新する
 */
const updateMenuCategory = async (menuId: number, categoryIds: number[]): Promise<menu> => {
  const resultMenu = await useMenuStore().updateMenuCategory(menuId, categoryIds);
  // メニュー情報リストを更新
  if (Object.keys(resultMenu).length > 0) {
    const index = menuList.value.findIndex((menu) => menu.id === resultMenu.menuId);
    if (index !== -1) {
      menuList.value[index].categoryIds = resultMenu.categoryIds;
    }
  }
  return resultMenu;
};

export const useMenuService = () => {
  return {
    menuList,
    getMenuInfoList,
    createMenu,
    updateMenu,
    deleteMenu,
    updateMenuGenre,
    updateMenuCategory,
  };
};
