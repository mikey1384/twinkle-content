import React from 'react';
import PropTypes from 'prop-types';

QuestionListItem.propTypes = {
  question: PropTypes.object.isRequired
};

export default function QuestionListItem({ question }) {
  return (
    <div>
      <div>{question.content}</div>
      <div>{question.isApproved}</div>
    </div>
  );
}
