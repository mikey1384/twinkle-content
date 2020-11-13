import React from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import Carousel from 'components/Carousel';
import Frame from './Frame';
import { mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

Pictures.propTypes = {
  pictures: PropTypes.array,
  selectedTheme: PropTypes.string
};

export default function Pictures({ pictures, selectedTheme }) {
  return pictures ? (
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
          {pictures.map((picture, index) => (
            <Frame key={index} picture={picture} />
          ))}
        </Carousel>
      </div>
    </SectionPanel>
  ) : (
    <div>No Pictures</div>
  );
}
