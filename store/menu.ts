import axios from 'axios';
import { ref } from 'vue';
import { defineStore } from 'pinia';

// スネークケースをキャメルケースに変換する関数
const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => toCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelCaseKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
      result[camelCaseKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

/**
 * キャメルケースをスネークケースに変換する関数
 * @param {string} str - 変換するキャメルケースの文字列
 * @returns {string} - スネークケースに変換された文字列
 */
const toSnakeCase = (str: string): string => {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
};

/**
 * オブジェクトのキーをキャメルケースからスネークケースに変換する関数
 * @param {any} obj - 変換するオブジェクト
 * @returns {any} - キーがスネークケースに変換されたオブジェクト
 */
const convertKeysToSnakeCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => convertKeysToSnakeCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeCaseKey = toSnakeCase(key);
      result[snakeCaseKey] = convertKeysToSnakeCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
};

// Axiosインターセプターの設定
axios.interceptors.request.use(
  (config) => {
    if (config.data) {
      config.data = convertKeysToSnakeCase(config.data);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    response.data = toCamelCase(response.data);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface menu {
  menuId: number;
  menuName: string;
  genreIds: number[];
  categoryIds: number[];
}

export const useMenuStore = defineStore('menu', () => {
  const getMenus = async (): Promise<menu[]> => {
    const menuData = ref<menu[]>([]);
    await axios
      .get('http://localhost:8080/v1/menus')
      .then((response) => (menuData.value = response.data.menus))
      .catch((error) => console.log(error));
    return menuData.value;
  };

  // メニューに紐づくジャンルを更新する
  const updateMenuGenre = async (menuId: number, genreIds: number[]): Promise<menu> => {
    const menuData = ref<menu>({} as menu);
    await axios
      .patch(`http://localhost:8080/v1/menus/${menuId}/genres`, { genreIds })
      .then((response) => (console.log(response), (menuData.value = response.data.menu)))
      .catch((error) => console.log(error));
    return menuData.value;
  };

  // メニューに紐づくカテゴリを更新する
  const updateMenuCategory = async (menuId: number, categoryIds: number[]): Promise<menu> => {
    const menuData = ref<menu>({} as menu);
    await axios
      .patch(`http://localhost:8080/v1/menus/${menuId}/categories`, { categoryIds })
      .then((response) => (menuData.value = response.data.menu))
      .catch((error) => console.log(error));
    return menuData.value;
  };

  return {
    getMenus,
    updateMenuGenre,
    updateMenuCategory,
  };
});
