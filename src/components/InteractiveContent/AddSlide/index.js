import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { borderRadius, Color } from 'constants/css';
import NewSlideForm from './NewSlideForm';

AddSlide.propTypes = {
  style: PropTypes.object
};

export default function AddSlide({ style }) {
  const [isAddingSlide, setIsAddingSlide] = useState(false);
  return (
    <div style={{ width: '100%', ...style }}>
      {isAddingSlide ? (
        <NewSlideForm />
      ) : (
        <div
          style={{
            background: '#fff',
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
            <Button onClick={() => setIsAddingSlide(true)} skeuomorphic>
              <Icon icon="plus" />
              <span style={{ marginLeft: '0.7rem' }}>Add a Slide</span>
            </Button>
          </div>
        </div>
      )}
      <div
        style={{
          background: '#fff',
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
