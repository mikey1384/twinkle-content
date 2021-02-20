import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import { addEmoji, exceedsCharLimit } from 'helpers/stringHelpers';
import Textarea from 'components/Texts/Textarea';

SecretMessageInput.propTypes = {
  secretAnswer: PropTypes.string,
  onSetSecretAnswer: PropTypes.func.isRequired
};

export default function SecretMessageInput({
  secretAnswer,
  onSetSecretAnswer
}) {
  const secretAnswerExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType: 'subject',
        inputType: 'description',
        text: secretAnswer
      }),
    [secretAnswer]
  );

  return (
    <div style={{ marginTop: '0.5rem' }}>
      <span
        style={{
          fontWeight: 'bold',
          fontSize: '2rem',
          color: Color.darkerGray()
        }}
      >
        Secret Message
      </span>
      <Textarea
        autoFocus
        style={{
          marginTop: '0.5rem',
          ...(secretAnswerExceedsCharLimit || null)
        }}
        value={secretAnswer}
        minRows={4}
        placeholder="Enter the Secret Message"
        onChange={(event) => onSetSecretAnswer(addEmoji(event.target.value))}
        onKeyUp={(event) => {
          if (event.key === ' ') {
            onSetSecretAnswer(addEmoji(event.target.value));
          }
        }}
      />
      {secretAnswerExceedsCharLimit && (
        <small style={{ color: 'red' }}>
          {secretAnswerExceedsCharLimit.message}
        </small>
      )}
    </div>
  );
}
