<template>
  <v-container>
    <loading
      v-model:active="isLoading"
      :can-cancel="true"
      :on-cancel="onCancel"
      :is-full-page="fullPage"
    />
    <v-row>
      <v-col><v-btn @click="getMenu()">ランダム表示</v-btn></v-col>
      <v-col>
        <v-select v-model="count" label="何件" :items="[1, 2, 3, 4, 5]" variant="outlined">
        </v-select>
      </v-col>
      <v-col>
        <v-btn @click="getMenu(count)">ランダムに{{ count }}件表示</v-btn>
      </v-col>
      <v-col>
        <v-btn color="primary" @click="dialog = true">条件を絞る</v-btn>
      </v-col>
    </v-row>
    <div class="text-center">
      <v-dialog v-model="dialog" width="auto">
        <v-card>
          <v-btn color="primary" block @click="menuFilter(genreIds, categoryIds)">適用</v-btn>
          <v-row>
            <v-col>
              <v-data-table
                v-model="genreIds"
                :headers="genreHeader"
                :items="genres"
                show-select
                hover
              >
                <!-- {{ item.id }}を消せばID表示は消える。 -->
                <template #item.id="{ item }">{{ item.id }}</template>
                <template #item.name="{ item }">{{ item.name }}</template>
              </v-data-table>
            </v-col>
            <v-col>
              <v-data-table
                v-model="categoryIds"
                :headers="categoryHeader"
                :items="categories"
                show-select
                hover
              >
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
      <template #item="{ item }">
        <tr>
          <td>{{ item.name }}</td>
          <td>
            <a :href="item.shopSearch" target="_blank">「{{ item.name }} お店 近く」で検索</a>
          </td>
          <td>
            <a :href="item.recipeSearch" target="_blank">「{{ item.name }} レシピ」で検索</a>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import axios from 'axios';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';

export default {
  components: {
    Loading,
  },
  data() {
    return {
      isLoading: false,
      fullPage: true,
      isHide: true,
      menuList: [],
      displayedMenu: [],
      filteredMenu: null,
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
        { title: 'メニュー', value: 'menu_name' },
        { title: '近くのお店を検索', value: 'menu_name' },
        { title: 'レシピを検索', value: 'menu_name' },
      ],
      dialog: false,
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {
    // this.isLoading = true;
    this.initialize();
    // this.isLoading = false;
  },
  methods: {
    initialize() {
      axios
        .get('http://localhost:8080/rest')
        .then((response) =>
          response.data.forEach((menu) =>
            this.menuList.push({
              id: menu.menu_id,
              name: menu.menu_name,
              shopSearch: `https://www.google.com/search?q=${menu.menu_name} お店 近く`,
              recipeSearch: `https://www.google.com/search?q=${menu.menu_name} レシピ`,
              genreId: menu.eating_genre_id,
              categoryId: menu.eating_category_id,
            })
          )((this.displayedMenu = this.menuList))
        )
        .catch((error) => console.log(error));
    },
    getMenu(count) {
      // 条件絞り込みダイアログ使用しているかチェック
      if (this.filteredMenu) {
        let idArray = this.filteredMenu.map((menu) => menu.id);
        idArray = this.shuffleArray(idArray);
        this.randamGet(idArray);
      } else {
        let idArray = this.menuList.map((menu) => menu.id);
        idArray = this.shuffleArray(idArray);
        this.randamGet(idArray);
      }
      if (count) {
        this.displayedMenu = this.displayedMenu.slice(0, count);
      }
    },
    randamGet(idArray) {
      this.displayedMenu = idArray.map((id) => {
        return this.menuList.find((menu) => menu.id === id);
      });
    },
    // 引数の数値配列をシャッフルする
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
    menuFilter(genreIds, categoryIds) {
      this.filteredMenu = this.menuList.filter(
        (menu) => genreIds.includes(menu.genreId) && categoryIds.includes(menu.categoryId)
      );
      this.displayedMenu = this.filteredMenu;
      this.dialog = false;
    },
    onCancel() {
      console.log('User cancelled the loader.');
    },
  },
};
</script>
