<template>
  <div class="p-4 flex-1 overflow-hidden flex flex-col">
    <div class="bg-zinc-200 h-10 flex items-center justify-center rounded text-sm text-gray-900 cursor-pointer" @click="onUpload">
      <i class="iconfont icon-shangchuan_line mr-2" />
      Local Audio
    </div>
  </div>
</template>

<script setup lang="ts">
  import { usePlayerState } from '@/stores/playerState';
  import { useTrackState } from '@/stores/trackState';
  import { AudioClip } from '@webav/av-cliper';
  import { ElMessage } from 'element-plus';
  import { selectFile } from '@/utils/file';
  import { getMD5 } from '@/class/Base';
  import { AudioTrack } from '@/class/AudioTrack';
  import { audioDecoder } from '@/utils/webcodecs';

  const selectedMenu = ref('recommend');
  function onSelect(selected: { value: string }) {
    selectedMenu.value = selected.value;
  }

  const trackStore = useTrackState();
  const playStore = usePlayerState();

  async function onUpload() {
    /**
     * TODO: To be optimized, some tasks can be concurrent
     */
    const files = await selectFile({ accept: 'audio/*', multiple: false });

    const id = await getMD5(await files[0].arrayBuffer());

    const clip = await audioDecoder.decode({ id, stream: files[0].stream(), type: files[0].type });

    if (!clip) {
      // Alert audio parsing failed
      ElMessage.error('Audio parsing failed');
      return;
    }

    const audioTrack = new AudioTrack({
      id,
      url: URL.createObjectURL(files[0]),
      name: files[0].name,
      format: files[0].type,
      duration: Math.round(clip.meta.duration / 1e6)
    }, playStore.playStartFrame);

    trackStore.addTrack(audioTrack);
  }
</script>

<style scoped>

</style>
