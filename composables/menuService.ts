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
 * メニューに紐づくジャンルを更新する
 */
const updateMenuGenre = async (menuId: number, genreIds: number[]): Promise<menu> => {
  const resultMenu = await useMenuStore().updateMenuGenre(menuId, genreIds);
  console.log(resultMenu);
  // メニュー情報リストを更新
  const index = menuList.value.findIndex((menu) => menu.id === resultMenu.menuId);
  if (index !== -1) {
    menuList.value[index].genreIds = resultMenu.genreIds;
  }
  return resultMenu;
};
/**
 * メニューに紐づくカテゴリを更新する
 */
const updateMenuCategory = async (menuId: number, categoryIds: number[]): Promise<menu> => {
  const resultMenu = await useMenuStore().updateMenuCategory(menuId, categoryIds);
  // メニュー情報リストを更新
  const index = menuList.value.findIndex((menu) => menu.id === resultMenu.menuId);
  if (index !== -1) {
    menuList.value[index].categoryIds = resultMenu.categoryIds;
  }
  return resultMenu;
};

// 現在のメニュー情報リストを返す
// const fetchMenuList = () => {
//   return menuList.value;
// };

export const useMenuService = () => {
  return {
    menuList,
    getMenuInfoList,
    updateMenuGenre,
    updateMenuCategory,
    // fetchMenuList,
  };
};
