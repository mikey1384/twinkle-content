import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { borderRadius, Color } from 'constants/css';

AddSlide.propTypes = {
  style: PropTypes.object
};

export default function AddSlide({ style }) {
  return (
    <div style={{ width: '100%', ...style }}>
      <div
        style={{
          borderRadius,
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          border: `1px solid ${Color.borderGray()}`
        }}
      >
        <div style={{ display: 'flex' }}>
          <Button skeuomorphic>
            <Icon icon="code-branch" />
            <span style={{ marginLeft: '0.7rem' }}>Fork</span>
          </Button>
          <Button skeuomorphic style={{ marginLeft: '2rem' }}>
            <Icon icon="plus" />
            <span style={{ marginLeft: '0.7rem' }}>Slide</span>
          </Button>
        </div>
      </div>
      <div
        style={{
          marginTop: '1rem',
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
          <span style={{ marginLeft: '0.7rem' }}>Publish</span>
        </Button>
      </div>
    </div>
  );
}
