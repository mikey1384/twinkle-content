import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Texts/Input';
import Button from 'components/Button';
import { css } from '@emotion/css';
import { addEmoji } from 'helpers/stringHelpers';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';

Editor.propTypes = {
  onClose: PropTypes.func.isRequired,
  tutorialPrompt: PropTypes.string,
  tutorialButtonLabel: PropTypes.string
};

export default function Editor({
  onClose,
  tutorialPrompt,
  tutorialButtonLabel
}) {
  const [editedTutorialPrompt, setEditedTutorialPrompt] = useState(
    tutorialPrompt || 'Need help?'
  );
  const [editedTutorialButtonLabel, setEditedTutorialButtonLabel] = useState(
    tutorialButtonLabel || 'Start Tutorial'
  );
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        marginBottom: '-1rem'
      }}
    >
      <div
        className={css`
          width: 50%;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
      >
        <Input
          autoFocus
          value={editedTutorialPrompt}
          onChange={(text) => setEditedTutorialPrompt(addEmoji(text))}
          placeholder="Write something"
        />
      </div>
      <div
        style={{
          marginTop: '2rem',
          border: `1px solid ${Color.borderGray()}`,
          borderRadius,
          padding: '1rem'
        }}
      >
        <Input
          autoFocus
          style={{ maxWidth: '13rem' }}
          value={editedTutorialButtonLabel}
          onChange={(text) => setEditedTutorialButtonLabel(text)}
          placeholder="Write something"
        />
      </div>
      <div style={{ display: 'flex', marginTop: '2rem' }}>
        <Button color="blue" onClick={handleDone}>
          Done
        </Button>
        <Button style={{ marginLeft: '1rem' }} transparent onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );

  async function handleDone() {
    console.log('done');
    onClose();
  }
}
