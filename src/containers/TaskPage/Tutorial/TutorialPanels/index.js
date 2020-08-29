import React from 'react';
import { panel } from '../../Styles';
import Button from 'components/Button';
import Icon from 'components/Icon';
import ReactPlayer from 'react-player/lazy';

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
          justifyContent: 'center'
        }}
      >
        <h1>Windows PC</h1>
        <ReactPlayer
          style={{ marginTop: '3rem' }}
          url="https://www.youtube.com/watch?v=1muW9eVZfOM"
          controls
        />
      </div>
    </div>
  );
}
