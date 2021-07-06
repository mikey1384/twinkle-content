import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';

ConfirmModal.propTypes = {
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  disabled: PropTypes.bool,
  descriptionFontSize: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  modalOverModal: PropTypes.bool,
  onHide: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired
};

export default function ConfirmModal({
  disabled = false,
  description = 'Are you sure?',
  descriptionFontSize = '3rem',
  modalOverModal,
  onHide,
  title,
  onConfirm
}) {
  const [submitting, setSubmitting] = useState(false);
  return (
    <Modal modalOverModal={modalOverModal} onHide={onHide}>
      <header>{title}</header>
      <main style={{ fontSize: descriptionFontSize, paddingTop: 0 }}>
        {description}
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Cancel
        </Button>
        <Button
          disabled={submitting || disabled}
          color="blue"
          onClick={handleConfirm}
        >
          Confirm
        </Button>
      </footer>
    </Modal>
  );

  function handleConfirm() {
    setSubmitting(true);
    onConfirm();
  }
}
