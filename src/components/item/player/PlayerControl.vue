<template>
  <div class="flex items-center justify-center absolute bottom-0 left-0 right-0 pl-4 pr-4 h-8 border-t dark:border-darker border-gray-300">
    <div class="absolute left-4 h-full text-xs leading-8">
      <span class="text-blue-400 mr-1 w-20 inline-block">{{ playTime }}</span>/<span class="ml-2 w-20">{{ allTime }}</span>
    </div>
    <div class="m-auto flex items-center">
      <ElIcon :size="24" class="cursor-pointer box-content" :class="[disable ? 'cursor-not-allowed' : 'cursor-pointer']">
        <VideoPause v-show="!store.isPause" @click="pauseVideo" />
        <VideoPlay v-show="store.isPause" @click="startPlay" />
      </ElIcon>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { VideoPlay, VideoPause } from '@element-plus/icons-vue';
  import { ref, computed, watch } from 'vue';
  import { formatPlayerTime, preciseInterval } from '@/utils/common';
  import { usePlayerState } from '@/stores/playerState';
  import { useTrackState } from '@/stores/trackState';
  import { getCurrentTrackItemList, isOfCanPlayType } from '@/utils/trackUtils';
  const props = defineProps({
    disable: {
      type: Boolean,
      default: false
    }
  });
  const store = usePlayerState();
  const trackStore = useTrackState();
  const playTime = computed(() => {
    return formatPlayerTime(store.playStartFrame);
  });
  const allTime = computed(() => {
    return formatPlayerTime(trackStore.frameCount);
  });
  let playTimer = ref();
  const timeStamp = 1000 / 30;
  // Pause video
  const pauseVideo = () => {
    if (props.disable) return;
    store.isPause = true;
    playTimer.value?.cancel();

    const trackItemList = getCurrentTrackItemList(trackStore.trackList, store.playStartFrame, isOfCanPlayType);
    trackItemList.forEach(item => {
      item?.pause();
    });
  };
  function startPlay() {
    if (props.disable) return;
    if (store.playStartFrame >= trackStore.frameCount) {
      store.playStartFrame = 0;
    }
    store.isPause = false;
    playTimer.value?.cancel();
    playTimer.value = preciseInterval(() => {
      store.playStartFrame++;
      if (store.playStartFrame === trackStore.frameCount) {
        pauseVideo();
      }
    }, timeStamp);
  }
  // Pause playback during certain operations
  watch(() => store.isPause, () => {
    if (store.isPause) {
      pauseVideo();
    }
  });
  watch(() => store.playStartFrame, () => {
    if (!store.isPause) {
      // Play audio, query current frame data
      const trackItemList = getCurrentTrackItemList(trackStore.trackList, store.playStartFrame, isOfCanPlayType);
      trackItemList.forEach(item => {
        item?.play(store.playStartFrame);
      });
    }
  });
</script>

<style scoped>

</style>
