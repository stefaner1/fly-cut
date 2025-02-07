import { reactive, watchEffect, computed } from 'vue';
import { defineStore } from 'pinia';
import { calcTrackItemAttr, computedItemShowArea, getJsonParse, getTextRect } from '@/utils/common';
import { useTrackState, type TrackItem } from './trackState';
import { usePlayerState } from './playerState';
import { get, set } from 'lodash-es';

interface LayerAttr {
    // Top-left vertex coordinates
    left: number;
    top: number;
    // Width and height drawn on canvas
    width: number;
    height: number;
    // Origin coordinates
    origin: {
        left: number;
        top: number;
    }
}

export const useTrackAttrState = defineStore('trackAttrState', () => {
    const trackState = useTrackState();

    const playerState = usePlayerState();

    const trackAttrMap = reactive(localStorage.trackAttr ? getJsonParse(localStorage.trackAttr) : {});

    function initTrackAttr(trackItem: TrackItem) {
        // Draw layer during initialization
        if (!trackAttrMap[trackItem.id]) {
            trackAttrMap[trackItem.id] = {};
            const data = calcTrackItemAttr(trackItem, playerState.canvasOptions, trackAttrMap[trackItem.id]);
            for (let key in data) {
                trackAttrMap[trackItem.id][key] = data[key];
            }
        }
    }

    function setTrackAttr(id: string, data: Record<string, any>) {
        if (!trackAttrMap[id]) {
            trackAttrMap[id] = {};
        }
        for (let key in data) {
            set(trackAttrMap[id], key, data[key]);
        }
        // Recalculate attributes when certain properties change
        if ('fontSize' in data || 'text' in data) {
            console.log('Triggering attribute recalculation');
            const rect = getTextRect({ text: trackAttrMap[id].text, fontSize: trackAttrMap[id].fontSize });
            if (rect) {
                console.log('rect', rect);
                trackAttrMap[id].width = rect.width;
                trackAttrMap[id].height = rect.height;
            }
        }
    }

    function deleteTrack(id: string) {
        if (trackAttrMap[id]) {
            delete trackAttrMap[id];
        }
    }
    watchEffect(() => {
        localStorage.trackAttr = JSON.stringify(trackAttrMap);
    });

    const layerAttrMap = computed(() => {
        const { width, height } = playerState.canvasOptions;
        const layerMap: Record<string, LayerAttr> = {};
        for (let id in trackAttrMap) {
            const { centerX, centerY, width: sourceWidth, height: sourceHeight, scale } = trackAttrMap[id];
            const drawWidth = Math.round(sourceWidth * scale / 100);
            const drawHeight = Math.round(sourceHeight * scale / 100);
            layerMap[id] = {
                left: centerX + width / 2 - drawWidth / 2,
                top: -1 * centerY + height / 2 - drawHeight / 2,
                width: drawWidth,
                height: drawHeight,
                origin: { left: (width - sourceWidth) / 2, top: (height - sourceHeight) / 2 }
            };
        }
        return layerMap;
    });

    // Monitor canvas changes, update all layers when canvas changes
    return {
        trackAttrMap,
        initTrackAttr,
        setTrackAttr,
        deleteTrack,
        layerAttrMap
    };
});
