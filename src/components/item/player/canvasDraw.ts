import { usePlayerState } from '@/stores/playerState';
import { useTrackState } from '@/stores/trackState';
import { watch, reactive, onMounted, toRaw } from 'vue';
import type { Ref } from 'vue';
export class CanvasPlayer {
    player: Ref<HTMLCanvasElement>; // Player
    playerContext: ImageBitmapRenderingContext | null = null;
    playerStore: Record<string, any>;
    trackState: Record<string, any>;
    containerSize: Record<string, any>;
    canvasSize = reactive({
        width: 0,
        height: 0
    });
    constructor(options: Record<string, any>) {
        this.player = options.player;
        this.containerSize = options.containerSize;

        onMounted(() => {
            this.playerContext = this.player.value.getContext('bitmaprenderer');
        });

        this.playerStore = usePlayerState();
        this.trackState = useTrackState();
        this.initWatch();
    }
    initWatch() {
        // Container size changes
        // watch([this.containerSize], () => {
        //     this.updateCanvasSize();
        // });
        // Re-render after property changes
        watch([() => this.trackState.trackList, () => this.canvasSize, () => this.playerStore.playStartFrame], () => this.drawCanvas(), { deep: true });
    }
    // getCanvasRect() {
    //     let { width, height } = this.containerSize;
    //     height -= 96; // Top and bottom function bars
    //     width -= 16; // Left and right function bars
    //     const { playerWidth, playerHeight } = this.playerStore;
    //     const scaleWidth = playerWidth !== 0 ? Math.floor(height / playerHeight * playerWidth) : width; // Width at equal height
    //     const scaleHeight = playerHeight !== 0 ? Math.floor(width / playerWidth * playerHeight) : height; // Height at equal width
    //     const canvasWidth = Math.min(scaleWidth, width);
    //     const canvasHeight = Math.min(scaleHeight, height);

    //     return { canvasWidth, canvasHeight };
    // }
    // Update size
    // updateCanvasSize() {
    //     /**
    //      * Want actual size to be normal phone size, 1920x1080, larger size
    //      * But when displaying on canvas, don't need such large size, will affect rendering performance
    //      * So canvas size still calculated based on actual display size, use 1920x1080 for final generation
    //      */
    //     const { canvasWidth, canvasHeight } = this.getCanvasRect();
    //     if (this.canvasSize.width !== canvasWidth || this.canvasSize.height !== canvasHeight) {
    //         this.canvasSize.width = canvasWidth;
    //         this.canvasSize.height = canvasHeight;
    //         // Set actual canvas size
    //         this.player.value.width = canvasWidth;
    //         this.player.value.height = canvasHeight;

    //         // Store canvas width and height in playerState
    //         this.playerStore.canvasOptions = { width: canvasWidth, height: canvasHeight };
    //     }
    // }
    // Draw
    async drawCanvas() {
        if (this.playerStore.ingLoadingCount !== 0) return;
        const offCanvas = new OffscreenCanvas(this.playerStore.playerWidth, this.playerStore.playerHeight);
        const ctx = offCanvas.getContext('2d');
        const videoList: Array<any> = [];
        this.trackState.trackList.forEach(({ list }) => {
            const trackItem = list.find((item: Record<string, any>) => {
                if (this.playerStore.playStartFrame >= item.start && this.playerStore.playStartFrame <= item.end && !['audio'].includes(item.type)) {
                    return true;
                }
                return false;
            });

            trackItem && videoList.unshift(() => this.drawToRenderCanvas(ctx, trackItem, this.playerStore.playStartFrame));
        });
        await videoList.reduce((chain, nextPromise) => chain.then(() => nextPromise()), Promise.resolve()); // Draw in sequence to ensure video is at bottom
        this.drawToPlayerCanvas(offCanvas);
    }
    // Pre-render canvas loads first
    drawToRenderCanvas(ctx: OffscreenCanvasRenderingContext2D, trackItem: Record<string, any>, frameIndex: number) {
        return toRaw(trackItem).draw(ctx, { width: this.playerStore.playerWidth, height: this.playerStore.playerHeight }, frameIndex)
            .then(() => {
                return true;
            });
    }
    // Render pre-rendered canvas to player
    async drawToPlayerCanvas(canvas: OffscreenCanvas) {
        if (this.playerContext) {
            this.playerContext.transferFromImageBitmap(canvas.transferToImageBitmap());
        }
    }
}
