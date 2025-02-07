import { uniqueId } from 'lodash-es';
import type { BaseTractItem, TrackType } from './Base';
import { UnitFrame2μs } from '@/data/trackConfig';
import { audioDecoder, splitClip } from '@/utils/webcodecs';
import { OffscreenSprite } from '@webav/av-cliper';

export interface AudioSource {
  id: string,
  url: string,
  name: string,
  format: string,
  duration: number
}

export class AudioTrack implements BaseTractItem {
  id: string;
  type: TrackType = 'audio';
  source: AudioSource;
  name: string;
  format: string;
  frameCount: number;
  start: number;
  end: number;
  offsetL: number;
  offsetR: number;
  constructor(source: AudioSource, curFrame: number) {
    // Set ID
    this.id = uniqueId();
    // Set audio information
    this.source = source;
    // Get file name
    this.name = source.name;
    // Get file type
    this.format = source.format;

    // Get audio duration, convert to frameCount
    this.frameCount = source.duration * 30;
    this.start = curFrame;
    this.end = this.start + this.frameCount;

    // Set cropping information
    this.offsetL = 0;
    this.offsetR = 0;
  }
  audio: HTMLAudioElement | null = null;
  play(currentFrame: number) {
    if (!this.audio) {
      this.audio = new Audio(this.source.url);
    }
    if (this.audio?.paused) {
      this.audio.currentTime = (currentFrame - this.start - this.offsetL) / 30;
      this.audio.play();
    }
  }
  pause() {
    if (this.audio && !this.audio.paused) {
      this.audio.pause();
    }
  }
  // Generate composite object
  async combine() {
    const audio = await audioDecoder.decode({ id: this.source.id });
    const clip = await splitClip(audio, { offsetL: this.offsetL, offsetR: this.offsetR, frameCount: this.frameCount });
    if (!clip) {
      throw new Error('clip is not ready');
    }
    const spr = new OffscreenSprite(clip);
    // TODO: Need to support cropping
    spr.time = { offset: this.start * UnitFrame2μs, duration: (this.end - this.start) * UnitFrame2μs };

    return spr;
  }
}
