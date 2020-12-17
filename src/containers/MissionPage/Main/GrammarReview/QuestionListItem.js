import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';

QuestionListItem.propTypes = {
  question: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function QuestionListItem({
  question: { question, choices },
  style
}) {
  return (
    <div
      style={style}
      className={css`
        background: #fff;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        padding: 1rem;
        @media (max-width: ${mobileMaxWidth}) {
          border-left: 0;
          border-right: 0;
          border-radius: 0;
        }
      `}
    >
      <div>{question}</div>
      {choices.map((choice) => (
        <div key={choice.id}>{choice}</div>
      ))}
    </div>
  );
}
