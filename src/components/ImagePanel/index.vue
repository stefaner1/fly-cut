<template>
  <div class="p-4 flex-1 overflow-hidden flex flex-col">
    <div class="bg-zinc-200 h-10 flex items-center justify-center rounded text-sm text-gray-900 cursor-pointer" @click="onUpload">
      <i class="iconfont icon-shangchuan_line mr-2" />
      Local Image
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useTrackState } from '@/stores/trackState';
  import { usePlayerState } from '@/stores/playerState';
  import { ElMessage } from 'element-plus';
  import { imageDecoder } from '@/utils/webcodecs';
  import { selectFile } from '@/utils/file';
  import { getMD5 } from '@/class/Base';
  import type { ImageSource } from '@/class/ImageTrack';
  import { ImageTrack } from '@/class/ImageTrack';

  const trackStore = useTrackState();
  const playStore = usePlayerState();

  async function onUpload() {
    // Need to convert image file to ImageTrackItem
    // Required: image format, height, width, sourceFrame
    // Optional: cover info (if it's a gif image)
    const files = await selectFile({ accept: 'image/*', multiple: false });

    const id = await getMD5(await files[0].arrayBuffer());

    const frames = await imageDecoder.decode({ id, stream: files[0].stream(), type: files[0].type });

    if (!frames) {
      // Alert image parsing failed
      ElMessage.error('Image parsing failed');
      return;
    }

    // Get file related information
    const imageSource: ImageSource = {
      id,
      url: id,
      name: files[0].name,
      format: files[0].type,
      width: frames[0].codedWidth,
      height: frames[0].codedHeight
    };

    // Write file to filesystem
    // Write original file or decoded file?
    // write(id, files[0].stream());

    const imageTrack = new ImageTrack(imageSource, playStore.playStartFrame);

    imageTrack.resize({ width: playStore.playerWidth, height: playStore.playerHeight });

    // const url = await uploadFile(files[0]);
    trackStore.addTrack(imageTrack);
  }
</script>

<style scoped>

</style>
