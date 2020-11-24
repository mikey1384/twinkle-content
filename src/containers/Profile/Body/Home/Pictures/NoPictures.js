import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { useMyState } from 'helpers/hooks';

NoPictures.propTypes = {
  numPics: PropTypes.number.isRequired,
  onAddButtonClick: PropTypes.func.isRequired,
  profileId: PropTypes.number.isRequired
};

export default function NoPictures({ numPics, onAddButtonClick, profileId }) {
  const { userId } = useMyState();

  return (
    <ErrorBoundary>
      {profileId === userId && numPics > 0 ? (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            lineHeight: 2,
            marginTop: '2rem',
            marginBottom: '2rem'
          }}
        >
          <Button
            onClick={onAddButtonClick}
            transparent
            style={{ fontSize: '2rem' }}
          >
            <Icon icon="plus" />
            <span style={{ marginLeft: '0.7rem' }}>Add Pictures</span>
          </Button>
        </div>
      ) : null}
    </ErrorBoundary>
  );
}
