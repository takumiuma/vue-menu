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
    try {
      const response = await axios.get('http://localhost:8080/v1/menus');
      return response.data.menus;
    } catch (error) {
      console.error('Failed to fetch menus:', error);
      return [];
    }
  };

  // メニューに紐づくジャンルを更新する
  const updateMenuGenre = async (menuId: number, genreIds: number[]): Promise<menu> => {
    try {
      const response = await axios.patch(`http://localhost:8080/v1/menus/${menuId}/genres`, { genreIds });
      return response.data.menu;
    } catch (error) {
      console.error('Failed to update menu genre:', error);
      // TODO:空のmenuオブジェクトだと通信の成功が判断しづらいので、エラーをスローするか、返すかを検討する
      return {} as menu;
    }
  };

  // メニューに紐づくカテゴリを更新する
  const updateMenuCategory = async (menuId: number, categoryIds: number[]): Promise<menu> => {
    try {
      const response = await axios.patch(`http://localhost:8080/v1/menus/${menuId}/categories`, { categoryIds });
      return response.data.menu;
    } catch (error) {
      console.error('Failed to update menu category:', error);
      // TODO:空のmenuオブジェクトだと通信の成功が判断しづらいので、エラーをスローするか、返すかを検討する
      return {} as menu;
    }
  };

  return {
    getMenus,
    updateMenuGenre,
    updateMenuCategory,
  };
});
