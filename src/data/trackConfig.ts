export const TrackHeightMap = new Map([
    ['video', 'h-16'],
    ['audio', 'h-12'],
    ['text', 'h-6'],
    ['image', 'h-6'],
    ['effect', 'h-6'],
    ['filter', 'h-6'],
    ['transition', 'h-6']
]);

export const baseFps = 30;

/**
 * Frame unit time in milliseconds
 */
export const UnitFrame2ms = 1e3 / baseFps;
/**
 * Frame unit time in microseconds
 */
export const UnitFrame2μs = 1e6 / baseFps;

export const WaveOptions = {
    height: 28,
    width: '100%',
    splitChannels: false,
    normalize: true,
    waveColor: '#007bff',
    progressColor: '#dd5e98',
    cursorColor: '#ddd5e9',
    cursorWidth: 0,
    barWidth: 1,
    barGap: 1,
    barRadius: 1,
    barHeight: 0.6,
    barAlign: 'bottom',
    minPxPerSec: 1,
    fillParent: true,
    mediaControls: true,
    autoplay: false,
    interact: false,
    dragToSeek: false,
    hideScrollbar: false,
    audioRate: 0.1,
    autoScroll: true,
    autoCenter: true,
    sampleRate: 8000
} as const;
