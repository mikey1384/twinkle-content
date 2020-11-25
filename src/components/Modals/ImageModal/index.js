import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Modal from 'components/Modal';
import Caption from './Caption';

ImageModal.propTypes = {
  caption: PropTypes.string,
  downloadable: PropTypes.bool,
  modalOverModal: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
  fileName: PropTypes.string,
  src: PropTypes.string
};

export default function ImageModal({
  caption,
  modalOverModal,
  onHide,
  fileName,
  src,
  downloadable = true
}) {
  return (
    <Modal modalOverModal={modalOverModal} large onHide={onHide}>
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
        <Button style={{ marginLeft: '1rem' }} color="blue" onClick={onHide}>
          Close
        </Button>
      </footer>
    </Modal>
  );
}
