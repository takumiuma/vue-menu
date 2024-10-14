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

// Axiosインターセプターの設定
axios.interceptors.response.use(
  (response) => {
    response.data = toCamelCase(response.data);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface menu {
  menuId: number;
  menuName: string;
  eatingGenreId: number;
  eatingCategoryId: number;
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

  return {
    getMenus,
  };
});
