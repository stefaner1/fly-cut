import { useTrackState } from '@/stores/trackState';
const store = useTrackState();
export const initHotKey = () => {
    // Register global events
    window.onkeydown = (event: KeyboardEvent) => {
      // Check if key press is in an input field
      let activeElement = document.activeElement;
      if (activeElement && (['input', 'textarea'].includes(activeElement.tagName.toLowerCase()) || activeElement.isContentEditable)) {
        return;
      }
      const { composed, ctrlKey, key, type } = event;
      switch (key) {
          case 'Backspace':
              // Delete operation
              if (store.selectTrackItem.line !== -1 && store.selectTrackItem.index !== -1) {
                  store.removeTrack(store.selectTrackItem.line, store.selectTrackItem.index);
                  store.selectTrackItem.line = -1;
                  store.selectTrackItem.index = -1;
              }
              break;
          case 'Enter':
              break;
          default:
              break;
      }
    };
};
