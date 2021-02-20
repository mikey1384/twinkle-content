import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Color } from 'constants/css';
import { addEmoji, exceedsCharLimit } from 'helpers/stringHelpers';
import { useMyState } from 'helpers/hooks';
import Icon from 'components/Icon';
import Button from 'components/Button';
import Textarea from 'components/Texts/Textarea';

SecretMessageInput.propTypes = {
  secretAnswer: PropTypes.string,
  onSetSecretAnswer: PropTypes.func.isRequired
};

export default function SecretMessageInput({
  secretAnswer,
  onSetSecretAnswer
}) {
  const { profileTheme } = useMyState();
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
      <div style={{ width: '100%', display: 'flex' }}>
        <div style={{ flexGrow: 1 }}>
          <Textarea
            autoFocus
            style={{
              marginTop: '0.5rem',
              ...(secretAnswerExceedsCharLimit || null)
            }}
            value={secretAnswer}
            minRows={4}
            placeholder="Enter the Secret Message"
            onChange={(event) =>
              onSetSecretAnswer(addEmoji(event.target.value))
            }
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
        <div style={{ marginLeft: '1rem' }}>
          <Button
            skeuomorphic
            color={profileTheme}
            onClick={() => console.log('clicked')}
          >
            <Icon size="lg" icon="plus" />
          </Button>
        </div>
      </div>
    </div>
  );
}
