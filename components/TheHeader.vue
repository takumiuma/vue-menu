<!-- <template>
    <div>
        フッター
    </div>
</template> -->
<template>
  <v-layout>
    <div>
      <v-app-bar color="primary">
        <template v-slot:prepend>
          <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        </template>
        <v-app-bar-title><v-icon icon="$vuetify"></v-icon>{{ title }}</v-app-bar-title>
      </v-app-bar>
    </div>
  </v-layout>
</template>
<script>
export default {
  data() {
    return {
      title: "VuetifyでTODOリスト",
      drawer: false,
      group: null,
    };
  },
  watch: {
    group() {
      this.drawer = false;
    },
  },
};
</script>
