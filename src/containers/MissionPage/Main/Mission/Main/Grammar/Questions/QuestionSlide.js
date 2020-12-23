import React from 'react';
import PropTypes from 'prop-types';
import ChoiceList from './ChoiceList';
import { borderRadius, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

QuestionSlide.propTypes = {
  answerIndex: PropTypes.number,
  conditionPassStatus: PropTypes.string,
  question: PropTypes.string.isRequired,
  choices: PropTypes.array.isRequired,
  onSelectChoice: PropTypes.func.isRequired
};

export default function QuestionSlide({
  answerIndex,
  conditionPassStatus,
  question,
  choices,
  onSelectChoice
}) {
  return (
    <div
      className={css`
        width: 100%;
        padding: 2rem 1rem 3rem 1rem;
        border-radius: ${borderRadius};
        @media (max-width: ${mobileMaxWidth}) {
          padding-bottom: 0;
        }
      `}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div
          className={css`
            width: 80%;
            display: flex;
            flex-direction: column;
            margin-top: 3rem;
            @media (max-width: ${mobileMaxWidth}) {
              > h3 {
                font-size: 1.8rem;
              }
            }
          `}
        >
          <h3>{question}</h3>
          <ChoiceList
            style={{ marginTop: '2rem', fontSize: '1.6rem' }}
            answerIndex={answerIndex}
            conditionPassStatus={conditionPassStatus}
            onSelect={onSelectChoice}
            listItems={choices}
          />
        </div>
      </div>
    </div>
  );
}
