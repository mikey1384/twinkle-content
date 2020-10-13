import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Question from './Question';

Googling.propTypes = {
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired,
  style: PropTypes.object
};
export default function Googling({ mission, onSetMissionState, style }) {
  const [answers, setAnswers] = useState(mission.answers || {});
  const answersRef = useRef(mission.answers || {});

  useEffect(() => {
    return function onUnmount() {
      onSetMissionState({
        missionId: mission.id,
        newState: { answers: answersRef.current }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={style}>
      {mission.questions.map((question, index) => (
        <Question
          key={question.id}
          question={question}
          answer={answers[question.id] || ''}
          onInputChange={(text) =>
            handleSetAnswers({ questionId: question.id, answer: text })
          }
          style={{
            marginBottom:
              index === mission.questions.length - 1 ? '-1rem' : '2rem'
          }}
        />
      ))}
    </div>
  );

  function handleSetAnswers({ questionId, answer }) {
    setAnswers((answers) => ({
      ...answers,
      [questionId]: answer
    }));
    answersRef.current = {
      ...answersRef.current,
      [questionId]: answer
    };
  }
}
