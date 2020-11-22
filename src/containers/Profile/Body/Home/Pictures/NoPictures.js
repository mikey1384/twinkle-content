import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { useMyState } from 'helpers/hooks';

NoPictures.propTypes = {
  profileId: PropTypes.number.isRequired
};

export default function NoPictures({ profileId }) {
  const { userId } = useMyState();

  return (
    <ErrorBoundary>
      {profileId === userId ? (
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
          <Button transparent style={{ fontSize: '2rem' }}>
            <Icon icon="plus" />
            <span style={{ marginLeft: '0.7rem' }}>Add Pictures</span>
          </Button>
        </div>
      ) : null}
    </ErrorBoundary>
  );
}
