import { uniqueId } from 'lodash-es';
import type { BaseTractItem, TrackType } from './Base';
import { imageDecoder } from '@/utils/webcodecs';
import { ImgClip, OffscreenSprite } from '@webav/av-cliper';
import { UnitFrame2μs } from '@/data/trackConfig';

export interface ImageSource {
  id: string,
  url: string,
  name: string,
  format: string,
  width: number,
  height: number
}
/**
 * File parsing cannot be placed in segments:
 * 1. File parsing is a time-consuming operation, needs to be parsed in advance and passed to segments
 * 2. Files can be network resources or local resources, need to be encapsulated in segment objects
 * 3. Different segments may share the same file, parse only once
 * 4. Segment information needs to be converted to text for storage (draft)
 */
export class ImageTrack implements BaseTractItem {
  id: string;
  type: TrackType = 'image';
  source: ImageSource;
  name: string;
  format: string;
  frameCount: number;
  start: number;
  end: any;
  centerX: number;
  centerY: number;
  scale: number;
  height: number;
  width: number;
  get drawHeight() {
    return this.height * this.scale / 100;
  }
  get drawWidth() {
    return this.width * this.scale / 100;
  }
  constructor(source: ImageSource, curFrame: number) {
    // Set ID
    this.id = uniqueId();
    // Set image information
    this.source = source;
    // Get file name
    this.name = source.name;
    // Get file type
    this.format = source.format;
    // Set track information
    this.frameCount = 30 * 60;
    this.start = curFrame;
    this.end = this.start + this.frameCount;

    // Set drawing information
    this.centerX = 0;
    this.centerY = 0;
    this.scale = 100;
    this.height = source.height;
    this.width = source.width;
  }
  getDrawX(width: number) {
    return width / 2 - this.drawWidth / 2 + this.centerX;
  }
  getDrawY(height: number) {
    return height / 2 - this.drawHeight / 2 + this.centerY;
  }
  draw(ctx: CanvasRenderingContext2D, { width, height }: { width: number, height: number }, frameIndex: number) {
    const frame = Math.max(frameIndex - this.start, 0); // Display first frame by default
    return imageDecoder.getFrame(this.source.format, this.source.id, frame).then(vf => {
        if (vf) {
          ctx.drawImage(vf, 0, 0, this.source.width, this.source.height, this.getDrawX(width), this.getDrawY(height), this.drawWidth, this.drawHeight);
        }
    });
  }
  resize({ width, height }: { width: number, height: number }) {
    // When adding video/image elements to canvas, scale them to fit appropriately to ensure content is fully visible
    let scale = 1;
    if (this.source.width > width) {
      scale = width / this.source.width;
    }
    if (this.source.height > height) {
      scale = Math.min(scale, height / this.source.height);
    }
    this.width = this.source.width * scale;
    this.height = this.source.height * scale;
  }
  // Generate composite object
  async combine(playerSize: { width: number, height: number }, outputRatio: number) {
    const frames = await imageDecoder.decode({ id: this.source.id });
    if (!frames) {
      throw new Error('frames is not ready');
    }
    const clip = new ImgClip(frames);
    const spr = new OffscreenSprite(clip);
    // TODO: Need to support cropping
    spr.time = { offset: this.start * UnitFrame2μs, duration: this.frameCount * UnitFrame2μs };
    spr.rect.x = this.getDrawX(playerSize.width) * outputRatio;
    spr.rect.y = this.getDrawY(playerSize.height) * outputRatio;
    spr.rect.w = this.drawWidth * outputRatio;
    spr.rect.h = this.drawHeight * outputRatio;

    return spr;
  }
}
