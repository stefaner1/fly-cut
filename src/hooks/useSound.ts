import { onUnmounted, ref } from 'vue';

let audio: HTMLAudioElement | null = null;

export const useSound = () => {
  const playingUrl = ref('');

  if (!audio) {
    // Create a new Audio object
    audio = new Audio();
  }

  audio.onended = () => {
    console.log('Playback ended');
    playingUrl.value = '';
  };

  audio.addEventListener('pause', () => {
    console.log('Playback paused');
    playingUrl.value = '';
  });

  function toggle(src: string) {
    if (playingUrl.value !== src) {
      audio?.pause();
      setTimeout(() => {
        playingUrl.value = src;
 // Set the audio file URL
        audio.src = src;
        audio?.play();
      }, 100);
    } else {
      playingUrl.value = '';
      audio?.pause();
    }
  }

  function stop() {
    playingUrl.value = '';
    audio?.pause();
  }

  onUnmounted(() => {
    playingUrl.value = '';
    audio?.pause();
  });

  return {
    playingUrl,
    toggle,
    stop
  };
};
