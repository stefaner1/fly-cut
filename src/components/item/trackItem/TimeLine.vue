<template>
  <div ref="canvasContainer" class="sticky top-0 left-0 right-0 h-5 text-center leading-5 text-sm z-20">
    <canvas
        :style="canvasStyle"
        v-bind="canvasAttr"
        ref="timeLine"
        @click="handleClick"
    />
  </div>
</template>

<script setup lang="ts">
  import { usePageState } from '@/stores/pageState';
  import { drawTimeLine, getSelectFrame } from '@/utils/canvasUtil';
  import type { UserConfig, CanvasConfig } from '@/utils/canvasUtil';
  import { ref, computed, onMounted, nextTick, watch, reactive, toRefs } from 'vue';
  const props = defineProps({
    start: { // Start coordinate
      type: Number,
      default: 0
    },
    step: { // Step increment, syncs with video fps
      type: Number,
      default: 30
    },
    scale: { // Timeline zoom ratio
      type: Number,
      default: 0
    },
    focusPosition: { // Highlight in timeline when element is selected
      type: Object,
      default() {
        return {
          start: 0, // Start frame number
          end: 0 // End frame number
        };
      }
    }
  });
  const emits = defineEmits({
    selectFrame(val: number) {
      return val !== null;
    }
  });
  /**
   * Initialize Canvas
   * */
  const canvasContainer = ref();
  const timeLine = ref();
  let canvasContext = {} as CanvasRenderingContext2D;
  const { isDark, hideSubMenu } = toRefs(usePageState());
  const canvasConfigs = computed(() => ({
    bgColor: isDark.value ? '#374151' : '#E5E7EB', // Background color
    ratio: window.devicePixelRatio || 1, // Device pixel ratio
    textSize: 12, // Font size
    textScale: 0.83, // Support smaller font: 10 / 12
    lineWidth: 1, // Line width
    // eslint-disable-next-line
    textBaseline: 'middle' as 'middle', // Text alignment baseline (textBaseLine is a union type in ts)
    // eslint-disable-next-line
    textAlign: 'center' as 'center', // Text alignment
    longColor: isDark.value ? '#E5E7EB' : '#374151', // Long segment color
    shortColor: isDark.value ? '#9CA3AF' : '#6B7280', // Short segment color
    textColor: isDark.value ? '#E5E7EB' : '#374151', // Text color
    subTextColor: isDark.value ? '#9CA3AF' : '#6B7280', // Small text color
    focusColor: isDark.value ? '#6D28D9' : '#C4B5FD' // Selected element interval
  }));
  const canvasAttr = reactive({
    width: 0,
    height: 0
  });
  const canvasStyle = computed(() => {
    return {
      width: `${canvasAttr.width / canvasConfigs.value.ratio}px`,
      height: `${canvasAttr.height / canvasConfigs.value.ratio}px`
    };
  });
  // Redraw lines
  function updateTimeLine() {
    drawTimeLine(canvasContext, { ...props } as UserConfig, { ...canvasAttr, ...canvasConfigs.value } as CanvasConfig);
  }
  // Set canvas context environment
  function setCanvasContext() {
    canvasContext = timeLine.value.getContext('2d');
    canvasContext.font = `${canvasConfigs.value.textSize * canvasConfigs.value.ratio}px -apple-system, ".SFNSText-Regular", "SF UI Text", "PingFang SC", "Hiragino Sans GB", "Helvetica Neue", "WenQuanYi Zen Hei", "Microsoft YaHei", Arial, sans-serif`;
    canvasContext.lineWidth = canvasConfigs.value.lineWidth;
    canvasContext.textBaseline = canvasConfigs.value.textBaseline;
    canvasContext.textAlign = canvasConfigs.value.textAlign;
  }
  // Set canvas size
  function setCanvasRect() {
    const { width, height } = canvasContainer.value.getBoundingClientRect();
    canvasAttr.width = width * canvasConfigs.value.ratio;
    canvasAttr.height = height * canvasConfigs.value.ratio;
    nextTick(() => {
      setCanvasContext();
      updateTimeLine();
    });
  }
  function handleClick(event: MouseEvent) {
    const offset = event.offsetX;
    const frameIndex = getSelectFrame(props.start + offset, props.scale, props.step);
    emits('selectFrame', frameIndex);
  }
  onMounted(() => {
    setCanvasRect();
  });
  watch(canvasConfigs, updateTimeLine);
  watch(props, updateTimeLine);
  watch(hideSubMenu, () => {
    setTimeout(() => {
      setCanvasRect();
    }, 300);
  }, {
    flush: 'post'
  });
  window.addEventListener('resize', setCanvasRect, false);
</script>
