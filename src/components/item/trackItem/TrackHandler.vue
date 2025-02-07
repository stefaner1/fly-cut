<template>
  <div
      class="absolute left-0 right-0 top-0 bottom-0 border z-20"
      :class="{ 'dark:border-gray-100 border-gray-600': isActive }"
      ref="el"
      v-show="isActive"
  >
    <div
        class="cursor-c-resize flex flex-col justify-center absolute bottom-0 -top-px -bottom-px -left-2 text-center rounded-tl rounded-bl w-2 dark:bg-gray-100 bg-gray-600 dark:text-gray-800 text-gray-100"
        ref="handlerLeft"
        @mousedown="mouseDownHandler($event, 'left')"
    >
      <span>|</span>
    </div>
    <div
        class="cursor-c-resize flex flex-col justify-center absolute bottom-0 -top-px -bottom-px -right-2 text-center rounded-tr rounded-br w-2 dark:bg-gray-100 bg-gray-600 dark:text-gray-800 text-gray-100"
        ref="handlerRight"
        @mousedown="mouseDownHandler($event, 'right')"
    >
      <span>|</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useTrackState } from '@/stores/trackState';
  import { usePlayerState } from '@/stores/playerState';
  import type { TrackItem } from '@/stores/trackState';
  import { computed, toRefs } from 'vue';
  import { getGridPixel } from '@/utils/canvasUtil';

  const props = defineProps({
    isActive: {
      type: Boolean,
      default: false
    },
    lineIndex: {
      type: Number,
      default: 0
    },
    itemIndex: {
      type: Number,
      default: 0
    }
  });
  const store = useTrackState();
  const playerStore = usePlayerState();
  const targetTrack = computed(() => {
    return store.trackList[props.lineIndex].list[props.itemIndex];
  });

  const el = ref();

  // Position data cache
  let positionLeft = 0;
  // Handler operation configuration
  let handlerData = {
    isVA: false,
    start: 0,
    end: 0,
    offsetR: 0,
    offsetL: 0,
    minStart: 0,
    maxStart: 0,
    minEnd: 0,
    maxEnd: 0
  };
  let enableMove = false;
  let otherCoords: { left: number, right: number, start: number, end: number }[] = [];

  // Get snap guide lines
  function getFixLine(x: number, distance = 10) {
    // otherCoords, cursor position
    // First get elements with left/right distance less than distance from drag element
    const result = [];
    otherCoords.forEach(coord => {
      if (Math.abs(coord.left - x) <= distance) {
        result.push({ position: coord.left, frame: coord.start });
      }
      if (Math.abs(coord.right - x) <= distance) {
        result.push({ position: coord.right, frame: coord.end });
      }
    });
    // Get elements with distance less than distance from cursor position
    const trackPlayPointX = getGridPixel(store.trackScale, playerStore.playStartFrame);
    if (Math.abs(trackPlayPointX - x) <= distance) {
      result.push({ position: trackPlayPointX, frame: playerStore.playStartFrame });
    }

    return result;
  }

  let fixPosition = { left: 0, right: 0 };

  // Set snapping
  function adsorption(x: number, lines: { position: number, frame: number }[]) {
    if (lines.length === 0) {
      fixPosition = { left: 0, right: 0, start: 0, end: 0 };
      return;
    }
    // Snapping is essentially moving the drag element position
    // Find closest line, calculate movement distance
    const minLeftLine = lines.reduce((r, item) => {
      return Math.abs(item.position - x) < Math.abs(r.position - x) ? item : r;
    }, { position: Number.MAX_SAFE_INTEGER, frame: 0 });

    // eslint-disable-next-line consistent-return
    return minLeftLine;
  }
  const frameWidth = computed(() => getGridPixel(store.trackScale, 1));
  function initLimits(lineData: TrackItem[], trackItem: TrackItem) {
    const beforeTrack = props.itemIndex > 0 ? lineData[props.itemIndex - 1] : null;
    const afterTrack = props.itemIndex < lineData.length ? lineData[props.itemIndex + 1] : null;
    const isVA = ['video', 'audio'].includes(trackItem.type);
    const limitData = {
      isVA,
      start: trackItem.start,
      end: trackItem.end,
      offsetR: trackItem.offsetR,
      offsetL: trackItem.offsetL,
      minStart: beforeTrack ? beforeTrack.end : 0, // Minimum adjustable start
      maxStart: trackItem.end - 1, // Keep at least one frame of data
      minEnd: trackItem.start + 1,
      maxEnd: afterTrack ? afterTrack.start : (30 * 60 * 60) // Maximum one hour
    };
    if (isVA) { // Video/audio end is limited by resource size
      const rightMaxWidth = (trackItem.frameCount - limitData.offsetL); // Maximum width on right
      const leftMaxWidth = (trackItem.frameCount - limitData.offsetR);// Maximum width on left
      limitData.maxEnd = afterTrack ? (Math.min(afterTrack.start, limitData.start + rightMaxWidth)) : Math.min(rightMaxWidth + limitData.start, (30 * 60 * 60));
      limitData.minStart = beforeTrack ? (Math.max(beforeTrack.end, limitData.end - leftMaxWidth)) : Math.max(limitData.end - leftMaxWidth, 0);
    }
    Object.assign(handlerData, {
      ...limitData
    });
  }
  function setTrackFrameData(frameCount: number, handleType: string) {
    const { isVA, start: originStart, end: originEnd, offsetR, offsetL, minStart, maxStart, minEnd, maxEnd } = handlerData;
    const originWidth = originEnd - originStart;
    const leftMaxWidth = offsetL + originWidth;
    const rightMaxWidth = offsetR + originWidth;
    if (handleType === 'left') { // Operating left handle
      let newStart = originStart + frameCount;
      if (newStart > maxStart) newStart = maxStart;
      if (newStart < minStart) newStart = minStart;
      let diffStart = newStart - originStart;
      if (isVA) { // Video/audio handle operation is limited to resource length, inward is considered as resource trimming, trimmed part is offset
        if (originEnd - newStart > leftMaxWidth) { // Video/audio has length limit, handle inward trims, outward expands but cannot exceed total length
          newStart = originEnd - leftMaxWidth;
          diffStart = newStart - originStart;
        }
        store.trackList[props.lineIndex].list[props.itemIndex].offsetL = Math.max(offsetL + diffStart, 0);
      } else { // Other resources have no limit
        store.trackList[props.lineIndex].list[props.itemIndex].frameCount = originEnd - newStart;
      }
      store.trackList[props.lineIndex].list[props.itemIndex].start = newStart;
    } else { // Right handle
      let newEnd = originEnd + frameCount;
      if (newEnd > maxEnd) newEnd = maxEnd;
      if (newEnd < minEnd) newEnd = minEnd;
      if (isVA) { // Video/audio handle operation is limited to resource length, inward is considered as resource trimming, trimmed part is offset
        if (newEnd - originStart > rightMaxWidth) { // Video/audio has length limit, handle inward trims, outward expands but cannot exceed total length
          newEnd = originStart + rightMaxWidth;
        }
        const diffEnd = newEnd - originEnd;
        store.trackList[props.lineIndex].list[props.itemIndex].offsetR = Math.max(offsetR - diffEnd, 0);
      } else { // Other resources have no limit
        store.trackList[props.lineIndex].list[props.itemIndex].frameCount = newEnd - originStart;
      }
      store.trackList[props.lineIndex].list[props.itemIndex].end = newEnd;
    }
  }

  function mouseDownHandler(event: MouseEvent, type: string) {
    event.preventDefault();
    event.stopPropagation();

    otherCoords = [];
    for (let i = 0; i < store.trackList.length; i++) {
      for (let j = 0; j < store.trackList[i].list.length; j++) {
        if (i !== props.lineIndex || j !== props.itemIndex) {
          const item = store.trackList[i].list[j];
          otherCoords.push({
            start: item.start,
            end: item.end,
            left: getGridPixel(store.trackScale, item.start),
            right: getGridPixel(store.trackScale, item.end)
          });
        }
      }
    }
    playerStore.isPause = true;
    const { pageX: startX } = event;
    positionLeft = startX;
    enableMove = true;
    initLimits(store.trackList[props.lineIndex]?.list || [], targetTrack.value);

    const start = targetTrack.value.start;
    const end = targetTrack.value.end;

    const trackItem = el.value.closest('.trackItem');
    const position = type === 'left' ? trackItem.offsetLeft : trackItem.offsetLeft + trackItem.offsetWidth;

    document.onmousemove = documentEvent => {
      if (!enableMove) return;
      const { pageX } = documentEvent;
      const moveWidth = positionLeft - pageX;
      // Show snap lines
      const lines = getFixLine(position - moveWidth);

      store.dragData.fixLines = [lines];

      const result = adsorption(position - moveWidth, lines);
      const frameCount = result?.frame ? (type === 'left' ? (result.frame - start) : (result.frame - end)) : -Math.round(moveWidth / frameWidth.value);
      setTrackFrameData(frameCount, type);
    };

    document.onmouseup = () => {
      enableMove = false;
      document.onmouseup = null;
      document.onmousemove = null;
    };
  }
</script>

<style scoped>

</style>
