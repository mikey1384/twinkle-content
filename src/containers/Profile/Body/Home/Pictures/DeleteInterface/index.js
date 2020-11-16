import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Picture from './Picture';

DeleteInterface.propTypes = {
  pictures: PropTypes.array.isRequired
};

export default function DeleteInterface({ pictures }) {
  const [remainingPictures, setRemainingPictures] = useState(pictures);
  return (
    <ErrorBoundary>
      <div
        style={{
          width: '100%',
          height: 'auto',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        {remainingPictures.map((picture, index) => (
          <Picture
            key={index}
            onDelete={(pictureId) =>
              setRemainingPictures((pictures) =>
                pictures.filter((picture) => picture.id !== pictureId)
              )
            }
            numPictures={pictures.length}
            picture={picture}
            style={{ marginLeft: index === 0 ? 0 : '1rem' }}
          />
        ))}
      </div>
    </ErrorBoundary>
  );
}
