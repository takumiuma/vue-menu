<template>
  <div>
    <loading v-model:active="isLoading" :enforce-focus="false" />
    <v-container>
      <v-row>
        <v-col><v-btn block variant="outlined" color="primary" @click="displayRandomMenus()">全てのメニューをランダムに表示</v-btn></v-col>
        <v-col>
          <v-select v-model="count" label="何件" :items="[1, 2, 3, 4, 5]" variant="outlined"> </v-select>
        </v-col>
        <v-col>
          <v-btn variant="outlined" color="primary" @click="displayRandomMenus(count)">ランダムに{{ count }}件表示</v-btn>
        </v-col>
        <v-col>
          <v-btn color="primary" @click="dialog = true">条件を絞る</v-btn>
        </v-col>
      </v-row>
      <div class="text-center">
        <v-dialog v-model="dialog" width="auto">
          <v-card>
            <v-btn color="primary" block @click="filterMenus(genreIds, categoryIds)">適用</v-btn>
            <v-row>
              <v-col>
                <v-data-table v-model="genreIds" :headers="genreHeader" :items="genres" show-select hover>
                  <!-- {{ item.id }}を消せばID表示は消える。 -->
                  <template #item.id="{ item }">{{ item.id }}</template>
                  <template #item.name="{ item }">{{ item.name }}</template>
                </v-data-table>
              </v-col>
              <v-col>
                <v-data-table v-model="categoryIds" :headers="categoryHeader" :items="categories" show-select hover>
                  <template #item.id="{ item }">{{ item.id }}</template>
                  <template #item.name="{ item }">{{ item.name }}</template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card>
        </v-dialog>
      </div>
    </v-container>
    <v-container>
      <v-data-table :headers="headers" :items="displayedMenu" hover>
        <template #top>
          <v-toolbar>
            <v-toolbar-title>Expandable Table</v-toolbar-title>
            <v-chip v-for="genreId in genreIds">{{ genres.find((genre) => genre.id === genreId).name }}</v-chip>
          </v-toolbar>
          <v-toolbar>
            <v-toolbar-title>Expandable Table</v-toolbar-title>
            <v-chip v-for="categoryId in categoryIds">{{ categories.find((category) => category.id === categoryId).name }}</v-chip>
          </v-toolbar>
        </template>
        <template #item="{ item }">
          <tr>
            <td>{{ item.name }}</td>
            <td>
              <a :href="item.shopSearch" target="_blank">{{ `「${item.name} お店 近く」で検索` }}</a>
            </td>
            <td>
              <a :href="item.recipeSearch" target="_blank">{{ `「${item.name}のレシピ」を検索` }}</a>
            </td>
            <td>
              <v-chip v-for="genreId in item.genreIds">{{ genres.find((genre) => genre.id === genreId).name }}</v-chip>
            </td>
            <td>
              <v-chip v-for="categoryId in item.categoryIds">{{ categories.find((category) => category.id === categoryId).name }}</v-chip>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-container>
  </div>
</template>
<script>
import { useMenuStore } from '~/store/menu';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

export default {
  setup() {
    const menuStore = useMenuStore();
    return {
      menuStore,
    };
  },
  components: {
    Loading,
  },
  data() {
    return {
      isLoading: false,
      fullPage: true,
      menuData: [],
      menuList: [],
      displayedMenu: [],
      filteredMenu: [],
      count: 3,
      genreIds: [1, 2, 3, 4, 5, 6],
      categoryIds: [1, 2, 3, 4, 5, 6, 7, 8],
      genres: [
        { id: 1, name: '和食' },
        { id: 2, name: '中華料理' },
        { id: 3, name: '洋食' },
        { id: 4, name: '韓国料理' },
        { id: 5, name: 'ファーストフード' },
        { id: 6, name: 'その他' },
      ],
      categories: [
        { id: 1, name: '肉' },
        { id: 2, name: '魚' },
        { id: 3, name: '野菜' },
        { id: 4, name: 'ご飯もの' },
        { id: 5, name: '麺類' },
        { id: 6, name: 'パン' },
        { id: 7, name: 'スープ・汁物' },
        { id: 8, name: 'その他' },
      ],
      genreHeader: [
        { title: 'ID', value: 'id' },
        { title: 'ジャンル', value: 'name' },
      ],
      categoryHeader: [
        { title: 'ID', value: 'id' },
        { title: 'カテゴリー', value: 'name' },
      ],
      headers: [
        { title: 'メニュー', value: 'name' },
        { title: 'Googleで近くのお店を検索', value: 'shopSearch' },
        { title: 'クックパッドでレシピを検索', value: 'recipeSearch' },
        { title: 'ジャンル', value: 'genreIds' },
        { title: 'カテゴリ', value: 'categoryIds' },
      ],
      dialog: false,
    };
  },
  created() {
    this.isLoading = true;
    this.getMenuList().then(() => {
      this.isLoading = false;
    });
  },
  methods: {
    /**
     * Piniaのstoreからメニューデータを取得し、メニューリストデータを整形して表示用にコピーします。
     * @async
     * @returns {Promise<void>}
     */
    async getMenuList() {
      // piniaのstoreからメニューデータを取得
      const menuData = await this.menuStore.getMenus();
      // メニューリストデータを整形
      this.menuList = menuData.map((menu) => ({
        id: menu.menuId,
        name: menu.menuName,
        shopSearch: `https://www.google.com/search?q=${menu.menuName} お店 近く`,
        recipeSearch: `https://cookpad.com/search/${menu.menuName}`,
        genreIds: menu.genreIds,
        categoryIds: menu.categoryIds,
      }));
      // メニューリストを表示用にコピー。元データは保持。
      this.displayedMenu = this.menuList;
    },

    /**
     * ランダムにメニューを表示します。条件絞り込み後のメニューがあればそれを使用します。
     * @param {number} [count] - 表示するメニューの数。指定がない場合は全て表示します。
     */
    displayRandomMenus(count) {
      // 条件絞り込み後のメニューがあればそれを使う
      const menuIds = this.filteredMenu.length !== 0 ? this.filteredMenu.map((menu) => menu.id) : this.menuList.map((menu) => menu.id);
      const shuffledMenuIds = this.shuffleArrayElements(menuIds);
      const randomMenus = this.findMenusByIds(shuffledMenuIds);
      // countが指定されていればその数だけ表示
      this.displayedMenu = count ? randomMenus.slice(0, count) : randomMenus;
    },

    /**
     * 指定されたIDのメニューを検索して返します。
     * @param {number[]} ids - メニューのIDの配列。
     * @returns {Object[]} - 指定されたIDのメニューの配列。
     */
    findMenusByIds(ids) {
      return ids.map((id) => this.menuList.find((menu) => menu.id === id));
    },

    /**
     * 数値配列をシャッフルして返します。
     * @param {number[]} nums - シャッフルする数値配列。
     * @returns {number[]} - シャッフルされた数値配列。
     */
    shuffleArrayElements(nums) {
      // Fisher-Yatesアルゴリズム
      for (let i = nums.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [nums[i], nums[j]] = [nums[j], nums[i]];
      }
      return nums;
    },

    /**
     * 指定されたジャンルIDとカテゴリIDに基づいてメニューをフィルタリングします。
     * @param {number[]} genreIds - フィルタリングするジャンルのIDの配列。
     * @param {number[]} categoryIds - フィルタリングするカテゴリのIDの配列。
     */
    filterMenus(genreIds, categoryIds) {
      this.filteredMenu = this.menuList.filter((menu) => genreIds.includes(menu.genreId) && categoryIds.includes(menu.categoryId));
      this.displayedMenu = this.filteredMenu;
      this.dialog = false;
    },
  },
};
</script>
