<template>
  <div class="p-4 flex-1 overflow-hidden flex flex-col">
    <div class="bg-zinc-200 h-10 flex items-center justify-center rounded text-sm text-gray-900 cursor-pointer" @click="onUpload">
      <i class="iconfont icon-shangchuan_line mr-2" />
      Local Video
    </div>
  </div>
</template>

<script setup lang="ts">
  import { usePlayerState } from '@/stores/playerState';
  import { useTrackState } from '@/stores/trackState';
  import { videoDecoder } from '@/utils/webcodecs';
  import { ElMessage } from 'element-plus';
  import { selectFile } from '@/utils/file';
  import { getMD5 } from '@/class/Base';
  import { VideoTrack } from '@/class/VideoTrack';

  const trackStore = useTrackState();
  const playStore = usePlayerState();

  async function onUpload() {
    // Need to convert image file to ImageTrackItem
    // Required: image format, height, width, sourceFrame
    // Optional: cover info (if it's a gif image)
    const files = await selectFile({ accept: '.mp4', multiple: false });
    const start = performance.now();
    // TODO: MD5 generation time is already greater than video parsing time, needs optimization
    const id = await getMD5(await files[0].arrayBuffer());

    console.log('MD5 generation time:', performance.now() - start, 'ms');

    const clip = await videoDecoder.decode({ id, stream: files[0].stream(), type: files[0].type });

    console.log('Video parsing time:', performance.now() - start, 'ms');

    if (!clip) {
      // Alert video parsing failed
      ElMessage.error('Video parsing failed');
      return;
    }

    const videoTrack = new VideoTrack({
      id,
      url: URL.createObjectURL(files[0]),
      name: files[0].name,
      format: files[0].type,
      width: clip.meta.width,
      height: clip.meta.height,
      duration: Math.round(clip.meta.duration / 1e6)
    }, playStore.playStartFrame);

    videoTrack.resize({ width: playStore.playerWidth, height: playStore.playerHeight });

    trackStore.addTrack(videoTrack);
  }
</script>

<style scoped>

</style>
