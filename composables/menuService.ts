import { useMenuStore } from '~/store/menu';

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
    (menu): MenuInfo => ({
      id: menu.menuId,
      name: menu.menuName,
      shopSearch: `https://www.google.com/search?q=${menu.menuName} お店 近く`,
      recipeSearch: `https://cookpad.com/search/${menu.menuName}`,
      genreIds: menu.genreIds,
      categoryIds: menu.categoryIds,
    })
  );
};

export const useMenuService = () => {
  return { menuList, getMenuInfoList };
};
