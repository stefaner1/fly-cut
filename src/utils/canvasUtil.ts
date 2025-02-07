import { formatTime } from '@/utils/common';

export interface CanvasConfig {
    width: number,
    height: number,
    bgColor: string, // Background color
    ratio: number, // Device pixel ratio
    textSize: number, // Font size
    textScale: number, // Support smaller font size: 10 / 12
    lineWidth: number, // Line width
    textBaseline: string, // Text alignment baseline (textBaseLine is a union type in ts)
    textAlign: string, // Text alignment
    longColor: string, // Long line segment color
    shortColor: string, // Short line segment color
    textColor: string, // Text color
    subTextColor: string, // Small text color
    focusColor: string, // Selected element interval
    lineColor: string // Bottom line color
}
export interface UserConfig {
    start: number, // Start coordinate
    step: number, // Step, sync with video fps
    scale: number, // Timeline scale ratio
    focusPosition: { // Highlight when element is selected in timeline
        start: number, // Start frame number
        end: number, // End frame number
        frameCount: number // Total frame count
    }
}
// Width of each small grid in ruler (changes in real-time based on scale)
const getGridSize = (scale: number) : number => {
    const scaleNum = new Map([
        // Scale ratio: minimum unit is frame
        [100, 100],
        [90, 50],
        [80, 20],
        [70, 10],
        // Scale ratio: minimum unit is second
        [60, 80],
        [50, 40],
        [40, 20],
        [30, 10],
        // Scale ratio: minimum unit is 6 seconds, one large grid is 1 minute
        [20, 40],
        [10, 25],
        [0, 10]
    ]);
    return scaleNum.get(scale) || 100;
};
// Get unit cell pixels under current scale
export const getGridPixel = (scale: number, frameCount: number) => {
    let gridPixel = getGridSize(scale);
    let trackWidth = gridPixel * frameCount;
    if (scale < 70) { // 1 second per grid
        trackWidth = trackWidth / 30;
    }
    if (scale < 30) { // 6 seconds per grid
        trackWidth = trackWidth / 6;
    }
    return trackWidth;
};
// Adjust step based on zoom ratio
const getStep = (scale: number, frameStep: number) : number => {
    return scale > 60 ? frameStep : 10;
};
// Convert time format
export const getLongText = (count: number, scale: number) => {
    let time = count; // One large unit cell is 1 second
    if (scale < 30) { // One unit cell is 1 minute
        time *= 60;
    } else if (scale < 70) { // One large unit cell is 10 seconds
        time *= 10;
    }
    return formatTime(time * 1000).str;
};
const getShortText = (count: number, step: number, scale: number) => {
    const index = count % step;
    let text = '';
    if (scale < 70) { // One unit cell is 1 second
        return '';
    } else { // One unit cell is 1 frame
        text = scale > 80 ? (index === 0 ? '' : `${index < 10 ? '0' : ''}${index}f`) : '';
    }
    return text;
};
const lineWidth = 0.5; // Line width

// Get frame coordinates of selected point
export const getSelectFrame = (offsetX: number, scale: number, frameStep: number) => {
    const size = getGridSize(scale);
    if (scale < 70) { // One unit cell is 1 second
        offsetX *= frameStep;
    }
    if (scale < 30) { // One unit cell is 6 seconds
        offsetX *= 6;
    }
    return Math.round(offsetX / size);
};
/**
 * Draw timeline
 * */
export const drawTimeLine = (context: CanvasRenderingContext2D, userConfigs: UserConfig, canvasConfigs: CanvasConfig) => {
    const { start, scale, step: frameStep, focusPosition } = userConfigs;
    const { ratio, bgColor, width, height, textColor, subTextColor, textSize, textScale, focusColor, longColor, shortColor } = canvasConfigs;
    const step = getStep(scale, frameStep);

    // Initialize canvas
    context.scale(ratio, ratio);
    context.clearRect(0, 0, width, height);

    // 1. Timeline background color
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);

    // 2. Calculate grid
    const gridSizeS = getGridSize(scale); // Match small grid width under current zoom
    const gridSizeB = gridSizeS * step; // Calculate large grid width based on step

    const startValueS = Math.floor(start / gridSizeS) * gridSizeS; // Small grid drawing start scale (start rounded down to gridSizeS multiple)
    const startValueB = Math.floor(start / gridSizeB) * gridSizeB; // Large grid drawing start scale (start rounded down to gridSizeB multiple)

    const offsetXS = (startValueS - start); // Small grid start scale distance from origin (start) in px
    const offsetXB = (startValueB - start); // Large grid start scale distance from origin (start) in px
    const endValue = start + Math.ceil(width); // End scale (slightly beyond ruler width)

    // 3. Timeline focus element
    if (focusPosition) {
        let fStart = focusPosition.start;
        let fCount = focusPosition.end - focusPosition.start;
        if (scale < 70) { // One unit cell is 1 second
            fStart = fStart / 30;
            fCount = fCount / 30;
        }
        if (scale < 30) { // One unit cell is 6 seconds
            fStart = fStart / 6;
            fCount = fCount / 6;
        }
        const focusS = (fStart * gridSizeS + lineWidth - start); // Selected start coordinate
        const focusW = (fCount * gridSizeS - lineWidth); // Selected width
        if (focusW > gridSizeS) { // Don't show if smaller than one small grid
            context.fillStyle = focusColor;
            context.fillRect(focusS, 0, focusW, height * 3 / 8);
        }
    }

    // 4. Initialize scale and text brush
    context.beginPath(); // Remember to open/close path
    context.fillStyle = textColor;
    context.strokeStyle = longColor;

    /**
     * 5. Long intervals and text
     * Long and short intervals need to be drawn separately to achieve different colors;
     * Split into two for loops to save performance, as putting in one loop would redraw DOM operations each iteration
     */
    for (let value = startValueB, count = 0; value < endValue; value += gridSizeB, count++) {
        const x = offsetXB + count * gridSizeB + lineWidth; // prevent canvas 1px line blurry
        context.moveTo(x, 0);
        context.save();
        context.translate(x, height * 0.4);
        context.scale(textScale / ratio, textScale / ratio);
        const text = getLongText(value / gridSizeB, scale);
        const textPositionX = text.length * 5 * textScale * ratio; // Half of text length
        const textPositionY = ((textSize / ratio * textScale / ratio) / 2); // Half of text height
        context.fillText(text, textPositionX, textPositionY);
        context.restore();
        context.lineTo(x, height * 10 / 16 / ratio);
    }
    context.stroke();
    context.closePath();

    // 6. Short intervals and text - only show text at special zoom levels
    context.beginPath();
    context.fillStyle = subTextColor;
    context.strokeStyle = shortColor;
    for (let value = startValueS, count = 0; value < endValue; value += gridSizeS, count++) {
        const x = offsetXS + count * gridSizeS + lineWidth; // prevent canvas 1px line blurry
        context.moveTo(x, 0);
        const text = getShortText(value / gridSizeS, step, scale);
        if (text) {
            context.save();
            context.translate(x, height * 0.4);
            context.scale(textScale / ratio, textScale / ratio);
            const textPositionX = text.length * 5 * textScale * ratio; // Half of text length
            const textPositionY = ((textSize / ratio * textScale / ratio) / 2); // Half of text height
            context.fillText(text, textPositionX, textPositionY);
            context.restore();
        }
        if (value % gridSizeB !== 0) {
            context.lineTo(x, height / 3 / ratio);
        }
    }
    context.stroke();
    context.closePath();

    // Restore ctx matrix
    context.setTransform(1, 0, 0, 1, 0, 0);
};
