import React from 'react';
import PropTypes from 'prop-types';

QuestionListItem.propTypes = {
  question: PropTypes.object.isRequired
};

export default function QuestionListItem({ question }) {
  return (
    <div>
      <div>{question.question}</div>
      <div>{question.isApproved}</div>
      {question.choices.map((choice, index) => (
        <div key={index}>{choice}</div>
      ))}
    </div>
  );
}
