import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import Input from 'components/Texts/Input';
import IconSelectionModal from './IconSelectionModal';
import { Color } from 'constants/css';
import { exceedsCharLimit } from 'helpers/stringHelpers';

GoBackField.propTypes = {
  style: PropTypes.object,
  button: PropTypes.object,
  onSetButtonState: PropTypes.func.isRequired
};

export default function GoBackField({ style, button, onSetButtonState }) {
  const textExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType: 'interactive',
        inputType: 'heading',
        text: button.label
      }),
    [button.label]
  );
  const [iconSelectionModalShown, setIconSelectionModalShown] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        ...style
      }}
    >
      <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
        <div style={{ padding: '1rem 1.5rem 1rem 0' }}>
          <Button
            onClick={() => setIconSelectionModalShown(true)}
            skeuomorphic
            color={button.icon ? 'black' : 'orange'}
          >
            {button.icon ? <Icon icon={button.icon} /> : <Icon icon="plus" />}
          </Button>
        </div>
        <div
          key={button.id}
          style={{
            fontSize: '1.5rem',
            padding: '1rem 2rem',
            display: 'flex',
            flexGrow: 1,
            border: `1px solid ${Color.borderGray()}`
          }}
        >
          <Input
            onChange={(text) => onSetButtonState({ label: text })}
            placeholder="Enter button label..."
            value={button.label}
            style={{ width: '100%', ...textExceedsCharLimit?.style }}
          />
        </div>
        {iconSelectionModalShown && (
          <IconSelectionModal
            selectedIcon={button.icon}
            onSelectIcon={(icon) => onSetButtonState({ icon })}
            onHide={() => setIconSelectionModalShown(false)}
          />
        )}
      </div>
      <div>Destination goes here</div>
    </div>
  );
}
