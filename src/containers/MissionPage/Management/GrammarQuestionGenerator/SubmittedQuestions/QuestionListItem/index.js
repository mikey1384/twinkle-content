import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Button from 'components/Button';
import QuestionContent from './QuestionContent';
import QuestionEditForm from './QuestionEditForm';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { css } from 'emotion';
import { useAppContext } from 'contexts';

QuestionListItem.propTypes = {
  onApproveQuestion: PropTypes.func.isRequired,
  onEditQuestion: PropTypes.func.isRequired,
  onSetIsEditing: PropTypes.func.isRequired,
  question: PropTypes.object.isRequired,
  style: PropTypes.object
};

export default function QuestionListItem({
  onApproveQuestion,
  onEditQuestion,
  onSetIsEditing,
  question,
  style
}) {
  const {
    requestHelpers: { approveGrammarQuestion }
  } = useAppContext();
  const correctChoice = useMemo(() => {
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
      {question.isEditing ? (
        <QuestionEditForm
          onEditQuestion={onEditQuestion}
          correctChoice={correctChoice}
          leftSideText={question.question.split('_____')[0]}
          rightSideText={question.question.split('_____')[1]}
          wrongChoice1={wrongChoices[0]}
          wrongChoice2={wrongChoices[1]}
          wrongChoice3={wrongChoices[2]}
          questionId={question.id}
          onCancel={() => onSetIsEditing(false)}
        />
      ) : (
        <QuestionContent
          correctChoice={correctChoice}
          wrongChoices={wrongChoices}
          question={question}
        />
      )}
      {!question.isEditing && (
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
            onClick={() => onSetIsEditing(true)}
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
      )}
    </div>
  );

  async function handleApprove() {
    const success = await approveGrammarQuestion(question.id);
    if (success) {
      onApproveQuestion();
    }
  }
}
