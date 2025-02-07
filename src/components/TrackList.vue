<template>
  <div class="trackList flex flex-1 flex-row w-full overflow-x-hidden overflow-y-auto relative">
    <TrackListIcon :listData="showTrackList" :offsetTop="startY" />
    <div
        class="flex-1 overflow-x-scroll overflow-y-auto flex-col shrink-0 grow relative"
        ref="trackList"
        @scroll="handleScroll"
        @wheel="handleWheel"
        @click="setSelectTract($event, -1, -1)"
    >
      <TimeLine
        :start="startX"
        :scale="trackScale"
        :step="defaultFps"
        :focusPosition="store.selectResource"
        @selectFrame="handlerSelectFrame"
      />
      <div
        class="absolute top-5 flex shrink-0 grow min-w-full"
        :style="{ 'min-height': 'calc(100% - 20px)' }"
        ref="trackListContainer"
        @mousedown="onMouseDown"
        @mousemove="onMouseMove"
        @mouseup="onMouseUp"
        @mouseleave="onMouseUp"
      >
        <template v-if="showTrackList.length === 0">
          <div class="flex justify-center items-center h-24 m-auto w-2/3 dark:bg-gray-500 bg-gray-200  rounded-md text-sm border-dashed border-2 dark:border-gray-500 border-gray-200 hover:dark:border-blue-300 hover:border-blue-400">
            <VideoIcon class="text-xl mr-4" />
            Drag and drop materials here to start editing your masterpiece~
          </div>
        </template>
        <div
            v-else
            class="z-10 pt-5 pb-5 min-w-full flex shrink-0 grow flex-col justify-center min-h-full"
            :style="{ width: `${trackStyle.width}px` }"
            id="track-container"
        >
          <template v-for="(lineData, lineIndex) of showTrackList" :key="lineData.list.reduce((r, item) => r + item.id, 'line')">
            <TrackLine
              :style="{
                'margin-left': `${offsetLine.left}px`
              }"
              :class="[dropLineIndex === lineIndex ? (insertBefore ? 'showLine-t' : 'showLine-b') : '']"
              :lineType="lineData.type"
              :isActive="store.selectTrackItem.line === lineIndex"
              :lineIndex="lineIndex"
              :isMain="lineData.main"
              :lineData="lineData.list"
            />
          </template>
        </div>
        <TrackPlayPoint v-show="showTrackList.length !== 0" />
        <template v-if="showTrackList.length !== 0">
          <div
              v-for="line in store.dragData.fixLines.reduce((r, item) => r.concat(item), [])"
              :key="line"
              class="z-30 w-px absolute -top-5 bottom-0 bg-yellow-300 dark:bg-yellow-300 pointer-events-none"
              :style="{ left: `${line.position + 10}px` }"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import VideoIcon from '@/components/icons/VideoIcon.vue';
  import TimeLine from '@/components/item/trackItem/TimeLine.vue';
  import TrackLine from '@/components/item/trackItem/TrackLine.vue';
  import TrackListIcon from '@/components/item/trackItem/TrackListIcon.vue';
  import TrackPlayPoint from '@/components/item/trackItem/TrackPlayPoint.vue';
  import { getGridPixel, getSelectFrame } from '@/utils/canvasUtil';
  import { ref, computed } from 'vue';
  import { useTrackState } from '@/stores/trackState';
  import { usePlayerState } from '@/stores/playerState';
  import { debounce, throttle } from 'lodash-es';
  import { formatTime, isVideo, getJsonParse } from '@/utils/common';
  import type { VideoSource } from '@/class/VideoTrack';
  const store = useTrackState();
  const playerStore = usePlayerState();
  const trackList = ref();
  const trackListContainer = ref();
  const offsetLine = {
    left: 10, // Container margin, for displaying drag handle
    right: 200
  };
  const startX = ref(0 - offsetLine.left); // Align with container padding
  const startY = ref(0); // Align with left icons
  const trackScale = computed(() => store.trackScale);
  const trackStyle = computed(() => {
    return {
      width: getGridPixel(trackScale.value, store.frameCount) + offsetLine.right
    };
  });
  const defaultFps = ref(30); // Frame rate
  const dropLineIndex = ref(-1); // Target line
  const dropItemLeft = ref(0); // Target left value
  const insertBefore = ref(true); // Insert before or after
  const isVaDragElement = computed(() => {
    return ['video', 'audio'].includes(store.dragData.dragType);
  }); // Whether it's a video/audio node
  const dragPoint = computed(() => store.dragData.dragPoint);
  let mainIndex = ref(0); // Main line index

  const showTrackList = computed(() => {
    return store.trackList.map((line, lineIndex) => {
      line.main && (mainIndex.value = lineIndex);
      const newList = line.list.map(item => {
        const { duration: time } = item.source as VideoSource;
        return {
          ...item,
          showWidth: `${getGridPixel(trackScale.value, item.end - item.start)}px`,
          showLeft: `${getGridPixel(trackScale.value, item.start)}px`,
          time: isVideo(line.type) ? `${formatTime(time || 0).str}` : ''
        };
      });
      return {
        ...line,
        list: newList
      };
    });
  });
  function setSelectTract(event:Event, line: number, index: number) {
    event.preventDefault();
    event.stopPropagation();
    store.selectTrackItem.line = line;
    store.selectTrackItem.index = index;
  }
  function handlerSelectFrame(frame: number) {
    const playFrame = frame - 1;
    const startFrane = playFrame < 0 ? 0 : playFrame > store.frameCount ? store.frameCount : playFrame;
    playerStore.isPause = true;
    playerStore.playStartFrame = startFrane;
  }
  let maxDelta = 0;

  const setScale = debounce(() => {
    store.trackScale -= maxDelta > 0 ? 10 : -10;
    maxDelta = 0;
  }, 100);

  const handleWheel = (event: WheelEvent) => {
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      maxDelta || (maxDelta = event.deltaY);
      setScale();
    }
  };
  function handleScroll() {
    const { scrollLeft, scrollTop } = trackList.value;
    startX.value = scrollLeft - offsetLine.left;
    startY.value = scrollTop;
  }
  function setDropLineLeft(event: DragEvent) {
    const trackListElement = trackListContainer.value as HTMLDivElement;
    const { left } = trackListElement.getBoundingClientRect();
    const { clientX } = event;
    const { x: offsetX } = dragPoint.value;
    const itemLeft = clientX - left - offsetX;
    dropItemLeft.value = itemLeft < 0 ? 0 : itemLeft;
  }

  let curCoord = { left: 0, right: 0, start: 0, end: 0 };

  let otherCoords: { left: number, right: number, start: number, end: number }[] = [];

  let dragElement: HTMLElement;

  function getPreciseOffset(element: HTMLElement) {
    const specifiedParent = document.getElementById('track-container') as HTMLElement;
    const elementRect = element.getBoundingClientRect();
    const parentRect = specifiedParent!.getBoundingClientRect();
    console.log(elementRect.left, parentRect.left);
    return {
      left: elementRect.left - (parentRect.left + 10),
      right: elementRect.right - (parentRect.left + 10)
    };
  }

  function getComputedPosition(element: HTMLElement) {
    const style = window.getComputedStyle(element);
    return {
      left: parseInt(style.left),
      right: parseInt(style.left) + parseInt(style.width)
    };
  }

  function onMouseDown(event: MouseEvent) {
    // Get drag element
    dragElement = (event.target as HTMLElement).closest('.trackItem') as HTMLElement;
    if (!dragElement) {
      return;
    }

    store.dragData.moveX = 0;
    store.dragData.moveY = 0;

    const lineIndex = Number(dragElement.dataset.line);
    const index = Number(dragElement.dataset.index);
    // Get current mouse position
    store.dragData.dragPoint.x = event.pageX;
    store.dragData.dragPoint.y = event.pageY;
    // Set drag information
    store.dragData.dataInfo = store.trackList[lineIndex].list[index];
    store.dragData.dragType = dragElement.dataset.type;
    // Set moving track information
    store.moveTrackData.lineIndex = lineIndex;
    store.moveTrackData.itemIndex = index;
    // Reset current selected track
    store.selectTrackItem.line = -1;
    store.selectTrackItem.index = 0;
    const dragItem = store.trackList[lineIndex].list[index];
    curCoord = {
      start: dragItem.start,
      end: dragItem.end,
      left: getGridPixel(store.trackScale, dragItem.start),
      right: getGridPixel(store.trackScale, dragItem.end)
    };
    // Get left/right values of trackItem elements not at current position
    otherCoords = [];
    for (let i = 0; i < store.trackList.length; i++) {
      for (let j = 0; j < store.trackList[i].list.length; j++) {
        if (i !== lineIndex || j !== index) {
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
  }

  function isOverlap(dragItem, line, { start, end }: { start: number, end: number }) {
    if (dragItem.type !== line.type) {
      return { overlap: true, index: 0 };
    }
    // Insert position is in trackLine
    const nodes = line.list.filter(item => item.id !== dragItem.id);
    if (nodes.length === 0) {
      return { overlap: false, index: 0 };
    }
    // Handle boundary cases
    if (nodes[0].start >= end) {
      return { overlap: false, index: 0 };
    }
    if (nodes[nodes.length - 1].end <= start) {
      return { overlap: false, index: nodes.length };
    }
    for (let i = 0; i < nodes.length - 1; i++) {
      const node = nodes[i];
      const preNode = nodes[i + 1];
      if (start >= node.end && end <= preNode.right) {
        return { overlap: false, index: i + 1 };
      }
    }
    // When overlapping, create new line, so insert position is 0
    return { overlap: true, index: 0 };
  }

  interface InsertInfo {
    insertIndex: number;
    itemIndex: number;
    left: number;
    right: number;
    isNewLine: boolean;
  }

  function getInsertLineInfo() : { isNewLine: boolean, insertIndex: number, elem?: HTMLElement } {
    const center = dragElement.offsetTop + dragElement.offsetHeight / 2 + dragElement.offsetParent.offsetTop;

    const elems = Array.from(document.querySelectorAll('.trackLine')) as HTMLElement[];

    // Handle boundary cases
    // 1. center is before first element
    if (elems[0].offsetTop > center) {
      return { isNewLine: true, insertIndex: 0 };
    }

    for (let i = 0; i < elems.length; i++) {
      const elem = elems[i];
      // center is within an element
      if (elem.offsetTop <= center && (elem.offsetTop + elem.offsetHeight) >= center) {
        return { isNewLine: false, insertIndex: i, elem };
      }
      if (i + 1 !== elems.length) {
        const elemNext = elems[i + 1];
        // center is between two elements
        if ((elem.offsetTop + elem.offsetHeight) <= center && elemNext.offsetTop >= center) {
          return { isNewLine: true, insertIndex: i + 1 };
        }
      }
    }
    // 2. center is after last element
    return { isNewLine: true, insertIndex: elems.length };
  }

  let fixPosition = { left: 0, right: 0 };

  // Get insert information
  // insertIndex: insert position, isNewLine: whether to insert new line, left/right: insert position values, line position, itemIndex
  function getInsertInfo(): InsertInfo {
    let { isNewLine, insertIndex, elem } = getInsertLineInfo();

    const style = getComputedPosition(dragElement);
    
    const left = fixPosition.left || style.left;
    const right = fixPosition.right || style.right;

    const start = fixPosition.start || getSelectFrame(left, store.trackScale, 30);
    const end = fixPosition.end || getSelectFrame(right, store.trackScale, 30);

    if (!elem) {
      return { insertIndex, itemIndex: 0, left, right, isNewLine, start, end };
    }

    const dragItem = store.dragData.dataInfo;
    const line = store.trackList[insertIndex];

    const { overlap, index: itemIndex } = isOverlap(dragItem, line, { start, end });
    // If overlapping, determine whether to insert before or after current line based on position
    if (overlap) {
      isNewLine = true;
      // Get element center point
      const center = elem.offsetLeft + elem.offsetWidth / 2;
      if (center < dragElement.offsetTop + dragElement.offsetParent.offsetTop + dragElement.offsetHeight / 2) {
        insertIndex -= 1;
      }
    }
    return { insertIndex, itemIndex, left, right, isNewLine, start, end };
  }

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

  // Set snapping
  function adsorption({ left, right }: { left: number, right: number }, lines: { position: number, frame: number }[][]) {
    fixPosition = { left: 0, right: 0, start: 0, end: 0 };
    if (lines[0].length === 0 && lines[1].length === 0) {
      return;
    }
    // Snapping is essentially moving the drag element position
    // Find closest line, calculate movement distance
    const minLeftLine = lines[0].reduce((r, item) => {
      return Math.abs(item.position - left) < Math.abs(r.position - left) ? item : r;
    }, { position: Number.MAX_SAFE_INTEGER, frame: 0 });

    const minRightLine = lines[1].reduce((r, item) => {
      return Math.abs(item.position - right) < Math.abs(r.position - right) ? item : r;
    }, { position: Number.MAX_SAFE_INTEGER, frame: 0 });

    if (Math.abs(minLeftLine.position - left) < Math.abs(minRightLine.position - right)) {
      // Left align
      fixPosition.left = minLeftLine.position;
      fixPosition.start = minLeftLine.frame;
      store.dragData.moveX = minLeftLine.position - curCoord.left;
    } else {
      // Right align
      fixPosition.right = minRightLine.position;
      fixPosition.end = minRightLine.frame;
      store.dragData.moveX = minRightLine.position - curCoord.right;
    }
  }

  function onMouseMove(event: MouseEvent) {
    if (dragElement) {
      store.dragData.moveX = event.pageX - store.dragData.dragPoint.x;
      store.dragData.moveY = event.pageY - store.dragData.dragPoint.y;

      const left = store.dragData.moveX + curCoord.left;
      const right = store.dragData.moveX + curCoord.right;

      store.dragData.fixLines = [getFixLine(left), getFixLine(right)];

      // Set snapping
      adsorption({ left, right }, store.dragData.fixLines);
    }
  }

  function insert(insertInfo: InsertInfo) {
    let dragInfo = store.dragData.dataInfo;
    const startFrame = Math.max(fixPosition.right !== 0 ? getSelectFrame(insertInfo.right, store.trackScale, 30) - (dragInfo.end - dragInfo.start) : getSelectFrame(insertInfo.left, store.trackScale, 30), 0);
    // Move element to new position
    dragInfo.end = startFrame + (dragInfo.end - dragInfo.start);
    dragInfo.start = startFrame;
    const newTrackItem = dragInfo;
    // First set original trackItem to null by id
    let deleteLineIndex = 0;
    let deleteItemIndex = 0;
    store.trackList.forEach((lineItem, lineIndex) => {
      lineItem.list.forEach((item, itemIndex) => {
        if (item.id === dragInfo.id) {
          deleteLineIndex = lineIndex;
          deleteItemIndex = itemIndex;
        }
      });
    });
    store.trackList[deleteLineIndex].list.splice(deleteItemIndex, 1);
    if (insertInfo.isNewLine) {
      // Insert new line
      store.trackList.splice(insertInfo.insertIndex, 0, { type: newTrackItem.type, list: [newTrackItem] });
    } else {
      // Insert into current line
      store.trackList[insertInfo.insertIndex].list.splice(insertInfo.itemIndex, 0, newTrackItem);
    }
    // Delete empty lists from store.trackList
    const deleteIndex = store.trackList.findIndex(lineItem => lineItem.list.length === 0);
    if (deleteIndex !== -1) {
      store.trackList.splice(deleteIndex, 1);
    }
  }

  function onMouseUp(event: MouseEvent) {
    if (dragElement) {
      store.dragData.moveX = event.pageX - store.dragData.dragPoint.x;
      store.dragData.moveY = event.pageY - store.dragData.dragPoint.y;

      const left = store.dragData.moveX + curCoord.left;
      const right = store.dragData.moveX + curCoord.right;

      store.dragData.fixLines = [getFixLine(left), getFixLine(right)];

      // Set snapping
      adsorption({ left, right }, store.dragData.fixLines);

      const info = getInsertInfo(event.currentTarget as HTMLElement);
      insert(info);
      dragElement = null;
    }
    store.dragData.fixLines = [];
    // Reset moving track information
    store.moveTrackData.lineIndex = -1;
    store.moveTrackData.itemIndex = -1;
    store.dragData.moveX = 0;
    store.dragData.moveY = 0;
  }
</script>
