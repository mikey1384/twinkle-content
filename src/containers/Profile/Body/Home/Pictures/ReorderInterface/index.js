import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Picture from './Picture';

ReorderInterface.propTypes = {
  numPictures: PropTypes.number.isRequired,
  pictures: PropTypes.array.isRequired,
  reorderedPictureIds: PropTypes.array.isRequired,
  onSetReorderedPictureIds: PropTypes.func.isRequired
};

export default function ReorderInterface({
  numPictures,
  pictures,
  reorderedPictureIds,
  onSetReorderedPictureIds
}) {
  console.log(reorderedPictureIds, onSetReorderedPictureIds);
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
        {pictures.map((picture, index) => (
          <Picture
            key={picture.id}
            numPictures={numPictures}
            picture={picture}
            style={{ marginLeft: index === 0 ? 0 : '1rem' }}
          />
        ))}
      </div>
    </ErrorBoundary>
  );
}
