// import { file2ArrayBuffer } from '@/utils/common';
import SparkMD5 from 'spark-md5';

// export const getVideoMetaInfo = async(url: string): Promise<{ duration: number, width: number, height: number }> => {
//   const video = document.createElement('video');
//   video.muted = true;
//   video.src = url;
//   return new Promise(resolve => {
//     video.addEventListener('loadedmetadata', () => {
//       resolve({
//         duration: video.duration,
//         width: video.videoWidth,
//         height: video.videoHeight
//       });
//     });
//   });
// };

// interface BaseTrack {
//   id: string
//   name: string
//   // Total number of frames
//   frameCount: number
//   // Start frame
//   start: number
//   // End frame
//   end: number
//   offsetL: number
//   offsetR: number
//   // File format
//   format: string
// }

export type TrackType = 'video' | 'audio' | 'text' | 'image' | 'effect' | 'transition' | 'filter';

export interface BaseTractItem {
  id: string,
  type: TrackType,
  name: string,
  start: number, // Starting position on track, unit is frames
  end: number, // Ending position on track
  frameCount: number, // Total number of frames
}

export async function getMD5(arrayBuffer: ArrayBuffer) {
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

// Text, audio, video, image
/**
 * For network resources, server needs to provide file information:
 * id, resource URL, filename, file type, file dimensions (video, image), file duration (video, audio)
 * While this information can be obtained locally, it's more logical for the server to provide it,
 * as once we have this information, we can immediately render the timeline
 */
