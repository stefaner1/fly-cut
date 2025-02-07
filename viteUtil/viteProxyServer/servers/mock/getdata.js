/* eslint-disable */
handler = (req, res) => {
  const { query: { type } } = url.parse(req.url, true);
  let data = [];
  if(type === 'video') {
    data = [
      {
        title: 'User Uploads',
        type: 'video',
        items: [
          {
            name: 'video_1',
            format: 'mp4',
            cover: '/image/video/video_1.png',
            source: '/video/video_1.mp4',
            width: 1232,
            height: 720,
            fps: 30,
            frameCount: 712
          },
          {
            name: 'video_2',
            format: 'mp4',
            cover: '/image/video/video_2.png',
            source: '/video/video_2.mp4',
            width: 1242,
            height: 652,
            fps: 30,
            frameCount: 150
          },
        ]
      },
      {
        title: 'Popular',
        type: 'video',
        items: [
          {
            name: 'video_3',
            format: 'mp4',
            cover: '/image/video/video_3.png',
            source: '/video/video_3.mp4',
            width: 1242,
            height: 652,
            fps: 30,
            frameCount: 150
          }
        ]
      },
      {
        title: 'Funny Clips',
        type: 'video',
        items: [
          {
            name: 'video_4',
            format: 'mp4',
            cover: '/image/video/video_4.png',
            width: 650,
            height: 652,
            frameCount: 150,
            fps: 30,
            source: '/video/video_4.mp4'
          }
        ]
      }
    ]
  }else if(type === 'audio') {
    data = [
      {
        title: 'TikTok',
        type: 'audio',
        items: [
          {
            cover: '/image/audio/audio_0.png',
            time: 25000,
            format: 'mp3',
            name: 'Test Audio 1',
            source: '/audio/audio_0.mp3'
          },
          {
            cover: '/image/audio/audio_1.png',
            time: 16000,
            format: 'mp3',
            name: 'Test Audio 2',
            source: '/audio/audio_1.mp3'
          },
          {
            cover: '/image/audio/audio_2.png',
            time: 41000,
            format: 'mp3',
            name: 'Test Audio 3',
            source: '/audio/audio_2.mp3'
          }
        ]
      },
      {
        title: 'Beat Points',
        type: 'audio',
        items: [
          {
            cover: '/image/audio/audio_3.png',
            time: 14000,
            format: 'mp3',
            name: 'Test Audio 4',
            source: '/audio/audio_3.mp3'
          },
          {
            cover: '/image/audio/audio_4.png',
            time: 25000,
            format: 'mp3',
            name: 'Test Audio 5',
            source: '/audio/audio_4.mp3'
          }
        ]
      }
    ]
  }else if(type === 'text') {
    data = [
      {
        title: 'Popular',
        type: 'text',
        items: [
          {
            name: 'Text 1',
            templateId: 0,
            cover: '/image/text/text_0.png'
          },
          {
            name: 'Text 2',
            templateId: 0,
            cover: '/image/text/text_0.png'
          },
          {
            name: 'Text 3',
            templateId: 0,
            cover: '/image/text/text_0.png'
          },
          {
            name: 'Text 4',
            templateId: 0,
            cover: '/image/text/text_0.png'
          },
          {
            name: 'Text 5',
            templateId: 0,
            cover: '/image/text/text_0.png'
          },
          {
            name: 'Text 6',
            templateId: 1,
            cover: '/image/text/text_1.png'
          },
          {
            name: 'Text 7',
            templateId: 1,
            cover: '/image/text/text_1.png'
          },
          {
            name: 'Text 8',
            templateId: 1,
            cover: '/image/text/text_1.png'
          },
          {
            name: 'Text 9',
            templateId: 1,
            cover: '/image/text/text_1.png'
          },
          {
            name: 'Text 10',
            templateId: 1,
            cover: '/image/text/text_1.png'
          }
        ]
      }
    ]
  }else if(type === 'image') {
    data = [
      {
        title: 'Popular',
        type: 'image',
        items: [
          {
            name: 'Sticker 1',
            cover: '/image/image/image_0.png',
            source: '/image/image/image_0.gif',
            format: 'gif',
            width: 199,
            height: 200,
            sourceFrame: 8,
          },
          {
            name: 'Sticker 2',
            cover: '/image/image/image_0.png',
            source: '/image/image/image_0.gif',
            format: 'gif',
            width: 199,
            height: 200,
            sourceFrame: 8,
          },
          {
            name: 'Sticker 3',
            cover: '/image/image/image_0.png',
            source: '/image/image/image_0.gif',
            format: 'gif',
            width: 199,
            height: 200,
            sourceFrame: 8,
          },
          {
            name: 'Sticker 4',
            cover: '/image/image/image_0.png',
            source: '/image/image/image_0.gif',
            format: 'gif',
            width: 199,
            height: 200,
            sourceFrame: 8,
          },
          {
            name: 'Sticker 5',
            cover: '/image/image/image_0.png',
            source: '/image/image/image_0.gif',
            format: 'gif',
            width: 199,
            height: 200,
            sourceFrame: 8,
          }
        ]
      },
      {
        title: 'Classic',
        type: 'image',
        items: [
          {
            name: 'Sticker 6',
            cover: '/image/image/image_1.png',
            source: '/image/image/image_1.gif',
            format: 'gif',
            width: 199,
            height: 200,
            sourceFrame: 6,
          },
          {
            name: 'Sticker 7',
            cover: '/image/image/image_1.png',
            source: '/image/image/image_1.gif',
            format: 'gif',
            width: 199,
            height: 200,
            sourceFrame: 6,
          },
          {
            name: 'Sticker 8',
            cover: '/image/image/image_1.png',
            source: '/image/image/image_1.gif',
            format: 'gif',
            width: 199,
            height: 200,
            sourceFrame: 6,
          },
          {
            name: 'Sticker 9',
            cover: '/image/image/image_1.png',
            source: '/image/image/image_1.gif',
            format: 'gif',
            width: 199,
            height: 200,
            sourceFrame: 6,
          }
        ]
      }
    ]
  }else if(type === 'effect') {
    data = [
      {
        title: 'Popular',
        type: 'effect',
        items: [
          {
            cover: '/image/effect/effect_0.gif',
            name: 'Effect',
            templateId: 0
          },
          {
            cover: '/image/effect/effect_0.gif',
            name: 'Effect',
            templateId: 0
          },
          {
            cover: '/image/effect/effect_0.gif',
            name: 'Effect',
            templateId: 0
          },
          {
            cover: '/image/effect/effect_0.gif',
            name: 'Effect',
            templateId: 0
          },
          {
            cover: '/image/effect/effect_0.gif',
            name: 'Effect',
            templateId: 0
          },
          {
            cover: '/image/effect/effect_0.gif',
            name: 'Effect',
            templateId: 0
          },
          {
            cover: '/image/effect/effect_0.gif',
            name: 'Effect',
            templateId: 0
          },
          {
            cover: '/image/effect/effect_0.gif',
            name: 'Effect',
            templateId: 0
          },
          {
            cover: '/image/effect/effect_0.gif',
            name: 'Effect',
            templateId: 0
          },
          {
            cover: '/image/effect/effect_0.gif',
            name: 'Effect',
            templateId: 0
          },
          {
            cover: '/image/effect/effect_0.gif',
            name: 'Effect',
            templateId: 0
          },
          {
            cover: '/image/effect/effect_0.gif',
            name: 'Effect',
            templateId: 0
          }
        ]
      },
      {
        title: 'Basic',
        type: 'effect',
        items: [
          {
            cover: '/image/effect/effect_1.gif',
            name: 'Effect',
            templateId: 1
          },
          {
            cover: '/image/effect/effect_1.gif',
            name: 'Effect',
            templateId: 1
          },
          {
            cover: '/image/effect/effect_1.gif',
            name: 'Effect',
            templateId: 1
          },
          {
            cover: '/image/effect/effect_1.gif',
            name: 'Effect',
            templateId: 1
          },
          {
            cover: '/image/effect/effect_1.gif',
            name: 'Effect',
            templateId: 1
          }
        ]
      }
    ]
  }else if(type === 'transition') {
    data = [
      {
        title: 'Popular',
        type: 'transition',
        items: [
          {
            cover: '/image/transition/transition_0.gif',
            name: 'Transition',
            templateId: 0
          },
          {
            cover: '/image/transition/transition_0.gif',
            name: 'Transition',
            templateId: 0
          },
          {
            cover: '/image/transition/transition_0.gif',
            name: 'Transition',
            templateId: 0
          },
          {
            cover: '/image/transition/transition_0.gif',
            name: 'Transition',
            templateId: 0
          },
          {
            cover: '/image/transition/transition_0.gif',
            name: 'Transition',
            templateId: 0
          },
          {
            cover: '/image/transition/transition_0.gif',
            name: 'Transition',
            templateId: 0
          }
        ]
      },
      {
        title: 'Dissolve',
        type: 'transition',
        items: [
          {
            cover: '/image/transition/transition_0.gif',
            name: 'Transition',
            templateId: 0
          },
          {
            cover: '/image/transition/transition_0.gif',
            name: 'Transition',
            templateId: 0
          },
          {
            cover: '/image/transition/transition_0.gif',
            name: 'Transition',
            templateId: 0
          },
          {
            cover: '/image/transition/transition_0.gif',
            name: 'Transition',
            templateId: 0
          }
        ]
      },
      {
        title: 'Camera Movement',
        type: 'transition',
        items: [
          {
            cover: '/image/transition/transition_0.gif',
            name: 'Transition',
            templateId: 0
          },
          {
            cover: '/image/transition/transition_0.gif',
            name: 'Transition',
            templateId: 0
          },
          {
            cover: '/image/transition/transition_0.gif',
            name: 'Transition',
            templateId: 0
          },
          {
            cover: '/image/transition/transition_0.gif',
            name: 'Transition',
            templateId: 0
          }
        ]
      }
    ]
  }else if(type === 'filter') {
    data = [
      {
        title: 'Featured',
        type: 'filter',
        items: [
          {
            cover: '/image/filter/empty.png',
            name: 'Filter',
            templateId: 1
          },
          {
            cover: '/image/filter/empty.png',
            name: 'Filter',
            templateId: 2
          },
          {
            cover: '/image/filter/empty.png',
            name: 'Filter',
            templateId: 3
          },
          {
            cover: '/image/filter/empty.png',
            name: 'Bright Skin',
            templateId: 4
          },
          {
            cover: '/image/filter/empty.png',
            name: 'Filter',
            templateId: 5
          },
          {
            cover: '/image/filter/empty.png',
            name: 'Cool White',
            templateId: 6
          },
          {
            cover: '/image/filter/empty.png',
            name: 'Filter',
            templateId: 7
          },
          {
            cover: '/image/filter/empty.png',
            name: 'Filter',
            templateId: 8
          },
          {
            cover: '/image/filter/empty.png',
            name: 'Filter',
            templateId: 9
          },
          {
            cover: '/image/filter/empty.png',
            name: 'Filter',
            templateId: 10
          }
        ]
      }
    ]
  }
  res.writeHead(200, { 'Content-type': 'application/json' });
  res.write(JSON.stringify({
    status: 200,
    data: data
  }));
  res.end();
};
