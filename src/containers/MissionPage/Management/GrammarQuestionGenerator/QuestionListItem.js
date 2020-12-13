import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';

QuestionListItem.propTypes = {
  question: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function QuestionListItem({ question, style }) {
  const correctAnswer = useMemo(() => {
    return question.choices[question.answerIndex];
  }, [question.answerIndex, question.choices]);
  const wrongChoices = useMemo(() => {
    return question.choices.filter(
      (choice, index) => index !== question.answerIndex
    );
  }, [question.answerIndex, question.choices]);

  return (
    <div
      style={style}
      className={css`
        width: 100%;
        background: #fff;
        border-radius: ${borderRadius};
        padding: 1.5rem 1rem 1.5rem 1rem;
        border: 1px solid ${Color.borderGray()};
        @media (max-width: ${mobileMaxWidth}) {
          border-left: 0;
          border-right: 0;
          border-radius: 0;
        }
      `}
    >
      <div style={{ width: '100%', textAlign: 'center' }}>
        <p style={{ fontSize: '2.2rem', fontWeight: 'bold' }}>
          {question.question}
        </p>
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <div
          className={css`
            > article {
              text-align: center;
              font-weight: bold;
              font-size: 1.9rem;
            }
            p {
              font-size: 1.7rem;
            }
          `}
          style={{ marginTop: '3rem' }}
        >
          <article>Correct Choice</article>
          <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
            <p>{correctAnswer}</p>
          </div>
          <article style={{ marginTop: '3rem' }}>Wrong Choices</article>
          <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
            {wrongChoices.map((choice, index) => (
              <p key={index}>{choice}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
