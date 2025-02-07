import { ref, reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import { checkTrackListOverlap } from '@/utils/storeUtil';
import type { Track, TrackLineItem } from '@/class/Track';

export const useTrackState = defineStore('trackState', () => {
  const dragData = reactive({ // Drag data
    dataInfo: {} as Track,
    dragType: '',
    dragPoint: {
      x: 0,
      y: 0
    },
    // Snap assist lines
    fixLines: [] as { position: number, frame: number }[][],
    moveX: 0,
    moveY: 0
  });
  const moveTrackData = reactive({ // Inline movement
    lineIndex: -1,
    itemIndex: -1
  });
  // Track zoom ratio
  const trackScale = ref(parseInt(localStorage.trackS || '60'));
  const trackList = reactive<TrackLineItem[]>([]);

  // Selected element coordinates
  const selectTrackItem = reactive({
    line: -1,
    index: -1
  });
  // Selected element
  const selectResource = computed(() => {
    if (selectTrackItem.line === -1) {
      return null;
    }
    return trackList[selectTrackItem.line]?.list[selectTrackItem.index] || null;
  });
  // Delete element
  function removeTrack(lineIndex: number, itemIndex: number) {
    trackList[lineIndex].list.splice(itemIndex, 1);
    if (trackList[lineIndex].list.length === 0 && !trackList[lineIndex].main) {
      trackList.splice(lineIndex, 1);
    }
    if (trackList.length === 1 && trackList[0].list.length === 0) {
      trackList.splice(0, 1);
    }
  }
  // Reuse existing line
  // function insertExistingLine(item: TrackItem, insertLine: { line: number, index: number }) {
  //   trackList[insertLine.line].list.splice(insertLine.index, 0, item);
  //   selectTrackItem.line = insertLine.line;
  //   selectTrackItem.index = insertLine.index;
  // }
  // Insert new line
  // function insertNewLine(item: TrackItem) {
  //   const isVA = ['video', 'audio'].includes(item.type);
  //   trackList[isVA ? 'push' : 'unshift']({
  //     type: item.type,
  //     list: [item]
  //   });
  //   selectTrackItem.line = isVA ? trackList.length - 1 : 0;
  //   selectTrackItem.index = 0;
  // }
  // Move target line
  // function moveTargetLine(item: TrackItem, insertLine: { line: number, index: number }) {
  //   let { lineIndex: moveLineIndex = -1, itemIndex: moveIndex = -1 } = moveTrackData;
  //   // Set original data to undefined to avoid deletion during insertion
  //   trackList[moveLineIndex].list.splice(moveIndex, 1, undefined);
  //   // Set data in insertion line
  //   trackList[insertLine.line].list.splice(insertLine.index, 0, item);
  //   // Iterate to delete undefined
  //   trackList[moveLineIndex].list = trackList[moveLineIndex].list.filter(elem => elem);

  //   if (trackList[moveLineIndex].list.length === 0 && !trackList[moveLineIndex].main) {
  //     trackList.splice(moveLineIndex, 1);
  //   }
  // }
  // If target line unavailable, move to after/before target
  // function moveLine(item: TrackItem, targetLineIndex: number) {
  //   let { lineIndex: moveLineIndex = -1, itemIndex: moveIndex = -1 } = moveTrackData;
  //   trackList.splice(targetLineIndex, 0, {
  //     type: item.type,
  //     list: [item]
  //   });
  //   if (moveLineIndex !== -1 && moveIndex !== -1) { // Move to new line, delete old data
  //     if (targetLineIndex <= moveLineIndex) {
  //       moveLineIndex++; // If inserting before removed element, increment removal index
  //     }
  //     if (trackList[moveLineIndex].list.length === 1 && targetLineIndex > moveLineIndex) {
  //       targetLineIndex--; // If inserting before removed element, selected element column moves up
  //     }
  //     removeTrack(moveLineIndex, moveIndex, false);
  //   }
  //   selectTrackItem.line = targetLineIndex;
  //   selectTrackItem.index = 0;
  // }
  function selectTrackById(id: string) {
    trackList.forEach((item, index) => {
        item.list.forEach((trackItem, trackIndex) => {
          if (trackItem.id === id) {
            selectTrackItem.line = index;
            selectTrackItem.index = trackIndex;
          }
        });
    });
  }
  /**
   * Add segment logic:
   * Input: New segment
   * Check if track of same type exists and has no overlap, if exists then insert, if not then create new track
   * When no track exists, create new track and insert
   */
  function addTrack(newItem: Track) {
    const lines = trackList.filter(line => line.type === newItem.type);

    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];
      const { hasOverlap, insertIndex } = checkTrackListOverlap(line.list, newItem);
      if (!hasOverlap) {
        line.list.splice(insertIndex, 0, newItem);
        selectTrackItem.line = index;
        selectTrackItem.index = insertIndex;
        return;
      }
    }

    if (['audio'].includes(newItem.type)) {
      trackList.push({
        type: newItem.type,
        list: [newItem]
      });
      selectTrackItem.line = 0;
      selectTrackItem.index = 0;
    } else {
      trackList.unshift({
        type: newItem.type,
        list: [newItem]
      });
      selectTrackItem.line = trackList.length - 1;
      selectTrackItem.index = 0;
    }
  }

  const frameCount = computed(() => {
    return trackList.reduce((res, { list }) => {
      return Math.max(list.reduce((max, track) => Math.max(max, track.end), 0), res);
    }, 0);
  });

  // watchEffect(() => {
  //   localStorage.trackS = trackScale.value;
  // });
  // watchEffect(() => {
  //   localStorage.trackList = JSON.stringify(trackList);
  // });
  return {
    moveTrackData,
    selectTrackItem,
    selectResource,
    trackScale,
    trackList,
    addTrack,
    selectTrackById,
    removeTrack,
    frameCount,
    dragData
  };
});
