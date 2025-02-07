import { baseFps } from '@/data/trackConfig';

// Generate hexadecimal string of specified length
function getRandom(len: number) {
    return Math.floor((1 + Math.random()) * (16 ** len))
        .toString(16)
        .substring(1);
}
/**
 *  Time formatting
 * */
export function formatTime(time: number) {
    let second = Math.ceil(time / 1000);
    const s = second % 60;
    second = Math.floor(second / 60);
    const m = second % 60;
    second = Math.floor(second / 60);
    const h = second % 60;
    return {
        s,
        m,
        h,
        str: `${h === 0 ? '' : `${h < 10 ? '0' : ''}${h}:`}${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`
    };
}
export function formatPlayerTime(frameCount: number) {
    let f = Math.round(frameCount % 30);
    frameCount = Math.floor(frameCount / 30);
    let s = frameCount % 60;
    frameCount = Math.floor(frameCount / 60);
    let m = frameCount % 60;
    frameCount = Math.floor(frameCount / 60);
    let h = frameCount;
    return `${h < 10 ? '0' : ''}${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}:${f < 10 ? '0' : ''}${f}`;
}
/**
 *  Get random ID, components dragged to preview view will be assigned an ID
 * */
export function getId(prefix = 't') {
    return `${prefix ? `${prefix}-` : ''}${getRandom(5)}${getRandom(3)}-${getRandom(4)}`;
}
/**
 * Download file
 * */
export function downloadFileUrl(href: string, fileName: string) {
    const downloadElement = document.createElement('a');
    downloadElement.href = href;
    // File name after download
    downloadElement.download = fileName;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement);
    // Release blob object
    window.URL.revokeObjectURL(href);
    downloadElement.href = '';
}
/**
 * Calculate top-left vertex position based on center point
 */
export function calcLeftTopByCenter(center: { x: number, y: number }, width: number, height: number) {
    return {
        left: center.x - width / 2,
        top: center.y - height / 2
    };
}

// Get text width and height in canvas
// export function getTextRect({ text = 'Hello World', fontSize = 40 }) {
//     const canvas = document.createElement('canvas');
//     const ctx = canvas.getContext('2d');
//     if (ctx) {
//         ctx.font = `${fontSize}px -apple-system, ".SFNSText-Regular", "SF UI Text", "PingFang SC", "Hiragino Sans GB", "Helvetica Neue", "WenQuanYi Zen Hei", "Microsoft YaHei", Arial, sans-serif`;
//         const metrics = ctx.measureText(text);
//         return {
//             width: metrics.actualBoundingBoxRight + metrics.actualBoundingBoxLeft,
//             height: fontSize * 1.2
//         };
//     }
//     return null;
// }

export function getTextRect({ text = 'Hello World', fontSize = 40, fontFamily }: { text: string, fontSize: number, fontFamily: string }) {
    const padding = 4;
    const canvas = new OffscreenCanvas(1000, 1000);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
        throw new Error('Canvas 2D context is not supported');
    }

    const lines = text.split('\n');
    ctx.font = `${fontSize}px ${fontFamily}`;
    const lineHeight = fontSize * 1.2; // Adjust line height as needed

    // Measure the widest line
    const textWidth = Math.max(...lines.map(line => ctx.measureText(line).width));

    // Calculate total height
    const totalHeight = lines.length * lineHeight;

    return {
        width: textWidth + padding * 2,
        height: totalHeight + padding * 2,
        lineHeight,
        lines
    };
}

export function calcTrackItemAttr(trackItem: Record<string, any>, canvasSize: { width: number, height: number }, trackAttr: Record<string, any> = {}) {
    const { width: sourceWidth, height: sourceHeight, type, text = 'Default Text', fontSize = 40, style } = trackItem;
    const { width: playerW, height: playerH } = canvasSize;
    let defaultW = playerW;
    let defaultH = playerH;
    if (['image', 'video'].includes(type)) {
        const proportionalW = Math.floor(playerH / sourceHeight * sourceWidth); // Proportional width at equal height
        const proportionalH = Math.floor(playerW / sourceWidth * sourceHeight); // Proportional height at equal width
        // Default render position
        if (proportionalW > playerW) { // If width overflows in equal height scenario, use equal width with vertical padding
            defaultH = proportionalH;
        } else if (proportionalH > playerH) { // If height overflows in equal width scenario, use equal height with horizontal padding
            defaultW = proportionalW;
        }

        if (sourceHeight < defaultH && sourceWidth < defaultW) {
            defaultW = sourceWidth;
            defaultH = sourceHeight;
        }
    }

    if (type === 'text') {
        const rect = getTextRect({ text, fontSize });
        console.log('🚀 ~ calcTrackItemAttr ~ rect:', rect);
        if (rect) {
            defaultW = rect.width;
            defaultH = rect.height;
        }
    }
    return {
        width: defaultW,
        height: defaultH,
        centerX: 0,
        centerY: 0,
        scale: 100,
        drawWidth: defaultW,
        drawHeight: defaultH,
        text,
        fontSize,
        // color: style.fill,

        style
    };
}

export function computedItemShowArea(trackItem: Record<string, any>, canvasSize: { width: number, height: number }, trackAttr: Record<string, any>) {
    let { left = 0, top = 0, scale = 100, text, fontSize } = trackAttr;
    const { width, height, type } = trackItem;
    const { width: playerW, height: playerH } = canvasSize;
    let defaultW = playerW;
    let defaultH = playerH;
    if (type === 'video') {
        const proportionalW = Math.floor(playerH / height * width); // Proportional width at equal height
        const proportionalH = Math.floor(playerW / width * height); // Proportional height at equal width
        // Default render position
        if (proportionalW > playerW) { // If width overflows in equal height scenario, use equal width with vertical padding
            defaultH = proportionalH;
        } else if (proportionalH > playerH) { // If height overflows in equal width scenario, use equal height with horizontal padding
            defaultW = proportionalW;
        }
    }
    if (type === 'image') {
        defaultW = width;
        defaultH = width;
    }
    if (type === 'text') {
        defaultW = text.length * fontSize;
        defaultH = fontSize * 1.2;
    }
    // Calculate offset and scaled position from default position
    const scaleW = Math.floor(defaultW * scale / 100);
    const scaleH = Math.floor(defaultH * scale / 100);
    const scaleL = Math.floor(left + (defaultW - scaleW) / 2);
    const scaleT = Math.floor(top + (defaultH - scaleH) / 2);
    const diffW = Math.floor(playerW - scaleW);
    const diffH = Math.floor(playerH - scaleH);
    return {
        drawL: scaleL,
        drawT: scaleT,
        drawW: scaleW,
        drawH: scaleH,
        sourceWidth: width,
        sourceHeight: height,
        defaultW,
        defaultH,
        diffW,
        diffH
    };
}
export function isVideo(type: string) {
    return type === 'video';
}
// Wrap JSON parsing to avoid errors
export function getJsonParse(jsonStr: string): any {
    let res = '';
    try {
        res = JSON.parse(jsonStr);
    } catch (e) {
        console.log(e);
        res = '';
    }
    return res;
}

export const file2ArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = e => {
            resolve(e.target?.result as ArrayBuffer);
        };
        reader.readAsArrayBuffer(file);
    });
};

export const file2Unit8Stream = async(file: File): Promise<ReadableStream<Uint8Array>> => {
    const unit8Array = new Uint8Array(await file2ArrayBuffer(file));
    // Create an empty ReadableStream
    return new ReadableStream({
        start(controller) {
            // Push Uint8Array to ReadableStream using enqueue method
            controller.enqueue(unit8Array);

            // Close ReadableStream, indicating no more data will be pushed
            controller.close();
        }
    });
};
/**
 * Get current subtitle
 * @param asr 
 * @param frame 
 */
export const getCurSubtitle = (asr: { beginTime: number, endTime: number, text: string }[], frame: number) => {
    // Convert frame to current time
    const time = frame * 1000 / baseFps;
    // Return current subtitle when time is between beginTime and endTime
    for (let i = 0; i < asr.length; i++) {
        const { beginTime, endTime, text } = asr[i];
        if (time >= beginTime && time <= endTime) {
            return text;
        }
    }
    return '';
};

/**
 * Precise timer
 * @param callback 
 * @param interval 
 * @returns 
 */
export function preciseInterval(callback: () => void, interval: number) {
    let expected = performance.now() + interval;
    let stop = false;

    function step(timestamp: number) {
        if (stop) return;

        if (timestamp >= expected) {
            callback();
            // Accumulate expected time to maintain precise intervals
            expected += interval;
        }

        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);

    // Return an object containing cancel method
    return {
        cancel: () => {
            stop = true;
        }
    };
}

export async function createFileWriter(
    extName = 'mp4'
): Promise<FileSystemWritableFileStream> {
    const fileHandle = await window.showSaveFilePicker({
        suggestedName: `WebAV-export-${Date.now()}.${extName}`
    });
    return fileHandle.createWritable();
}
