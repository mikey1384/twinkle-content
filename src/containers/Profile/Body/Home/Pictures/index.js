import React from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import Carousel from 'components/Carousel';
import Frame from './Frame';
import { mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

Pictures.propTypes = {
  selectedTheme: PropTypes.string
};

export default function Pictures({ selectedTheme }) {
  return (
    <SectionPanel customColorTheme={selectedTheme} loaded title="Pictures">
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '-1rem'
        }}
      >
        <Carousel
          className={css`
            width: 80%;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
            }
          `}
          allowDrag={false}
          slidesToShow={3}
          slidesToScroll={1}
        >
          <Frame
            picture={{
              url: '/test/profile/1550.jpg',
              caption: 'this is my first profile pic back in 2014'
            }}
          />
          <Frame picture={{ url: '/test/profile/1550.jpg' }} />
          <Frame picture={{ url: '/test/profile/1550.jpg' }} />
          <Frame picture={{ url: '/test/profile/1550.jpg' }} />
        </Carousel>
      </div>
    </SectionPanel>
  );
}
