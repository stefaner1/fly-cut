import { AudioTrack } from '@/class/AudioTrack';
import type { BaseTractItem } from '@/class/Base';
import { VideoTrack } from '@/class/VideoTrack';
import type { TrackLineItem } from '@/stores/trackState';

/**
 * Check if checkItem has frame overlap with current trackList
 * */
export function checkTrackItemOverlap(trackList: BaseTractItem[], checkItem: BaseTractItem) {
    const { start: insertStart, end: insertEnd } = checkItem;
    let overLapIndex = -1;
    let insertIndex = 0;
    const hasOverlap = trackList.filter(item => item.id !== checkItem.id).some((trackItem, index) => {
        const { start, end } = trackItem;
        /**
         * Determine overlap:
         * 1. Drop point inside node, overlap: start < insertStart < end || start < insertEnd < end
         * 2. Drop point outside node, but drop point on both sides, overlap: start >= insertStart && end <= insertEnd
         */
        if (
            (start < insertStart && insertStart < end) || (start < insertEnd && insertEnd < end) || (start >= insertStart && end <= insertEnd)
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

type TypeGuard<T> = (value: unknown) => value is T;

export function isOfCanPlayType(value: unknown): value is VideoTrack | AudioTrack {
    return value instanceof VideoTrack || value instanceof AudioTrack;
}

export const getCurrentTrackItemList = <T>(trackList: TrackLineItem[], currentFrame: number, isOfType: TypeGuard<T>): T[] => {
    const trackItems: T[] = [];
    trackList.forEach(({ list }) => {
        list.forEach(trackItem => {
            const { start, end } = trackItem;
            if (start <= currentFrame && end >= currentFrame && isOfType(trackItem)) {
                trackItems.push(trackItem);
            }
        });
    });
    return trackItems;
};
