import type { Track } from '@/class/Track';

/**
 * Check if checkItem has frame overlap with current trackList
 * */
export function checkTrackListOverlap(trackList: Track[], checkItem: Track, moveIndex = -1) {
    const { start: insertStart, end: insertEnd } = checkItem;
    let overLapIndex = -1;
    let insertIndex = 0;
    const hasOverlap = trackList.some((trackItem, index) => {
        if (moveIndex !== -1 && index === moveIndex) { // Ignore moving element in inline movement
            return false;
        }
        const { start, end } = trackItem;
        // Consider as overlap if current list element's start frame or end frame is inside the new element
        if (
            (start <= insertStart && end >= insertEnd) // New node's start and end positions are outside old node or equal at both ends
            || (start >= insertStart && start < insertEnd) // Old node's start position is inside new node
            || (end > insertStart && end <= insertEnd) // Old node's end position is inside new node
        ) {
            overLapIndex = index;
            return true;
        } else {
            if (end <= insertStart) {
                insertIndex = index + 1;
            }
            return false;
        }
    });
    return {
        hasOverlap,
        overLapIndex,
        insertIndex
    };
}
