import React, { useMemo, useState } from 'react';
import Input from 'components/Texts/Input';
import { css } from 'emotion';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';

export default function GrammarQuestionGenerator() {
  const [leftSideText, setLeftSideText] = useState('');
  const [rightSideText, setRightSideText] = useState('');
  const [correctChoice, setCorrectChoice] = useState('');
  const [wrongChoice1, setWrongChoice1] = useState('');
  const [wrongChoice2, setWrongChoice2] = useState('');
  const [wrongChoice3, setWrongChoice3] = useState('');
  const finalLeftSideText = useMemo(() => {
    return leftSideText;
  }, [leftSideText]);
  const finalRightSideText = useMemo(() => {
    return stringIsEmpty(rightSideText)
      ? '.'
      : !rightSideText || ['.', '?'].includes(rightSideText)
      ? rightSideText
      : ` ${rightSideText}`;
  }, [rightSideText]);

  return (
    <div
      className={css`
        width: 100%;
        display: flex;
        flex-direction: column;
        background: #fff;
        padding: 1rem;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        @media (max-width: ${mobileMaxWidth}) {
          border-radius: 0;
          border-left: 0;
          border-right: 0;
        }
      `}
    >
      <h2>Grammar Question Generator</h2>
      {(!stringIsEmpty(leftSideText) || !stringIsEmpty(rightSideText)) && (
        <div
          style={{
            width: '100%',
            textAlign: 'center',
            marginTop: '5rem',
            fontSize: '2rem'
          }}
        >
          {finalLeftSideText} _____
          {finalRightSideText}
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
          onChange={setLeftSideText}
          placeholder="Enter text that goes to the left side of the blank"
          value={leftSideText}
        />
        <span style={{ margin: '0 1rem' }}>_____</span>
        <Input
          onChange={setRightSideText}
          placeholder="Enter text that goes to the right side of the blank"
          value={rightSideText}
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
          <h3>Enter Correct Choice</h3>
          <Input
            style={{ marginTop: '1rem' }}
            onChange={setCorrectChoice}
            placeholder="Enter correct choice"
            value={correctChoice}
          />
          <h3 style={{ marginTop: '3rem' }}>Enter 3 Wrong Choices</h3>
          <Input
            style={{ marginTop: '1rem' }}
            onChange={setWrongChoice1}
            placeholder="Enter wrong choice"
            value={wrongChoice1}
          />
          <Input
            style={{ marginTop: '1rem' }}
            onChange={setWrongChoice2}
            placeholder="Enter wrong choice"
            value={wrongChoice2}
          />
          <Input
            style={{ marginTop: '1rem' }}
            onChange={setWrongChoice3}
            placeholder="Enter wrong choice"
            value={wrongChoice3}
          />
        </div>
      </div>
    </div>
  );
}
