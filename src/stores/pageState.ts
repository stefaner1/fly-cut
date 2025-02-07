import { ref, watchEffect } from 'vue';
import { defineStore } from 'pinia';

export const usePageState = defineStore('pageState', () => {
  const pageTitle = ref('Video Editor (CcClip)');
  // Dark mode
  const isDark = ref(Boolean(localStorage.theme) || true);
  console.log('🚀 ~ usePageState ~ isDark:', isDark);
  const isLoading = ref(localStorage.loadingPage === '1');
  const hideSubMenu = ref(localStorage.showSubmenu === '0');
  watchEffect(() => {
    console.log(`switch to ${isDark.value ? 'dark' : 'light'}`);
    localStorage.theme = isDark.value ? 'true' : 'false';
    localStorage.loadingPage = isLoading.value ? '1' : '0';
    localStorage.hideSubMenu = hideSubMenu.value ? '1' : '0';
    document.documentElement.classList[isDark.value ? 'add' : 'remove']('dark');
  });

  // Attribute width
  const attrWidth = ref(parseInt(localStorage.attrW || '320'));
  // Track height
  const trackHeight = ref(parseInt(localStorage.trackH || '380'));
  watchEffect(() => {
    localStorage.attrW = attrWidth.value;
    localStorage.trackH = trackHeight.value;
  });

  return {
    hideSubMenu,
    isLoading,
    pageTitle,
    isDark,
    attrWidth,
    trackHeight
  };
});
