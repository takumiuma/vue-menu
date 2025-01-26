<template>
  <v-app-bar color="primary">
    <template v-slot:prepend>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title><v-icon icon="$vuetify"></v-icon>{{ TITLE }}</v-app-bar-title>
    <v-btn variant="outlined" @click="logout">ログアウト</v-btn>
    <v-btn variant="outlined" @click="login">ログイン</v-btn>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer" :location="$vuetify.display.mobile ? 'top' : undefined" temporary>
    <v-list>
      <v-list-item v-for="item in ITEMS" :key="item.title" :to="item.link">
        <v-icon>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-list-item>
    </v-list>
    <!-- ユーザー登録機能できたらコメントオフする -->
    <!-- <template v-slot:append>
      <div class="pa-2">
        <v-btn block> <v-icon>{{ 'mdi-logout' }}</v-icon>Logout </v-btn>
      </div>
    </template> -->
  </v-navigation-drawer>
</template>
<script setup lang="ts">
import { Auth0Client, type RedirectLoginOptions, createAuth0Client } from '@auth0/auth0-spa-js';
import { useRouter } from 'vue-router';

const TITLE = 'MenuApp';

const ITEMS = [
  { title: 'ホーム', icon: 'mdi-food', link: '/' },
  { title: 'メニューリスト', icon: 'mdi-table-edit', link: '/menuList' },
];
const router = useRouter();
const config = useRuntimeConfig();

const auth0 = ref<Auth0Client | null>(null);
const drawer = ref(false);

onMounted(async () => {
  auth0.value = await createAuth0Client({
    domain: config.public.AUTH0_DOMAIN as string,
    clientId: config.public.AUTH0_CLIENT_ID as string,
  });

  if (
    (window.location.search.includes('code=') && window.location.search.includes('state=')) ||
    window.location.search.includes('error=')
  ) {
    // 認証成功しているか確認
    await auth0.value.handleRedirectCallback();
    router.push('/'); // 暫定的にクエリパラメーターを削除
  }
  const isAuthenticated = await auth0.value.isAuthenticated();
  if (isAuthenticated) {
    const user = await auth0.value?.getUser();
    console.log(user);
  }
});

const loginWithRedirect = (o?: RedirectLoginOptions) => auth0.value?.loginWithRedirect(o);
const login = async () => {
  await loginWithRedirect({
    authorizationParams: {
      redirect_uri: window.location.origin,
    },
  });
};
const logout = () => auth0.value?.logout({ logoutParams: { returnTo: window.location.origin } });
</script>
