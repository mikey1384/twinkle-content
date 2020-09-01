import React, { useState } from 'react';
import Slide from './Slide';
import StartButton from './start-button.png';
import Applications from './applications.png';
import ScrollDown from './scroll-down.png';
import WindowsAccessories from './windows-accessories.png';
import SnippingTool from './snipping-tool.png';
import TapNew from './tap-new.png';
import GrayOut from './gray-out.png';
import DragTheBox from './drag-the-box.png';
import TapToSave from './tap-to-save.png';
import MacEntireScreen from './mac-entire-screen.png';
import MacPortionScreen from './mac-portion-screen.png';
import MacDragRelease from './mac-drag-and-release.png';

export default function TutorialPanels() {
  const [slideObj, setSlideObj] = useState({
    1: {
      id: 1,
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
          label: 'Other'
        },
        {
          id: 6,
          label: `I don't know`
        }
      ],
      paths: {
        1: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        2: [13, 14, 15, 16, 17],
        3: [18],
        4: [],
        5: [],
        6: []
      }
    },
    2: {
      id: 2,
      heading: 'Windows PC',
      description: 'Watch this video or read the instructions below (or both)',
      autoFocus: true,
      attachment: {
        type: 'youtube',
        src: 'https://www.youtube.com/watch?v=ddxcVJPAf18'
      }
    },
    3: {
      id: 3,
      heading: `1. Tap the button at the bottom left corner of your screen (that button is called the "Start Button")`,
      attachment: {
        type: 'image',
        src: StartButton
      }
    },
    4: {
      id: 4,
      heading: `2. Tap "All Apps (모든 어플리케이션)"`,
      attachment: {
        type: 'image',
        src: Applications
      }
    },
    5: {
      id: 5,
      heading: `3. Scroll down until you see "Windows Accessories"`,
      attachment: {
        type: 'image',
        src: ScrollDown
      }
    },
    6: {
      id: 6,
      heading: `4. Tap "Windows Accessories"`,
      attachment: {
        type: 'image',
        src: WindowsAccessories
      }
    },
    7: {
      id: 7,
      heading: `5. Tap "Snipping Tool"`,
      attachment: {
        type: 'image',
        src: SnippingTool
      }
    },
    8: {
      id: 8,
      heading: `6. Tap "New"`,
      attachment: {
        type: 'image',
        src: TapNew
      }
    },
    9: {
      id: 9,
      heading: `7. The screen will be grayed out`,
      attachment: {
        type: 'image',
        src: GrayOut
      }
    },
    10: {
      id: 10,
      heading: `8. Drag a box around what you want to take a screenshot of`,
      attachment: {
        type: 'image',
        src: DragTheBox
      }
    },
    11: {
      id: 11,
      heading: `9. Save your screenshot`,
      attachment: {
        type: 'image',
        src: TapToSave
      }
    },
    12: {
      id: 12,
      heading:
        '10. Watch the video to learn about other ways to capture screenshots',
      attachment: {
        type: 'youtube',
        src: 'https://www.youtube.com/watch?v=ddxcVJPAf18'
      }
    },
    13: {
      id: 13,
      heading: 'Macintosh (Macbook / iMac)',
      description: 'Watch this video or read the instructions below (or both)',
      autoFocus: true,
      attachment: {
        type: 'youtube',
        src: 'https://www.youtube.com/watch?v=NbB3Cm2ejkg'
      }
    },
    14: {
      id: 14,
      heading: `1. Press shift + command + 3 to take a screenshot of your entire screen`,
      attachment: {
        type: 'image',
        src: MacEntireScreen
      }
    },
    15: {
      id: 15,
      heading: `2. To take a screenshot of a portion of your screen, press shift + command + 4`,
      attachment: {
        type: 'image',
        src: MacPortionScreen
      }
    },
    16: {
      id: 16,
      heading: `3. ...then, drag a box around the area you want to take a screenshot of and release`,
      attachment: {
        type: 'image',
        src: MacDragRelease
      }
    },
    17: {
      id: 17,
      heading:
        '4. Watch the video to learn about other ways to capture screenshots',
      attachment: {
        type: 'youtube',
        src: 'https://www.youtube.com/watch?v=NbB3Cm2ejkg'
      }
    },
    18: {
      id: 18,
      heading: 'Android smartphone / tablet',
      description: 'Watch this video',
      autoFocus: true,
      attachment: {
        type: 'youtube',
        src: 'https://www.youtube.com/watch?v=3eD1gdnfCdA'
      }
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
          autoFocus={slideObj[panelId].autoFocus}
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
