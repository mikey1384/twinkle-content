import React from 'react';
import PropTypes from 'prop-types';
import CheckListGroup from 'components/CheckListGroup';
import { borderRadius } from 'constants/css';

QuestionSlide.propTypes = {
  choices: PropTypes.array.isRequired
};

export default function QuestionSlide({ choices }) {
  return (
    <div
      style={{
        width: '100%',
        padding: '2rem 2rem 3rem 2rem',
        borderRadius
      }}
    >
      <div style={{ width: '100%' }}>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <h3>What year did you _____ university?</h3>
        </div>
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            marginTop: '3rem'
          }}
        >
          <CheckListGroup
            style={{ marginTop: '1.5rem', width: '80%', fontSize: '1.6rem' }}
            onSelect={(index) => console.log(index)}
            listItems={choices}
          />
        </div>
      </div>
    </div>
  );
}
