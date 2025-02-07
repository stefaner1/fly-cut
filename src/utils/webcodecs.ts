/* eslint-disable */

import type { VideoSource } from "@/class/VideoTrack";
import { baseFps } from "@/data/trackConfig";
import { Combinator, MP4Clip, OffscreenSprite, decodeImg, AudioClip } from "@webav/av-cliper";
import { file, write } from "opfs-tools";
import { UnitFrame2μs } from '@/data/trackConfig';

async function writeFile(id: string, stream?: ReadableStream<Uint8Array>) {
  if (!stream) {
    // No data stream, try to get from OPFS
    stream = await file(id).stream();

    if (!stream) {
      throw new Error("stream is not ready");
    }
  }

  const start = performance.now()

  // If data doesn't exist in OPFS, store it
  if (!(await file(id).exists())) {
    await write(id, stream);
    console.log('OPFS file storage time:', performance.now() - start, 'ms');

    stream = await file(id).stream();

    console.log('OPFS file read time:', performance.now() - start, 'ms');
  }

  return stream;
}

class VideoDecoder {
  #decoderMap = new Map<string, MP4Clip>();

  #thumbnailsMap = new Map<string, {
      img: Blob;
      ts: number;
  }[]>();

  async thumbnails(source: VideoSource) {
    if (this.#thumbnailsMap.has(source.id)) {
      return this.#thumbnailsMap.get(source.id);
    }
    const clip = await this.decode({ id: source.id });

    if (!clip) {
      throw new Error("clip is not ready");
    }
    const thumbnails = await clip.thumbnails(50, { step: 1e6 });

    this.#thumbnailsMap.set(source.id, thumbnails);

    return thumbnails;
  }

  async decode({ id, stream, type }: { id: string, stream?: ReadableStream<Uint8Array>, type?: string }) {
    if (this.#decoderMap.has(id)) {
      return this.#decoderMap.get(id);
    }

    stream = await writeFile(id, stream);

    const videoClip = new MP4Clip(stream);

    await videoClip.ready;

    this.#decoderMap.set(id, videoClip);

    return videoClip;
  }
  async getFrame(url: string, frameIndex: number) {
    let clip = this.#decoderMap.get(url);
    if (!clip) {
      clip = await this.decode({ url })
    }

    // tick gets frames based on time, but the frame might be empty at that time, modified to find frame within range
    // First few frames might be empty, so minimum time is set to 5/30 seconds
    let time = Math.max(((frameIndex - 1) / baseFps * 1e6), 5 / 30 * 1e6) ;
    let video : VideoFrame | undefined;
    const frame = (await (clip as MP4Clip).tick(time));

    return frame.video;
  }
}

class ImageDecoder {
  #decoderMap = new Map<string, VideoFrame[]>();
  async decode({ id, stream, type }: { id: string, stream?: ReadableStream<Uint8Array>, type?: string }) {
    console.log("🚀 ~ ImageDecoder ~ decode ~ id:", id)

    if (this.#decoderMap.has(id)) {
      return this.#decoderMap.get(id);
    }

    stream = await writeFile(id, stream);

    if (!type) {
      throw new Error("type is not ready");
    }

    // Received data could be remote (URL) or local (file)
    // For remote data, URL can be used directly as source
    // For local data, FileReader can read data and URL.createObjectURL creates URL as source, but cached data can't be restored as File object
    // To solve this, we could use https://hughfenghen.github.io/posts/2024/03/14/web-storage-and-opfs/
    // But this increases complexity, so not considering it for now
    // TODO: Use OPFS to solve local data issue
    const frames = await decodeImg(
      stream,
      type,
    );

    // Store decoded frames
    this.#decoderMap.set(id, frames);

    return frames;
  }
  async getFrame(type: string, url: string, frameIndex: number) {
    let frames = this.#decoderMap.get(url);
    if (!frames) {
      await this.decode({ url, type });
      frames = this.#decoderMap.get(url);
    }
    return frames?.[frameIndex % frames.length];
  }
}

class AudioDecoder {
  #decoderMap = new Map<string, AudioClip>();
  async decode({ id, stream, type }: { id: string, stream?: ReadableStream<Uint8Array>, type?: string }) {

    if (this.#decoderMap.has(id)) {
      return this.#decoderMap.get(id);
    }

    stream = await writeFile(id, stream);

    if (!type) {
      throw new Error("type is not ready");
    }

    const clip = new AudioClip(stream);

    if (!clip) {
      // Video parsing failed
      throw new Error("Video parsing failed");
    }

    await clip.ready;

    this.#decoderMap.set(id, clip)

    return clip;
  }
}

export const splitClip = async (source: IClip, { offsetL, offsetR, frameCount } : { offsetL: number, offsetR: number, frameCount: number }) => {
  if (offsetL === 0 && offsetR === 0) {
    return source
  }
  const start = offsetL * UnitFrame2μs
  // Use start to clip video
  const clip = offsetL === 0 ? source : (await source.split(start))[1];
  const end = (frameCount - offsetR - offsetL) * UnitFrame2μs;
  return offsetR === 0 ? clip : (await clip.split(end))[0];
}

export const videoDecoder = new VideoDecoder();

export const imageDecoder = new ImageDecoder();

export const audioDecoder = new AudioDecoder();
