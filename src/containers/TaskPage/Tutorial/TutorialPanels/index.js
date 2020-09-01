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
          label: 'Android Smartphone/Tablet',
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
        1: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        2: [],
        3: [],
        4: [],
        5: [],
        6: []
      }
    },
    2: {
      id: 2,
      heading: 'Windows PC',
      description:
        'Watch this video or follow the instructions below (or both)',
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
      heading: `8. Drag a box around what you want to take a screen shot of`,
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
