<template>
  <v-app-bar color="primary">
    <template #prepend>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />
    </template>
    <v-app-bar-title><v-icon icon="$vuetify" />{{ TITLE }}</v-app-bar-title>
  </v-app-bar>
  <v-navigation-drawer
    v-model="drawer"
    :location="$vuetify.display.mobile ? 'top' : undefined"
    temporary
  >
    <v-list>
      <v-list-item v-for="item in filteredItems" :key="item.title" :to="item.link">
        <v-icon>{{ item.icon }}</v-icon>
        {{ item.title }}
      </v-list-item>
    </v-list>
    <template #append>
      <div v-if="!isPreviewMode && prepared" class="pa-2">
        <v-btn v-if="!isAuthenticated" block @click="login">
          <v-icon>{{ 'mdi-login' }}</v-icon>
          Login
        </v-btn>
        <v-btn v-if="isAuthenticated" block @click="logout">
          <v-icon>{{ 'mdi-logout' }}</v-icon>
          Logout
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import type { Auth0Client } from '@auth0/auth0-spa-js'
import { createAuth0Client } from '@auth0/auth0-spa-js'
import { useRouter } from 'vue-router'

const TITLE = 'MenuApp'

const ITEMS = [
  { title: 'ホーム', icon: 'mdi-food', link: '/' },
  { title: 'メニューリスト', icon: 'mdi-table-edit', link: '/menuList' },
  { title: 'お気に入り', icon: 'mdi-heart', link: '/favorites', authRequired: true },
]
const router = useRouter()
const config = useRuntimeConfig()
const isPreviewMode = !config.public.AUTH0_DOMAIN || !config.public.AUTH0_CLIENT_ID

const appBaseUrl = computed(() => {
  if (import.meta.client) {
    return new URL(config.app.baseURL, window.location.origin).toString()
  }
  return config.app.baseURL
})

const drawer = ref(false)
const auth0 = ref<Auth0Client | null>(null)
const isAuthenticated = ref(false)
const prepared = ref(false)

const filteredItems = computed(() => {
  return ITEMS.filter((item) => {
    if (item.authRequired) {
      return isAuthenticated.value
    }
    return true
  })
})

onBeforeMount(async () => {
  if (isPreviewMode) {
    prepared.value = true
    return
  }

  auth0.value = await createAuth0Client({
    domain: config.public.AUTH0_DOMAIN as string,
    clientId: config.public.AUTH0_CLIENT_ID as string,
  })

  if (
    (window.location.search.includes('code=') && window.location.search.includes('state=')) ||
    window.location.search.includes('error=')
  ) {
    // 認証成功しているか確認
    await auth0.value.handleRedirectCallback()
    router.push('/') // 暫定的にクエリパラメーターを削除
  }
  isAuthenticated.value = await auth0.value.isAuthenticated()
  if (isAuthenticated.value) {
    const user = await auth0.value?.getUser()
    console.log(user)
  }
  prepared.value = true
})

const login = async () => {
  await auth0.value?.loginWithRedirect({
    authorizationParams: {
      redirect_uri: appBaseUrl.value,
    },
  })
}

const logout = () => auth0.value?.logout({ logoutParams: { returnTo: appBaseUrl.value } })
</script>
