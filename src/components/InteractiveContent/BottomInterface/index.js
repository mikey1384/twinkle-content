import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import AddSlide from './AddSlide';
import { borderRadius, Color } from 'constants/css';

BottomInterface.propTypes = {
  interactiveId: PropTypes.number.isRequired,
  lastFork: PropTypes.object,
  archivedSlides: PropTypes.array,
  style: PropTypes.object
};

export default function BottomInterface({
  archivedSlides,
  interactiveId,
  lastFork,
  style
}) {
  return (
    <div style={{ width: '100%', ...style }}>
      <AddSlide
        archivedSlides={archivedSlides}
        interactiveId={interactiveId}
        lastFork={lastFork}
      />
      <div
        style={{
          background: '#fff',
          marginTop: '3rem',
          borderRadius,
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          border: `1px solid ${Color.borderGray()}`
        }}
      >
        <Button color="darkBlue" skeuomorphic style={{ marginLeft: '1rem' }}>
          <Icon icon="upload" />
          <span style={{ marginLeft: '0.7rem' }}>Publish Content</span>
        </Button>
      </div>
    </div>
  );
}
