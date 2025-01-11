<template>
  <div>
    <v-overlay v-model="overlay" class="align-center justify-center">
      <v-progress-circular size="64" indeterminate />
    </v-overlay>
    <v-container>
      <v-row>
        <v-col><div class="text-h4 font-weight-bold">メニューリスト</div></v-col>
        <v-col cols="auto">
          <v-btn color="primary" @click="dialog = true">新しくメニューを追加</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-data-table :headers="HEADERS" :items="displayedMenu" :search="search" hover :loading="loading">
        <template #loading>
          <v-skeleton-loader type="table-row@10"></v-skeleton-loader>
        </template>
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
          <v-text-field
            v-model="search"
            label="Search"
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            hide-details
            single-line
          ></v-text-field>
        </template>
        <template #item.genreIds="{ item }">
          <v-chip v-for="genreId in item.genreIds">
            {{ GENRES.find((genre) => genre.id === genreId)?.name }}
          </v-chip>
          <v-menu :close-on-content-click="false">
            <template #activator="{ props }">
              <v-icon v-bind="props" icon="mdi-cog-outline" size="small" @click="editGenreTags(item.genreIds)" />
            </template>
            <v-card width="230px">
              <v-card-title class="text-h6 font-weight-bold">{{ item.name }}</v-card-title>
              <v-card-text class="d-flex justify-center">
                <v-chip-group v-model="selectedGenreChips" column multiple mandatory="force">
                  <v-chip v-for="genre in GENRES" variant="outlined" filter>
                    {{ genre.name }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>
              <v-card-actions>
                <v-btn block variant="flat" color="primary" @click="updateMenuGenre(item.id)">適用</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </template>
        <template #item.categoryIds="{ item }">
          <v-chip v-for="categoryId in item.categoryIds">
            {{ CATEGORIES.find((category) => category.id === categoryId)?.name }}
          </v-chip>
          <v-menu :close-on-content-click="false">
            <template #activator="{ props }">
              <v-icon v-bind="props" icon="mdi-cog-outline" size="small" @click="editCategoryTags(item.categoryIds)" />
            </template>
            <v-card width="250px">
              <v-card-title class="text-h6 font-weight-bold">{{ item.name }}</v-card-title>
              <v-card-text class="d-flex justify-center">
                <v-chip-group v-model="selectedCategoryChips" column multiple mandatory="force">
                  <v-chip v-for="category in CATEGORIES" variant="outlined" filter>
                    {{ category.name }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>
              <v-card-actions>
                <v-btn block variant="flat" color="primary" @click="updateMenuCategory(item.id)">適用</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </template>
        <template #item.action="{ item }">
          <v-icon @click="editMenu(item)" class="mr-2">mdi-pencil</v-icon>
          <!-- <v-icon @click="deleteMenu(item)">mdi-delete</v-icon> -->
        </template>
      </v-data-table>
    </v-container>
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <h2>{{ dialogLabel }}</h2>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="editedItem.menuName" clearable label="新メニュー"></v-text-field>
          <h3 class="mb-2">ジャンル</h3>
          <v-chip-group v-model="selectedGenreChips" column multiple mandatory="force">
            <v-chip v-for="genre in GENRES" variant="outlined" filter>
              {{ genre.name }}
            </v-chip>
          </v-chip-group>
          <h3 class="mb-2">カテゴリ</h3>
          <v-chip-group v-model="selectedCategoryChips" column multiple mandatory="force">
            <v-chip v-for="category in CATEGORIES" variant="outlined" filter>
              {{ category.name }}
            </v-chip>
          </v-chip-group>
        </v-card-text>
        <v-card-actions>
          <v-btn variant="outlined" color="primary" @click="dialog = false">閉じる</v-btn>
          <v-btn variant="flat" color="primary" @click="saveMenu">保存</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { type menu } from '~/store/menu';
import { useMenuService, type MenuInfo } from '~/composables/useMenuService';
import { cloneDeep } from 'lodash';

const { menuList } = useMenuService();

const HEADERS = [
  { title: 'メニュー', value: 'name' },
  { title: 'ジャンル', value: 'genreIds' },
  { title: 'カテゴリ', value: 'categoryIds' },
  { title: 'Action', value: 'action' },
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
const search = ref<string>('');

const displayedMenu = ref<MenuInfo[]>([]); // v-data-tableに表示するメニュー
const filteredMenu = ref<MenuInfo[]>([]); // カテゴリとジャンルの条件絞り込み後メニュー（displayedMenuのシャローコピー）
const selectedGenreNames = ref<string[]>(GENRES.map((genre) => genre.name)); // 選択中のジャンル名
const selectedCategoryNames = ref<string[]>(CATEGORIES.map((category) => category.name)); // 選択中のカテゴリ名
const selectedGenreChips = ref<number[]>([]);
const selectedCategoryChips = ref<number[]>([]);

const editedItem = ref<menu>({ menuId: 0, menuName: '', genreIds: [], categoryIds: [] });
const dialogLabel = computed(() => (editedItem.value.menuId === 0 ? 'メニュー追加' : 'メニュー編集'));
const dialog = ref<boolean>(false);

const overlay = ref<boolean>(false);
const loading = ref<boolean>(false);

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
      menu.genreIds.some((id) => selectedGenreIds.includes(id)) &&
      menu.categoryIds.some((id) => selectedCategoryIds.includes(id))
  );

  // フィルタリングされたメニューを表示用に設定
  // 深い要素は変更しないので、スプレッド構文でコピー
  displayedMenu.value = [...filteredMenu.value];
};

watch(selectedGenreNames, () => {
  filteredMenus();
});
watch(selectedCategoryNames, () => {
  filteredMenus();
});

watch(dialog, () => {
  if (!dialog.value) clearEditedItem();
});

const clearEditedItem = () => {
  editedItem.value = { menuId: 0, menuName: '', genreIds: [], categoryIds: [] };
  selectedGenreChips.value = [];
  selectedCategoryChips.value = [];
};

const saveMenu = async () => {
  overlay.value = true;
  loading.value = true;
  if (editedItem.value.menuId === 0) {
    // 新規メニュー作成

    // 選択されたジャンルIDを取得
    const selectedGenreChipIds = selectedGenreChips.value.map((index) => GENRES[index].id);
    editedItem.value.genreIds = selectedGenreChipIds;
    // 選択されたカテゴリIDを取得
    const selectedCategoryChipIds = selectedCategoryChips.value.map((index) => CATEGORIES[index].id);
    editedItem.value.categoryIds = selectedCategoryChipIds;
    // メニューを新規作成
    const result = await useMenuService().createMenu(editedItem.value);
    if (Object.keys(result).length > 0) {
      // TODO:失敗時はアラートを表示するようなエラーハンドリングを追加
      // メニュー作成成功時は、再度メニュー情報を取得
      await useMenuService().getMenuInfoList();
      // メニューリストを表示用にコピー。元データは保持。
      displayedMenu.value = cloneDeep(menuList.value);
    }
  } else {
    // メニューを更新

    // 選択されたジャンルIDを取得
    const selectedGenreChipIds = selectedGenreChips.value.map((index) => GENRES[index].id);
    editedItem.value.genreIds = selectedGenreChipIds;
    // 選択されたカテゴリIDを取得
    const selectedCategoryChipIds = selectedCategoryChips.value.map((index) => CATEGORIES[index].id);
    editedItem.value.categoryIds = selectedCategoryChipIds;
    // メニューを更新
    const result = await useMenuService().updateMenu(editedItem.value);
    if (Object.keys(result).length > 0) {
      // メニュー作成成功時は、再度メニュー情報を取得
      await useMenuService().getMenuInfoList();
      // メニューリストを表示用にコピー。元データは保持。
      displayedMenu.value = cloneDeep(menuList.value);
    }
  }

  dialog.value = false;
  overlay.value = false;
  loading.value = false;
};

const editGenreTags = (genreIds: number[]) => {
  // 選択されたジャンルIDを設定
  // v-chip-groupのmodelはnumber[]
  // 各v-chipのfilter=trueの要素がmodelに反映されるので、item.genreIdsに対応するGENRESのindexを設定
  selectedGenreChips.value = GENRES.reduce<number[]>((acc, genre, index) => {
    if (genreIds.includes(genre.id)) acc.push(index);
    return acc;
  }, []);
};

const editCategoryTags = (categoryIds: number[]) => {
  // 選択されたカテゴリIDを設定
  selectedCategoryChips.value = CATEGORIES.reduce<number[]>((acc, category, index) => {
    if (categoryIds.includes(category.id)) acc.push(index);
    return acc;
  }, []);
};

const editMenu = (menu: MenuInfo) => {
  editGenreTags(menu.genreIds);
  editCategoryTags(menu.categoryIds);
  editedItem.value = { menuId: menu.id, menuName: menu.name, genreIds: menu.genreIds, categoryIds: menu.categoryIds };
  dialog.value = true;
};

const updateMenuGenre = async (menuId: number) => {
  // 選択されたジャンルIDを取得
  const selectedGenreChipIds = selectedGenreChips.value.map((index) => GENRES[index].id);
  // メニューのジャンルIDを更新
  const result = await useMenuService().updateMenuGenre(menuId, selectedGenreChipIds);
  // 更新に成功した場合、メニュー情報を更新
  if (Object.keys(result).length > 0) {
    // 表示されているメニューのジャンルIDを更新
    const displayedMenuIndex = displayedMenu.value.findIndex((menu) => menu.id === result.menuId);
    if (displayedMenuIndex !== -1) {
      // filteredMenuはシャローコピーなので、displayedMenuの要素を更新すると同時にfilteredMenuも更新される
      displayedMenu.value[displayedMenuIndex].genreIds = result.genreIds;
    }
  }
};

const updateMenuCategory = async (menuId: number) => {
  // 選択されたカテゴリIDを取得
  const selectedCategoryChipIds = selectedCategoryChips.value.map((index) => CATEGORIES[index].id);
  // メニューのカテゴリIDを更新
  const result = await useMenuService().updateMenuCategory(menuId, selectedCategoryChipIds);
  // 更新に成功した場合、メニュー情報を更新
  if (Object.keys(result).length > 0) {
    // 表示されているメニューのカテゴリIDを更新
    const displayedMenuIndex = displayedMenu.value.findIndex((menu) => menu.id === result.menuId);
    if (displayedMenuIndex !== -1) {
      // filteredMenuはシャローコピーなので、displayedMenuの要素を更新すると同時にfilteredMenuも更新される
      displayedMenu.value[displayedMenuIndex].categoryIds = result.categoryIds;
    }
  }
};

onMounted(async () => {
  overlay.value = true;
  loading.value = true;
  await useMenuService().getMenuInfoList();
  // メニューリストを表示用にコピー。元データは保持。
  displayedMenu.value = cloneDeep(menuList.value);
  overlay.value = false;
  loading.value = false;
});
</script>
