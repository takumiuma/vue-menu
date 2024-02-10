<template>
  <div>
    <v-data-table :headers="headers" :items="randamMenu">
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
    <v-btn @click="randomGet()">ランダム表示</v-btn>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      menuList: [],
      randamMenu: [],
      genres: { 1: "和食", 2: "中華料理", 3: "洋食", 4: "韓国料理", 5: "ファーストフード", 6: "その他" },
      categories: { 1: "肉", 2: "魚", 3: "野菜", 4: "ご飯もの", 5: "麺類", 6: "パン", 7: "スープ・汁物", 8: "その他" },
      headers: [
        { title: "メニュー", value: "menu_name" },
        { title: "近くのお店を検索", value: "menu_name" },
        { title: "レシピを検索", value: "menu_name" },
      ],
    };
  },
  computed: {},
  watch: {},
  mounted() {},
  created() {
    // this.loading = true;
    this.initialize();
    // .then(() => {
    //   this.formatMenu;
    //   // this.loading = false;
    // });
  },
  methods: {
    initialize() {
      let count = 1;
      axios
        .get("http://localhost:8080/rest")
        .then((response) =>
          response.data.forEach((menu) =>
            this.menuList.push({
              id: count++,
              name: menu.menu_name,
              shopSearch: `https://www.google.com/search?q=${menu.menu_name} お店 近く`,
              recipeSearch: `https://www.google.com/search?q=${menu.menu_name} レシピ`,
              genreId: menu.eating_genre_id,
              categoryId: menu.eating_category_id,
            })
          )((this.randamMenu = this.menuList))
        )
        .catch((error) => console.log(error));
    },
    randomGet() {
      let idArray = this.randamMenu.map((menu) => menu.id);
      idArray = this.shuffleArray(idArray);
      this.randamMenu = idArray.map((id) => {
        return this.menuList.find((menu) => menu.id === id);
      });
    },
    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    },
  },
};
</script>
