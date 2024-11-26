<template>
  <div>
    <v-overlay v-model="overlay" class="align-center justify-center">
      <v-progress-circular size="64" indeterminate />
    </v-overlay>
    <v-container>
      <v-row>
        <v-col><v-btn block variant="outlined" color="primary" @click="displayRandomMenus()">全てのメニューをランダムに表示</v-btn></v-col>
        <v-col>
          <v-select v-model="count" label="何件" :items="[1, 2, 3, 4, 5]" variant="outlined"> </v-select>
        </v-col>
        <v-col>
          <v-btn variant="outlined" color="primary" @click="displayRandomMenus(count)">ランダムに{{ count }}件表示</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-data-table :headers="headers" :items="displayedMenu" hover>
        <template #top>
          <v-combobox v-model="selectedGenreNames" :items="GENRES.map((genre) => genre.name)" label="選択中のジャンル" chips multiple closable-chips></v-combobox>
          <v-combobox v-model="selectedCategoryNames" :items="CATEGORIES.map((category) => category.name)" label="選択中のカテゴリ" chips multiple closable-chips></v-combobox>
        </template>
        <template #item.shopSearch="{ item }">
          <a :href="item.shopSearch" target="_blank">{{ `「${item.name} お店 近く」で検索` }}</a>
        </template>
        <template #item.recipeSearch="{ item }">
          <a :href="item.recipeSearch" target="_blank">{{ `「${item.name}のレシピ」を検索` }}</a>
        </template>
        <template #item.genreIds="{ item }">
          <v-chip v-for="genreId in item.genreIds">{{ GENRES.find((genre) => genre.id === genreId).name }}</v-chip>
        </template>
        <template #item.categoryIds="{ item }">
          <v-chip v-for="categoryId in item.categoryIds">{{ CATEGORIES.find((category) => category.id === categoryId).name }}</v-chip>
        </template>
      </v-data-table>
    </v-container>
    <v-dialog v-model="dialog" width="auto">
      <v-card>
        <!-- 各メニューのタグ付け替えダイアログ作成予定 -->
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { useMenuStore } from '~/store/menu';

export default {
  setup() {
    const menuStore = useMenuStore();
    const GENRES = [
      { id: 1, name: '和食' },
      { id: 2, name: '中華料理' },
      { id: 3, name: '洋食' },
      { id: 4, name: '韓国料理' },
      { id: 5, name: 'ファーストフード' },
      { id: 6, name: 'その他' },
    ];
    const CATEGORIES = [
      { id: 1, name: '肉' },
      { id: 2, name: '魚' },
      { id: 3, name: '野菜' },
      { id: 4, name: 'ご飯もの' },
      { id: 5, name: '麺類' },
      { id: 6, name: 'パン' },
      { id: 7, name: 'スープ・汁物' },
      { id: 8, name: 'その他' },
    ];
    const selectedGenreNames = ref(GENRES.map((genre) => genre.name));
    const selectedCategoryNames = ref(CATEGORIES.map((category) => category.name));
    return {
      menuStore,
      GENRES,
      CATEGORIES,
      selectedGenreNames,
      selectedCategoryNames,
    };
  },
  data() {
    return {
      overlay: false,
      menuList: [],
      displayedMenu: [],
      filteredMenu: [],
      count: 3,
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
  watch: {
    selectedGenreNames() {
      this.filteredMenus();
    },
    selectedCategoryNames() {
      this.filteredMenus();
    },
  },
  computed: {},
  created() {
    this.overlay = true;
    this.getMenuList().then(() => {
      this.overlay = false;
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
     * 選択されたジャンル名とカテゴリ名に基づいてメニューをフィルタリングします。
     *
     * 1. 選択されたジャンル名に対応するジャンルIDを取得します。
     * 2. 選択されたカテゴリ名に対応するカテゴリIDを取得します。
     * 3. メニューをフィルタリングし、条件を満たすメニューを `filteredMenu` に格納します。
     * 4. フィルタリングされたメニューを表示用に `displayedMenu` に設定します。
     */
    filteredMenus() {
      // 選択されたジャンル名に対応するジャンルIDを取得
      const selectedGenreIds = this.GENRES.filter((genre) => this.selectedGenreNames.includes(genre.name)).map((genre) => genre.id);

      // 選択されたカテゴリ名に対応するカテゴリIDを取得
      const selectedCategoryIds = this.CATEGORIES.filter((category) => this.selectedCategoryNames.includes(category.name)).map((category) => category.id);

      // メニューをフィルタリング
      this.filteredMenu = this.menuList.filter((menu) => menu.genreIds.every((id) => selectedGenreIds.includes(id)) && menu.categoryIds.every((id) => selectedCategoryIds.includes(id)));

      // フィルタリングされたメニューを表示用に設定
      this.displayedMenu = this.filteredMenu;
    },
  },
};
</script>
