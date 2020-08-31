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
  const [slideObj] = useState({
    1: {
      type: 'fork',
      id: 1,
      heading: 'Which device are you using?',
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
      ]
    },
    2: {
      id: 2,
      type: 'intro',
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
      type: 'slide',
      heading: `1. Tap the button at the bottom left corner of your screen (that button is called the "Start Button")`,
      attachment: {
        type: 'image',
        src: StartButton
      }
    },
    4: {
      id: 3,
      type: 'slide',
      heading: `2. Tap "All Apps (모든 어플리케이션)"`,
      attachment: {
        type: 'image',
        src: Applications
      }
    },
    5: {
      id: 3,
      type: 'slide',
      heading: `3. Scroll down until you see "Windows Accessories"`,
      attachment: {
        type: 'image',
        src: ScrollDown
      }
    },
    6: {
      id: 3,
      type: 'slide',
      heading: `4. Tap "Windows Accessories"`,
      attachment: {
        type: 'image',
        src: WindowsAccessories
      }
    },
    7: {
      id: 3,
      type: 'slide',
      heading: `5. Tap "Snipping Tool"`,
      attachment: {
        type: 'image',
        src: SnippingTool
      }
    },
    8: {
      id: 3,
      type: 'slide',
      heading: `6. Tap "New"`,
      attachment: {
        type: 'image',
        src: TapNew
      }
    },
    9: {
      id: 3,
      type: 'slide',
      heading: `8. The screen will be grayed out`,
      attachment: {
        type: 'image',
        src: GrayOut
      }
    },
    10: {
      id: 3,
      type: 'slide',
      heading: `9. Drag a box around what you want to take a screen shot of`,
      attachment: {
        type: 'image',
        src: DragTheBox
      }
    },
    11: {
      id: 3,
      type: 'slide',
      heading: `10. Save your screenshot`,
      attachment: {
        type: 'image',
        src: TapToSave
      }
    }
  });
  const [displayedSlides] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

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
          description={slideObj[panelId].description}
          options={slideObj[panelId].options}
          attachment={slideObj[panelId].attachment}
          style={{ marginTop: index === 0 ? 0 : '5rem' }}
        />
      ))}
    </div>
  );
}
