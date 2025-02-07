import { ref, toRefs, reactive } from 'vue';
import { defineStore } from 'pinia';

export const usePlayerState = defineStore('playerState', () => {
  const ingLoadingCount = ref(0);
  // Canvas information
  const canvasOptions = reactive({
    width: 0,
    height: 0
  });
  // Total frames to play
  const playerConfig = reactive({
    frameCount: 0,
    playerWidth: 1080 / 6,
    playerHeight: 1920 / 6
  });
  const existVideo = ref(false);
  const playStartFrame = ref(0); // Current playing frame
  const playTargetTrackMap = ref(new Map()); // Currently playing elements collection
  const isPause = ref(true);

  return {
    isPause,
    playStartFrame,
    ingLoadingCount,
    playTargetTrackMap,
    existVideo,
    ...toRefs(playerConfig),
    canvasOptions
  };
});
