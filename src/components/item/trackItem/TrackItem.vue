<template>
  <div
      class="text-left text-sm top-0 absolute trackItem"
      :class="[TrackHeightMap.get(props.trackItem.type), isDragState ? 'z-50 isDrag' : 'z-10']"
      :style="[itemClass]"
      :data-type="props.trackItem.type"
      :data-line="lineIndex"
      :data-index="itemIndex"
      @click="setSelectTract"
  >
    <!-- Control handles -->
    <TrackHandler :isActive="isActive" :lineIndex="lineIndex" :itemIndex="itemIndex" />
    <!-- Container -->
    <component
        :is="componentMap.get(trackItem.type)"
        :trackItem="trackItem"
    />
  </div>
</template>

<script setup lang="ts">
  import TrackHandler from '@/components/item/trackItem/TrackHandler.vue';
  import VideoItem from '@/components/item/trackItem/template/VideoItem.vue';
  import AudioItem from '@/components/item/trackItem/template/AudioItem.vue';
  import TextItem from '@/components/item/trackItem/template/TextItem.vue';
  import ImageItem from '@/components/item/trackItem/template/ImageItem.vue';
  import EffectItem from '@/components/item/trackItem/template/EffectItem.vue';
  import TransitionItem from '@/components/item/trackItem/template/TransitionItem.vue';
  import FilterItem from '@/components/item/trackItem/template/FilterItem.vue';
  import { TrackHeightMap } from '@/data/trackConfig';
  import { useTrackState } from '@/stores/trackState';
  import { computed } from 'vue';
  const props = defineProps({
    trackType: {
      type: String,
      default: ''
    },
    lineIndex: {
      type: Number,
      default: 0
    },
    itemIndex: {
      type: Number,
      default: 0
    },
    trackItem: {
      type: Object,
      default() {
        return {
          width: '0px',
          left: '0px'
        };
      }
    }
  });
  const store = useTrackState();
  const isActive = computed(() => {
    return store.selectTrackItem.line === props.lineIndex && store.selectTrackItem.index === props.itemIndex;
  });
  const componentMap = new Map<string, any>([
    ['video', VideoItem],
    ['audio', AudioItem],
    ['text', TextItem],
    ['image', ImageItem],
    ['effect', EffectItem],
    ['transition', TransitionItem],
    ['filter', FilterItem]
  ]);
  const isDragState = computed(() => {
    return store.moveTrackData.lineIndex === props.lineIndex && store.moveTrackData.itemIndex === props.itemIndex;
  });
  function setSelectTract(event:Event) {
    event.preventDefault();
    event.stopPropagation();
    store.selectTrackItem.line = props.lineIndex;
    store.selectTrackItem.index = props.itemIndex;
  }

  const itemClass = computed(() => {
    if (isDragState.value) {
      return {
        width: props.trackItem.showWidth,
        left: `${parseInt(props.trackItem.showLeft) + store.dragData.moveX}px`,
        top: `${store.dragData.moveY}px`
      };
    }
    return {
      width: props.trackItem.showWidth,
      left: props.trackItem.showLeft
    };
  });
</script>
