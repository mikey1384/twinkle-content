import React from 'react';
import PropTypes from 'prop-types';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

QuestionListItem.propTypes = {
  question: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function QuestionListItem({ question, style }) {
  return (
    <div
      style={style}
      className={css`
        width: 100%;
        background: #fff;
        border-radius: ${borderRadius};
        padding: 1rem;
        border: 1px solid ${Color.borderGray()};
        @media (max-width: ${mobileMaxWidth}) {
          border-left: 0;
          border-right: 0;
          border-radius: 0;
        }
      `}
    >
      <div>{question.question}</div>
      <div>{question.isApproved}</div>
      {question.choices.map((choice, index) => (
        <div key={index}>{choice}</div>
      ))}
    </div>
  );
}
