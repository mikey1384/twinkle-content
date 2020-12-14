import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { capitalize, stringIsEmpty } from 'helpers/stringHelpers';
import { css } from 'emotion';
import { mobileMaxWidth } from 'constants/css';
import Input from 'components/Texts/Input';

QuestionEditForm.propTypes = {
  correctChoice: PropTypes.string.isRequired,
  leftSideText: PropTypes.string.isRequired,
  rightSideText: PropTypes.string.isRequired,
  wrongChoice1: PropTypes.string.isRequired,
  wrongChoice2: PropTypes.string.isRequired,
  wrongChoice3: PropTypes.string.isRequired
};

export default function QuestionEditForm({
  correctChoice,
  leftSideText,
  rightSideText,
  wrongChoice1,
  wrongChoice2,
  wrongChoice3
}) {
  const [editedLeftSideText, setEditedLeftSideText] = useState(
    leftSideText.trim()
  );
  const [editedRightSideText, setEditedRightSideText] = useState(
    rightSideText.trim()
  );
  const [editedCorrectChoice, setEditedCorrectChoice] = useState(correctChoice);
  const [editedWrongChoice1, setEditedWrongChoice1] = useState(wrongChoice1);
  const [editedWrongChoice2, setEditedWrongChoice2] = useState(wrongChoice2);
  const [editedWrongChoice3, setEditedWrongChoice3] = useState(wrongChoice3);

  const finalLeftSideText = useMemo(() => {
    return capitalize(editedLeftSideText.trim());
  }, [editedLeftSideText]);
  const finalRightSideText = useMemo(() => {
    if (stringIsEmpty(editedRightSideText)) {
      return '.';
    }
    if (!editedRightSideText || ['.', '?', '!'].includes(editedRightSideText)) {
      return editedRightSideText;
    }
    const trimmedRightSideText = editedRightSideText.trim();
    if (
      /^[a-zA-Z]+$/i.test(trimmedRightSideText[trimmedRightSideText.length - 1])
    ) {
      return `${trimmedRightSideText}.`;
    }
    return trimmedRightSideText;
  }, [editedRightSideText]);

  return (
    <div>
      {(!stringIsEmpty(editedLeftSideText) ||
        !stringIsEmpty(editedRightSideText)) && (
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            fontSize: '2rem'
          }}
        >
          {finalLeftSideText} _____
          {['.', '?', '!'].includes(finalRightSideText)
            ? finalRightSideText
            : ` ${finalRightSideText}`}
        </div>
      )}
      <div
        className={css`
          margin-top: 2rem;
          display: flex;
          justify-content: center;
          align-items: flex-end;
          font-size: 1.5rem;
        `}
      >
        <Input
          onChange={setEditedLeftSideText}
          placeholder="Enter text that goes to the left side of the blank"
          value={editedLeftSideText}
        />
        <span style={{ margin: '0 1rem' }}>_____</span>
        <Input
          onChange={setEditedRightSideText}
          placeholder="Enter text that goes to the right side of the blank"
          value={editedRightSideText}
        />
      </div>
      <div
        style={{
          marginTop: '3rem',
          display: 'flex',
          width: '100%',
          justifyContent: 'center'
        }}
      >
        <div
          className={css`
            width: 50%;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
            }
          `}
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <h3>Enter the correct choice</h3>
          <Input
            style={{ marginTop: '1rem' }}
            onChange={setEditedCorrectChoice}
            placeholder="Enter the correct choice"
            value={editedCorrectChoice}
          />
          <h3 style={{ marginTop: '3rem' }}>Enter 3 wrong choices</h3>
          <Input
            style={{ marginTop: '1rem' }}
            onChange={setEditedWrongChoice1}
            placeholder="Enter a wrong choice"
            value={editedWrongChoice1}
          />
          <Input
            style={{ marginTop: '1rem' }}
            onChange={setEditedWrongChoice2}
            placeholder="Enter a wrong choice"
            value={editedWrongChoice2}
          />
          <Input
            style={{ marginTop: '1rem' }}
            onChange={setEditedWrongChoice3}
            placeholder="Enter a wrong choice"
            value={editedWrongChoice3}
          />
        </div>
      </div>
    </div>
  );
}
