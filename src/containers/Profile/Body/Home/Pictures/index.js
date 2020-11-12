import React from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import Carousel from 'components/Carousel';
import Frame from './Frame';

Pictures.propTypes = {
  selectedTheme: PropTypes.string
};

export default function Pictures({ selectedTheme }) {
  return (
    <SectionPanel customColorTheme={selectedTheme} loaded title="Pictures">
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Carousel
          style={{ width: '80%' }}
          allowDrag={false}
          slidesToShow={3}
          slidesToScroll={1}
        >
          <Frame picture={{ url: '/test/profile/1550.jpg' }} />
          <Frame picture={{ url: '/test/profile/1550.jpg' }} />
          <Frame picture={{ url: '/test/profile/1550.jpg' }} />
          <Frame picture={{ url: '/test/profile/1550.jpg' }} />
        </Carousel>
      </div>
    </SectionPanel>
  );
}
