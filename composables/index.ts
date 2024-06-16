import axios from 'axios';
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

interface MenuItem {
  // メニュー項目の型定義
}

export const useMenuListStore = defineStore('menuList', async () => {
  let menuData1 = ref<MenuItem[]>([]);
  await axios
    .get('http://localhost:8080/rest')
    .then((response) => (menuData1 = response.data))
    .catch((error) => console.log(error));
  return { menuData1 };
});
// async () => {
//     const menuData = ref<MenuItem[]>([]);;
//       await axios
//       .get('http://localhost:8080/rest')
//       .then((response) => {
//           menuData.value = response.data as MenuItem[];
//       })
//       .catch((error) => console.log(error));
//     return {menuData: computed(() => menuData.value)};
//   },
