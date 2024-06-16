// composablesディレクトリ直下ファイルは自動インポート対象となる
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useCounterStore = defineStore(
  'counter',
  () => {
    const count = ref(0);
    function increment() {
      count.value++;
    }
    return { count, increment };
  },
  //persistを追加して状態を保持する
  {
    persist: {
      //セッションストレージに保存する場合
      storage: persistedState.sessionStorage,
    },
  }
);
