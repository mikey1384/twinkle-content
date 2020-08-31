import React, { useState } from 'react';
import { panel as panelStyle } from '../../Styles';
import ReactPlayer from 'react-player/lazy';
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
        type: 'file',
        src: StartButton
      }
    }
  });
  const [displayedSlides] = useState([1, 2]);

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
          style={{ marginTop: index === 0 ? 0 : '5rem' }}
        />
      ))}
      <div
        className={panelStyle}
        style={{
          marginTop: '5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: '5rem'
        }}
      >
        <h1>Windows PC</h1>
        <p style={{ fontSize: '2rem', marginTop: '1.5rem' }}>
          Watch this video or follow the instructions below (or both)
        </p>
        <ReactPlayer
          style={{ marginTop: '3rem' }}
          url="https://www.youtube.com/watch?v=ddxcVJPAf18"
          controls
        />
      </div>
      <Slide
        heading={`1. Tap the button at the bottom left corner of your screen (that button is called the "Start Button")`}
        src={StartButton}
        style={{ marginTop: '5rem' }}
      />
      <Slide
        heading={`2. Tap "All Apps (모든 어플리케이션)"`}
        src={Applications}
        style={{ marginTop: '5rem' }}
      />
      <Slide
        heading={`3. Scroll down until you see "Windows Accessories"`}
        src={ScrollDown}
        style={{ marginTop: '5rem' }}
      />
      <Slide
        heading={`4. Tap "Windows Accessories"`}
        src={WindowsAccessories}
        style={{ marginTop: '5rem' }}
      />
      <Slide
        heading={`5. Tap "Snipping Tool"`}
        src={SnippingTool}
        style={{ marginTop: '5rem' }}
      />
      <Slide
        heading={`6. Tap "New"`}
        src={TapNew}
        style={{ marginTop: '5rem' }}
      />
      <Slide
        heading={`8. The screen will be grayed out`}
        src={GrayOut}
        style={{ marginTop: '5rem' }}
      />
      <Slide
        heading={`9. Drag a box around what you want to take a screen shot of`}
        src={DragTheBox}
        style={{ marginTop: '5rem' }}
      />
      <Slide
        heading={`10. Save your screenshot`}
        src={TapToSave}
        style={{ marginTop: '5rem' }}
      />
    </div>
  );
}
