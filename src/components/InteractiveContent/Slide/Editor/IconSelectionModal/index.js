import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import IconMenu from './IconMenu';
import { isEqual } from 'lodash';

IconSelectionModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  onSelectIcon: PropTypes.func.isRequired,
  selectedIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.array])
};

export default function IconSelectionModal({
  onHide,
  onSelectIcon,
  selectedIcon: prevSelectedIcon
}) {
  const [selectedIcon, setSelectedIcon] = useState(prevSelectedIcon);
  return (
    <Modal onHide={onHide}>
      <header>Select an icon</header>
      <main>
        <IconMenu
          selectedIcon={selectedIcon}
          onSelectIcon={(icon) =>
            setSelectedIcon((prevIcon) => {
              if (isEqual(prevIcon, icon)) return null;
              return icon;
            })
          }
        />
      </main>
      <footer>
        <Button transparent onClick={onHide} style={{ marginRight: '0.7rem' }}>
          Cancel
        </Button>
        <Button
          color="blue"
          onClick={() => {
            onSelectIcon(selectedIcon);
            onHide();
          }}
        >
          Done
        </Button>
      </footer>
    </Modal>
  );
}
