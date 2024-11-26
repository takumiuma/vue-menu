<template>
  <div>
    <v-overlay v-model="overlay" class="align-center justify-center">
      <v-progress-circular size="64" indeterminate />
    </v-overlay>
    <v-container>
      <v-row>
        <v-col>
          <v-btn block variant="outlined" color="primary" @click="displayRandomMenus">
            全てのメニューをランダムに表示
          </v-btn>
        </v-col>
        <v-col>
          <v-select v-model="count" label="何件" :items="[1, 2, 3, 4, 5]" variant="outlined"> </v-select>
        </v-col>
        <v-col>
          <v-btn variant="outlined" color="primary" @click="displayRandomMenus(count)">
            ランダムに{{ count }}件表示
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-data-table :headers="HEADERS" :items="displayedMenu" hover>
        <template #top>
          <v-combobox
            v-model="selectedGenreNames"
            :items="GENRES.map((genre) => genre.name)"
            label="選択中のジャンル"
            chips
            multiple
            closable-chips
          />
          <v-combobox
            v-model="selectedCategoryNames"
            :items="CATEGORIES.map((category) => category.name)"
            label="選択中のカテゴリ"
            chips
            multiple
            closable-chips
          />
        </template>
        <template #item.shopSearch="{ item }">
          <a :href="item.shopSearch" target="_blank">{{ `「${item.name} お店 近く」で検索` }}</a>
        </template>
        <template #item.recipeSearch="{ item }">
          <a :href="item.recipeSearch" target="_blank">{{ `「${item.name}のレシピ」を検索` }}</a>
        </template>
        <template #item.genreIds="{ item }">
          <v-chip v-for="genreId in item.genreIds">
            {{ GENRES.find((genre) => genre.id === genreId)?.name }}
          </v-chip>
        </template>
        <template #item.categoryIds="{ item }">
          <v-chip v-for="categoryId in item.categoryIds">
            {{ CATEGORIES.find((category) => category.id === categoryId)?.name }}
          </v-chip>
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

<script setup lang="ts">
import { useMenuService, type MenuInfo } from '~/composables/menuService';

const { menuList } = useMenuService();

const HEADERS = [
  { title: 'メニュー', value: 'name' },
  { title: 'Googleで近くのお店を検索', value: 'shopSearch' },
  { title: 'クックパッドでレシピを検索', value: 'recipeSearch' },
  { title: 'ジャンル', value: 'genreIds' },
  { title: 'カテゴリ', value: 'categoryIds' },
];
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
const displayedMenu = ref<MenuInfo[]>([]);
const filteredMenu = ref<MenuInfo[]>([]);
const count = ref<number>(3);

const overlay = ref<boolean>(false);
const dialog = ref<boolean>(false);

/**
 * 選択されたジャンル名とカテゴリ名に基づいてメニューをフィルタリングします。
 *
 * 1. 選択されたジャンル名に対応するジャンルIDを取得します。
 * 2. 選択されたカテゴリ名に対応するカテゴリIDを取得します。
 * 3. メニューをフィルタリングし、条件を満たすメニューを `filteredMenu` に格納します。
 * 4. フィルタリングされたメニューを表示用に `displayedMenu` に設定します。
 */
const filteredMenus = () => {
  // 選択されたジャンル名に対応するジャンルIDを取得
  const selectedGenreIds = GENRES.filter((genre) => selectedGenreNames.value.includes(genre.name)).map(
    (genre) => genre.id
  );

  // 選択されたカテゴリ名に対応するカテゴリIDを取得
  const selectedCategoryIds = CATEGORIES.filter((category) => selectedCategoryNames.value.includes(category.name)).map(
    (category) => category.id
  );

  // メニューをフィルタリング
  filteredMenu.value = menuList.value.filter(
    (menu) =>
      menu.genreIds.every((id) => selectedGenreIds.includes(id)) &&
      menu.categoryIds.every((id) => selectedCategoryIds.includes(id))
  );

  // フィルタリングされたメニューを表示用に設定
  displayedMenu.value = filteredMenu.value;
};

watch(selectedGenreNames, () => {
  filteredMenus();
});
watch(selectedCategoryNames, () => {
  filteredMenus();
});

/**
 * 数値配列をシャッフルして返します。
 * @param {number[]} nums - シャッフルする数値配列。
 */
const shuffleArrayElements = (nums: number[]): number[] => {
  // Fisher-Yatesアルゴリズム
  for (let i = nums.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [nums[i], nums[j]] = [nums[j], nums[i]];
  }
  return nums;
};

/**
 * 指定されたIDのメニューを検索して返します。
 * @param {number[]} ids - メニューのIDの配列。
 * @returns {MenuInfo[]} - 指定されたIDのメニューの配列。
 */
const findMenusByIds = (ids: number[]): MenuInfo[] => {
  return ids
    .map((id) => menuList.value.find((menu) => menu.id === id))
    .filter((menu): menu is MenuInfo => menu !== undefined);
};

/**
 * ランダムにメニューを表示します。条件絞り込み後のメニューがあればそれを使用します。
 * @param {number} [count] - 表示するメニューの数。指定がない場合は全て表示します。
 */
const displayRandomMenus = (count: number) => {
  // 条件絞り込み後のメニューがあればそれを使う
  const menuIds =
    filteredMenu.value.length !== 0 ? filteredMenu.value.map((menu) => menu.id) : menuList.value.map((menu) => menu.id);
  const shuffledMenuIds = shuffleArrayElements(menuIds);
  const randomMenus = findMenusByIds(shuffledMenuIds);
  // countが指定されていればその数だけ表示
  displayedMenu.value = count ? randomMenus.slice(0, count) : randomMenus;
};

onMounted(async () => {
  overlay.value = true;
  await useMenuService().getMenuInfoList();
  // メニューリストを表示用にコピー。元データは保持。
  displayedMenu.value = menuList.value;
  overlay.value = false;
});
</script>
