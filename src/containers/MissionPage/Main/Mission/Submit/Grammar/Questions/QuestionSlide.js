import React from 'react';
import PropTypes from 'prop-types';
import CheckListGroup from 'components/CheckListGroup';
import { borderRadius } from 'constants/css';

QuestionSlide.propTypes = {
  question: PropTypes.string.isRequired,
  choices: PropTypes.array.isRequired,
  onSelectChoice: PropTypes.func.isRequired
};

export default function QuestionSlide({ question, choices, onSelectChoice }) {
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
          <CheckListGroup
            style={{ marginTop: '2rem', fontSize: '1.6rem' }}
            onSelect={onSelectChoice}
            listItems={choices}
          />
        </div>
      </div>
    </div>
  );
}
