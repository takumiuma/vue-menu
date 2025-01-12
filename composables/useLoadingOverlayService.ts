const overlay = ref<boolean>(false);

const startLoading = () => {
  overlay.value = true;
};

const endLoading = () => {
  overlay.value = false;
};

export const useLoadingOverlayStore = defineStore('overlay', () => {
  return {
    overlay,
    startLoading,
    endLoading,
  };
});
