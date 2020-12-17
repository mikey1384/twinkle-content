import React from 'react';
import PropTypes from 'prop-types';

QuestionListItem.propTypes = {
  question: PropTypes.object.isRequired
};

export default function QuestionListItem({ question: { question, choices } }) {
  return (
    <div>
      <div>{question}</div>
      {choices.map((choice) => (
        <div key={choice.id}>{choice}</div>
      ))}
    </div>
  );
}
