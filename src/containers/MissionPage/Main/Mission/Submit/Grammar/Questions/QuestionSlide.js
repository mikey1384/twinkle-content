import React from 'react';
import PropTypes from 'prop-types';
import ChoiceList from './ChoiceList';
import { borderRadius } from 'constants/css';

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
      style={{
        width: '100%',
        padding: '2rem 1rem 3rem 1rem',
        borderRadius
      }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            width: '80%',
            display: 'flex',
            flexDirection: 'column',
            marginTop: '3rem'
          }}
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
