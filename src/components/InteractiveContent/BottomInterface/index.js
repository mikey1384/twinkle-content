import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import AddSlide from './AddSlide';
import { borderRadius, Color } from 'constants/css';
import { useAppContext } from 'contexts';

BottomInterface.propTypes = {
  interactiveId: PropTypes.number.isRequired,
  isPublished: PropTypes.bool,
  lastFork: PropTypes.object,
  archivedSlides: PropTypes.array,
  onPublishInteractive: PropTypes.func,
  style: PropTypes.object
};

export default function BottomInterface({
  archivedSlides,
  interactiveId,
  isPublished,
  lastFork,
  onPublishInteractive,
  style
}) {
  const {
    requestHelpers: { publishInteractive }
  } = useAppContext();
  return (
    <div style={{ width: '100%', ...style }}>
      <AddSlide
        archivedSlides={archivedSlides}
        interactiveId={interactiveId}
        lastFork={lastFork}
      />
      {!isPublished && (
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
          <Button
            onClick={handlePublish}
            color="darkBlue"
            skeuomorphic
            style={{ marginLeft: '1rem' }}
          >
            <Icon icon="upload" />
            <span style={{ marginLeft: '0.7rem' }}>Publish Content</span>
          </Button>
        </div>
      )}
    </div>
  );

  async function handlePublish() {
    const success = await publishInteractive(interactiveId);
    if (success) {
      onPublishInteractive(interactiveId);
    }
  }
}
