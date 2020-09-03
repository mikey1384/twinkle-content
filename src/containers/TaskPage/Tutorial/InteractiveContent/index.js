import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Slide from './Slide';
import { useAppContext, useInteractiveContext } from 'contexts';

InteractiveContent.propTypes = {
  contentId: PropTypes.number.isRequired
};

export default function InteractiveContent({ contentId }) {
  const {
    requestHelpers: { loadInteractive }
  } = useAppContext();
  const {
    actions: { onLoadInteractive }
  } = useInteractiveContext();

  useEffect(() => {
    init();
    async function init() {
      const interactive = await loadInteractive(contentId);
      onLoadInteractive(interactive);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contentId]);

  const [slideObj, setSlideObj] = useState({
    1: {
      isFork: true,
      heading: 'Which device are you using?',
      selectedOptionId: null,
      options: [
        {
          id: 1,
          label: 'Windows PC',
          icon: ['fab', 'windows']
        },
        {
          id: 2,
          label: 'Macintosh (Macbook / iMac)',
          icon: ['fab', 'apple']
        },
        {
          id: 3,
          label: 'Android smartphone / tablet',
          icon: ['fab', 'android']
        },
        {
          id: 4,
          label: 'iPhone / iPad',
          icon: ['fab', 'apple']
        },
        {
          id: 5,
          label: `Other / I don't know`
        }
      ],
      paths: {
        1: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        2: [13, 14, 15, 16, 17],
        3: [18],
        4: [19, 20],
        5: [21]
      }
    },
    2: {
      heading: 'Windows PC',
      description: 'Watch this video or read the instructions below (or both)',
      attachment: {
        type: 'youtube',
        src: 'https://www.youtube.com/watch?v=ddxcVJPAf18'
      }
    },
    3: {
      heading: `1. Tap the button at the bottom left corner of your screen (that button is called the "Start Button")`,
      attachment: {
        type: 'image',
        src: `/tasks/take-a-screenshot/tutorial/start-button.png`
      }
    },
    4: {
      heading: `2. Tap "All Apps (모든 어플리케이션)"`,
      attachment: {
        type: 'image',
        src: `/tasks/take-a-screenshot/tutorial/applications.png`
      }
    },
    5: {
      heading: `3. Scroll down until you see "Windows Accessories"`,
      attachment: {
        type: 'image',
        src: `/tasks/take-a-screenshot/tutorial/scroll-down.png`
      }
    },
    6: {
      heading: `4. Tap "Windows Accessories"`,
      attachment: {
        type: 'image',
        src: `/tasks/take-a-screenshot/tutorial/windows-accessories.png`
      }
    },
    7: {
      heading: `5. Tap "Snipping Tool"`,
      attachment: {
        type: 'image',
        src: `/tasks/take-a-screenshot/tutorial/snipping-tool.png`
      }
    },
    8: {
      heading: `6. Tap "New"`,
      attachment: {
        type: 'image',
        src: `/tasks/take-a-screenshot/tutorial/tap-new.png`
      }
    },
    9: {
      heading: `7. The screen will be grayed out`,
      attachment: {
        type: 'image',
        src: `/tasks/take-a-screenshot/tutorial/gray-out.png`
      }
    },
    10: {
      heading: `8. Drag a box around what you want to take a screenshot of`,
      attachment: {
        type: 'image',
        src: `/tasks/take-a-screenshot/tutorial/drag-a-box.png`
      }
    },
    11: {
      heading: `9. Save your screenshot`,
      attachment: {
        type: 'image',
        src: `/tasks/take-a-screenshot/tutorial/tap-to-save.png`
      }
    },
    12: {
      heading:
        'Watch the video to learn about other ways to capture screenshots',
      attachment: {
        type: 'youtube',
        src: 'https://www.youtube.com/watch?v=ddxcVJPAf18'
      }
    },
    13: {
      heading: 'Macintosh (Macbook / iMac)',
      description: 'Watch this video or read the instructions below (or both)',
      attachment: {
        type: 'youtube',
        src: 'https://www.youtube.com/watch?v=NbB3Cm2ejkg'
      }
    },
    14: {
      heading: `1. Press shift + command + 3 to take a screenshot of your entire screen`,
      attachment: {
        type: 'image',
        src: `/tasks/take-a-screenshot/tutorial/mac-entire-screen.png`
      }
    },
    15: {
      heading: `2. To take a screenshot of a portion of your screen, press shift + command + 4`,
      attachment: {
        type: 'image',
        src: `/tasks/take-a-screenshot/tutorial/mac-portion-screen.png`
      }
    },
    16: {
      heading: `3. ...then, drag a box around the area you want to take a screenshot of and release`,
      attachment: {
        type: 'image',
        src: `/tasks/take-a-screenshot/tutorial/mac-drag-and-release.png`
      }
    },
    17: {
      heading:
        '4. Watch the video to learn about other ways to capture screenshots',
      attachment: {
        type: 'youtube',
        src: 'https://www.youtube.com/watch?v=NbB3Cm2ejkg'
      }
    },
    18: {
      heading: 'Android smartphone / tablet',
      description: 'Watch this video',
      attachment: {
        type: 'youtube',
        src: 'https://www.youtube.com/watch?v=3eD1gdnfCdA'
      }
    },
    19: {
      heading: 'iPhone X or newer',
      description: 'Watch this video',
      attachment: {
        type: 'youtube',
        src: 'https://www.youtube.com/watch?v=yCHiLTB2y24'
      }
    },
    20: {
      heading: 'Older iPhones',
      description: 'Watch this video',
      attachment: {
        type: 'youtube',
        src: 'https://www.youtube.com/watch?v=W1acdzGAQOY'
      }
    },
    21: {
      heading: `Other / I don't know`,
      description:
        'Ask your parents the name of your device. If your device is not included in the list, send a chat message to Mikey about it'
    }
  });
  const [displayedSlides, setDisplayedSlides] = useState([1]);

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '10rem'
      }}
    >
      {displayedSlides.map((panelId, index) => (
        <Slide
          key={panelId}
          autoFocus={index > 0 && slideObj[displayedSlides[index - 1]]?.isFork}
          heading={slideObj[panelId].heading}
          onExpandPath={slideObj[panelId].isFork ? handleExpandPath : null}
          description={slideObj[panelId].description}
          options={slideObj[panelId].options}
          selectedOptionId={slideObj[panelId].selectedOptionId}
          panelId={panelId}
          paths={slideObj[panelId].paths}
          attachment={slideObj[panelId].attachment}
          style={{ marginTop: index === 0 ? 0 : '5rem' }}
        />
      ))}
    </div>
  );

  function handleExpandPath({ newSlides, panelId, optionId }) {
    if (optionId !== slideObj[panelId].selectedOptionId) {
      if (slideObj[panelId].selectedOptionId) {
        const index = displayedSlides.indexOf(panelId);
        const newDisplayedSlides = [...displayedSlides];
        setDisplayedSlides(newDisplayedSlides.slice(0, index + 1));
      }
      setSlideObj((slideObj) => ({
        ...slideObj,
        [panelId]: {
          ...slideObj[panelId],
          selectedOptionId: optionId
        }
      }));
      setDisplayedSlides((slides) => slides.concat(newSlides));
    }
  }
}
