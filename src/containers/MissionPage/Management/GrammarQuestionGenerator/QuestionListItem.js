import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import Icon from 'components/Icon';
import Button from 'components/Button';
import { useAppContext } from 'contexts';

QuestionListItem.propTypes = {
  onApproveQuestion: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function QuestionListItem({
  onApproveQuestion,
  question,
  style
}) {
  const {
    requestHelpers: { approveGrammarQuestion }
  } = useAppContext();
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
      <div
        style={{
          marginTop: '4rem',
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Button
          style={{
            fontSize: '1.7rem'
          }}
          skeuomorphic
          color="darkerGray"
          onClick={() => console.log('editng')}
        >
          <Icon icon="pencil-alt" />
          <span style={{ marginLeft: '0.7rem' }}>Edit</span>
        </Button>
        {!question.isApproved && (
          <Button
            style={{ fontSize: '1.7rem', marginLeft: '1rem' }}
            skeuomorphic
            color="darkBlue"
            onClick={handleApprove}
          >
            Approve
          </Button>
        )}
      </div>
    </div>
  );

  async function handleApprove() {
    const success = await approveGrammarQuestion(question.id);
    if (success) {
      onApproveQuestion();
    }
  }
}
