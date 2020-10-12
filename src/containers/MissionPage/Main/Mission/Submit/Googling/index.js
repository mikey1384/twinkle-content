import React from 'react';
import PropTypes from 'prop-types';
import Question from './Question';

Googling.propTypes = {
  mission: PropTypes.object.isRequired,
  style: PropTypes.object
};
export default function Googling({ mission, style }) {
  return (
    <div style={style}>
      {mission.questions.map((question, index) => (
        <Question
          key={question.id}
          question={question}
          style={{
            marginBottom:
              index === mission.questions.length - 1 ? '-1rem' : '2rem'
          }}
        />
      ))}
    </div>
  );
}
