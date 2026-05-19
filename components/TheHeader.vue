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
      <div v-if="prepared" class="pa-2">
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
const TITLE = 'MenuApp'

const ITEMS = [
  { title: 'ホーム', icon: 'mdi-food', link: '/' },
  { title: 'メニューリスト', icon: 'mdi-table-edit', link: '/menuList' },
  { title: 'お気に入り', icon: 'mdi-heart', link: '/favorites', authRequired: true },
]

const drawer = ref(false)
const prepared = ref(false)

const { isAuthenticated, init, login, logout } = useAuth0()

const filteredItems = computed(() => {
  return ITEMS.filter((item) => {
    if (item.authRequired) {
      return isAuthenticated.value
    }
    return true
  })
})

onBeforeMount(async () => {
  await init()
  prepared.value = true
})
</script>
