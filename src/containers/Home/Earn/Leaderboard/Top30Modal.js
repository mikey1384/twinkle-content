import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';

Top30Modal.propTypes = {
  onHide: PropTypes.func.isRequired,
  month: PropTypes.string.isRequired,
  year: PropTypes.string.isRequired
};

export default function Top30Modal({ onHide, month, year }) {
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);

  return (
    <Modal onHide={onHide}>
      <header>{`${month} ${year}`}</header>
      <main style={{ paddingTop: 0 }}></main>
      <footer>
        <Button transparent onClick={onHide}>
          Close
        </Button>
      </footer>
    </Modal>
  );
}
