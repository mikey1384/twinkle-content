import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Modal from 'components/Modal';
import Caption from './Caption';
import Icon from 'components/Icon';
import { stringIsEmpty } from 'helpers/stringHelpers';

ImageModal.propTypes = {
  caption: PropTypes.string,
  downloadable: PropTypes.bool,
  modalOverModal: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
  fileName: PropTypes.string,
  src: PropTypes.string,
  userIsUploader: PropTypes.bool
};

export default function ImageModal({
  caption,
  modalOverModal,
  onHide,
  fileName,
  src,
  downloadable = true,
  userIsUploader
}) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <Modal
      closeWhenClickedOutside={!isEditing}
      modalOverModal={modalOverModal}
      large
      onHide={onHide}
    >
      <header>{fileName}</header>
      <main>
        <img
          style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
          src={src}
          rel={fileName}
        />
        <Caption caption={caption} />
      </main>
      <footer>
        {downloadable && (
          <Button color="orange" onClick={() => window.open(src)}>
            Download
          </Button>
        )}
        {!stringIsEmpty(caption) && userIsUploader && (
          <Button transparent onClick={() => setIsEditing(true)}>
            <Icon icon="pencil-alt" />
            <span style={{ marginLeft: '0.7rem' }}>Edit Caption</span>
          </Button>
        )}
        <Button style={{ marginLeft: '1rem' }} color="blue" onClick={onHide}>
          Close
        </Button>
      </footer>
    </Modal>
  );
}
