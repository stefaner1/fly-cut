import { uniqueId } from 'lodash-es';
import type { BaseTractItem, TrackType } from './Base';
import { videoDecoder, splitClip } from '@/utils/webcodecs';
import { OffscreenSprite } from '@webav/av-cliper';
import { UnitFrame2μs } from '@/data/trackConfig';

export interface VideoSource {
  id: string,
  url: string,
  name: string,
  format: string,
  duration: number,
  width: number,
  height: number
}

export class VideoTrack implements BaseTractItem {
  id: string;
  type: TrackType = 'video';
  source: VideoSource;
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
  offsetL: number;
  offsetR: number;
  get drawHeight() {
    return this.height * this.scale / 100;
  }
  get drawWidth() {
    return this.width * this.scale / 100;
  }
  constructor(source: VideoSource, curFrame: number) {
    // Set ID
    this.id = uniqueId();
    // Set video information
    this.source = source;
    // Get file name
    this.name = source.name;
    // Get file type
    this.format = source.format;
    // Set track information
    this.frameCount = source.duration * 30;
    this.start = curFrame;
    this.end = this.start + this.frameCount;

    // Set drawing information
    this.centerX = 0;
    this.centerY = 0;
    this.scale = 100;
    this.height = source.height;
    this.width = source.width;

    // Set cropping information
    this.offsetL = 0;
    this.offsetR = 0;
  }
  getDrawX(width: number) {
    return width / 2 - this.drawWidth / 2 + this.centerX;
  }
  getDrawY(height: number) {
    return height / 2 - this.drawHeight / 2 + this.centerY;
  }
  /**
   * Rendering needs optimization
   * TODO: Don't need to decode every time
   * TODO: Optimize canvas rendering
   */
  draw(ctx: CanvasRenderingContext2D, { width, height }: { width: number, height: number }, frameIndex: number) {
    const frame = Math.max(frameIndex - this.start + this.offsetL, 1); // Display first frame by default
    const start = performance.now();
    return videoDecoder.getFrame(this.source.id, frame).then(async vf => {
      if (vf) {
        console.log('Render time:', performance.now() - start, 'ms');
        ctx.drawImage(vf, 0, 0, this.source.width, this.source.height, this.getDrawX(width), this.getDrawY(height), this.drawWidth, this.drawHeight);
        vf?.close();
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
  audio: HTMLAudioElement | null = null;
  play(currentFrame: number) {
    if (!this.audio) {
      this.audio = new Audio(this.source.url);
    }
    if (this.audio?.paused) {
      this.audio.currentTime = (currentFrame - this.start - this.offsetL) / 30;
      console.log('🚀 ~ VideoTrack ~ play ~ this.audio.currentTime:', this.audio.currentTime);
      this.audio.play();
    }
  }
  pause() {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
  }
  // Generate composite object
  async combine(playerSize: { width: number, height: number }, outputRatio: number) {
    const video = await videoDecoder.decode({ id: this.source.id });
    const clip = await splitClip(video, { offsetL: this.offsetL, offsetR: this.offsetR, frameCount: this.frameCount });
    if (!clip) {
      throw new Error('clip is not ready');
    }
    const spr = new OffscreenSprite(clip);
    // TODO: Need to support cropping
    spr.time = { offset: this.start * UnitFrame2μs, duration: (this.end - this.start) * UnitFrame2μs };
    spr.rect.x = this.getDrawX(playerSize.width) * outputRatio;
    spr.rect.y = this.getDrawY(playerSize.height) * outputRatio;
    spr.rect.w = this.drawWidth * outputRatio;
    spr.rect.h = this.drawHeight * outputRatio;

    return spr;
  }
  split(cutFrame: number) {
    this.end = cutFrame;
    this.offsetR = this.frameCount + this.start - cutFrame; // Split video based on cutFrame
    // Split video based on cutFrame
    const copy = new VideoTrack(this.source, cutFrame);

    copy.offsetL = cutFrame - this.start;
    return copy;
  }
}
