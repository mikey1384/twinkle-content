import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Input from 'components/Texts/Input';
import { addEmoji } from 'helpers/stringHelpers';

Editor.propTypes = {
  tutorialPrompt: PropTypes.string,
  tutorialButtonLabel: PropTypes.string
};

export default function Editor({ tutorialPrompt, tutorialButtonLabel }) {
  const [editedTutorialPrompt, setEditedTutorialPrompt] = useState(
    tutorialPrompt || 'Need help?'
  );
  const [editedTutorialButtonLabel, setEditedTutorialButtonLabel] = useState(
    tutorialButtonLabel || 'Start Tutorial'
  );
  return (
    <div>
      <div>
        <Input
          autoFocus
          value={editedTutorialPrompt}
          onChange={(text) => setEditedTutorialPrompt(addEmoji(text))}
          placeholder="Write something"
        />
      </div>
      <div style={{ marginTop: '2rem' }}>
        <Input
          autoFocus
          value={editedTutorialButtonLabel}
          onChange={(text) => setEditedTutorialButtonLabel(text)}
          placeholder="Write something"
        />
      </div>
    </div>
  );
}
