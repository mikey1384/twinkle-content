import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import QuestionSlide from './QuestionSlide';
import Carousel from 'components/Carousel';
import StatusMessage from './StatusMessage';
import { scrollElementToCenter } from 'helpers';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useMissionContext, useContentContext } from 'contexts';

const questions = [
  {
    id: 0,
    type: 'fill in the blank',
    question: 'What year did you _____ university?',
    choices: ['graduate by', 'graduate from', 'graduating', 'graduating from'],
    passMessage: `Correct!`,
    failMessage: `Wrong. Correct sentence is "What year did you *graduate* *from* university?"`,
    answerIndex: 1
  },
  {
    id: 1,
    type: 'fill in the blank',
    question:
      'It seems to be getting worse. You had better _____ a specialist.',
    choices: ['consult', 'consult to', 'consult for', 'consult by'],
    passMessage: `Correct!`,
    failMessage: `Wrong. Correct sentence is "It seems to be getting worse. You had better *consult* a specialist."`,
    answerIndex: 0
  },
  {
    id: 2,
    type: 'fill in the blank',
    question: 'Chicago is a large city, _____?',
    choices: [`aren't it`, `doesn't it`, `won't it`, `isn't it`],
    passMessage: `Correct!`,
    failMessage: `Wrong. Correct sentence is "Chicago is a large city, *isn't* *it*."`,
    answerIndex: 3
  },
  {
    id: 3,
    type: 'fill in the blank',
    question: `Don't leave your books near the open fire. They might easily _____.`,
    choices: [
      'catch to fire',
      'catch the fire',
      'catch on fire',
      'catch with fire'
    ],
    passMessage: `Correct!`,
    failMessage: `Wrong. Correct sentence is "Don't leave your books near the open fire. They might easily catch on fire."`,
    answerIndex: 2
  },
  {
    id: 4,
    type: 'fill in the blank',
    question: 'Do you enjoy _____?',
    choices: ['to swim', 'swimming', 'swim', 'to swimming'],
    passMessage: `Correct!`,
    failMessage: `Wrong. Correct sentence is "Do you enjoy *swimming*?"`,
    answerIndex: 1
  },
  {
    id: 5,
    type: 'fill in the blank',
    question: 'I have trouble _____.',
    choices: [
      'to remember my password',
      'to remembering my password',
      'remember my password',
      'remembering my password'
    ],
    passMessage: `Correct!`,
    failMessage: `Wrong. Correct sentence is "I have trouble *remembering* *my* *password*."`,
    answerIndex: 3
  }
];
const questionIds = questions.map((question) => question.id);

Questions.propTypes = {
  mission: PropTypes.object.isRequired,
  onFail: PropTypes.func.isRequired
};

export default function Questions({ mission, onFail }) {
  const { userId } = useMyState();
  const {
    requestHelpers: { uploadMissionAttempt }
  } = useAppContext();
  const {
    actions: { onUpdateMissionAttempt }
  } = useMissionContext();
  const {
    actions: { onChangeUserXP, onUpdateUserCoins }
  } = useContentContext();
  const [questionObj, setQuestionObj] = useState(
    questions.reduce((prev, curr) => {
      const choices = curr.choices.map((choice) => ({
        label: choice,
        checked: false
      }));
      return {
        ...prev,
        [curr.id]: { ...curr, choices, selectedChoiceIndex: null }
      };
    }, {})
  );
  const QuestionsRef = useRef(null);
  const selectedAnswerIndex = useRef(null);
  const statusRef = useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [conditionPassStatus, setConditionPassStatus] = useState('');
  useEffect(() => {
    scrollElementToCenter(QuestionsRef.current, -200);
  }, []);
  const objectiveMessage = useMemo(() => {
    if (questionObj[currentSlideIndex].type === 'fill in the blank') {
      return 'Choose the word or phrase that correctly completes the sentence';
    }
    return '';
  }, [currentSlideIndex, questionObj]);

  return (
    <div ref={QuestionsRef}>
      <Carousel
        allowDrag={false}
        conditionPassStatus={conditionPassStatus}
        progressBar
        slidesToShow={1}
        slidesToScroll={1}
        slideIndex={currentSlideIndex}
        afterSlide={(index) => {
          statusRef.current = null;
          setConditionPassStatus('');
          setCurrentSlideIndex(index);
        }}
        onCheckNavCondition={handleCheckNavCondition}
        title={
          <div
            style={{
              width: '100%',
              textAlign: 'center',
              marginTop: '6rem',
              marginBottom: '-1rem'
            }}
          >
            <h2>{objectiveMessage}</h2>
          </div>
        }
      >
        {questionIds.map((questionId) => (
          <QuestionSlide
            key={questionId}
            question={questionObj[questionId].question}
            choices={questionObj[questionId].choices}
            answerIndex={questionObj[questionId].answerIndex}
            conditionPassStatus={conditionPassStatus}
            onSelectChoice={(selectedIndex) =>
              handleSelectChoice({ selectedIndex, questionId })
            }
          />
        ))}
      </Carousel>
      {conditionPassStatus && (
        <StatusMessage
          status={conditionPassStatus}
          passMessage={questionObj[currentSlideIndex].passMessage}
          failMessage={questionObj[currentSlideIndex].failMessage}
        />
      )}
    </div>
  );

  function handleSelectChoice({ selectedIndex, questionId }) {
    setQuestionObj((questionObj) => ({
      ...questionObj,
      [questionId]: {
        ...questionObj[questionId],
        choices: questionObj[questionId].choices.map((choice, index) =>
          index === selectedIndex
            ? { ...choice, checked: true }
            : { ...choice, checked: false }
        )
      },
      selectedChoiceIndex: selectedIndex
    }));
    selectedAnswerIndex.current = selectedIndex;
  }

  function handleCheckNavCondition(onNext) {
    if (statusRef.current === 'fail') {
      return onFail();
    }
    if (statusRef.current === 'pass') {
      if (currentSlideIndex < questionIds.length - 1) {
        return onNext();
      }
      return handleSuccess();
    }
    statusRef.current =
      questionObj[currentSlideIndex].answerIndex === selectedAnswerIndex.current
        ? 'pass'
        : 'fail';
    setConditionPassStatus(statusRef.current);
  }

  async function handleSuccess() {
    const { success, newXpAndRank, newCoins } = await uploadMissionAttempt({
      missionId: mission.id,
      attempt: { status: 'pass' }
    });
    if (success) {
      onUpdateMissionAttempt({
        missionId: mission.id,
        newState: { status: 'pass' }
      });
      if (newXpAndRank.xp) {
        onChangeUserXP({
          xp: newXpAndRank.xp,
          rank: newXpAndRank.rank,
          userId
        });
      }
      if (newCoins.netCoins) {
        onUpdateUserCoins({ coins: newCoins.netCoins, userId });
      }
    }
  }
}
