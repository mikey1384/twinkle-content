import React from 'react';
import { panel } from '../../Styles';
import Button from 'components/Button';
import Icon from 'components/Icon';
import ReactPlayer from 'react-player/lazy';
import StartButton from './start-button.png';

export default function TutorialPanels() {
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
      <div className={panel} style={{ paddingBottom: '5rem' }}>
        <p style={{ fontWeight: 'bold', fontSize: '3rem' }}>
          Which device are you using?
        </p>
        <div
          style={{
            marginTop: '5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <Button skeuomorphic>
            <Icon icon={['fab', 'windows']} />
            <span style={{ marginLeft: '0.7rem' }}>Windows PC</span>
          </Button>
          <Button style={{ marginTop: '1rem' }} skeuomorphic>
            <Icon icon={['fab', 'apple']} />
            <span style={{ marginLeft: '0.7rem' }}>
              Macintosh (Macbook / iMac)
            </span>
          </Button>
          <Button style={{ marginTop: '1rem' }} skeuomorphic>
            <Icon icon={['fab', 'android']} />
            <span style={{ marginLeft: '0.7rem' }}>
              Android Smartphone/Tablet
            </span>
          </Button>
          <Button style={{ marginTop: '1rem' }} skeuomorphic>
            <Icon icon={['fab', 'apple']} />
            <span style={{ marginLeft: '0.7rem' }}>iPhone / iPad</span>
          </Button>
          <Button style={{ marginTop: '1rem' }} skeuomorphic>
            <span>Other</span>
          </Button>
          <Button
            style={{ marginTop: '1rem' }}
            skeuomorphic
          >{`I don't know`}</Button>
        </div>
      </div>
      <div
        className={panel}
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
      <div
        className={panel}
        style={{
          marginTop: '5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingBottom: '5rem'
        }}
      >
        <p
          style={{ fontSize: '2.5rem', fontWeight: 'bold' }}
        >{`1. Tap the button at the bottom left corner of your screen (it's called the "Start Button")`}</p>
        <div style={{ width: '80%', marginTop: '3rem' }}>
          <img style={{ width: '100%' }} src={StartButton} />
        </div>
      </div>
    </div>
  );
}
