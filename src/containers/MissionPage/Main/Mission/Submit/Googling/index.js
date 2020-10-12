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
      {mission.questions.map((question) => (
        <Question key={question.id} question={question} />
      ))}
    </div>
  );
}
