<template>
  <v-app-bar color="primary">
    <template v-slot:prepend>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title><v-icon icon="$vuetify"></v-icon>{{ title }}</v-app-bar-title>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'bottom' : undefined" temporary>
    <v-list>
      <v-list-item v-for="item in ITEMS" :key="item.title" :to="item.link">
        <v-icon>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-list-item>
    </v-list>
    <!-- ユーザー登録機能できたらコメントオフする -->
    <!-- <template v-slot:append>
      <div class="pa-2">
        <v-btn block> Logout </v-btn>
      </div>
    </template> -->
  </v-navigation-drawer>
</template>
<script>
export default {
  setup() {
    const ITEMS = [
      { title: 'ホームメニュー', icon: 'mdi-food', link: '/' },
      { title: 'カウント', icon: 'mdi-check', link: '/count' },
    ];
    return {
      ITEMS,
    };
  },

  data() {
    return {
      drawer: false,
      title: 'メニューリスト',
    };
  },
};
</script>
