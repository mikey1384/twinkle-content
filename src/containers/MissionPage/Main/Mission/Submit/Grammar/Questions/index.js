import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import QuestionSlide from './QuestionSlide';
import Carousel from 'components/Carousel';
import StatusMessage from './StatusMessage';
import { scrollElementToCenter } from 'helpers';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useMissionContext, useContentContext } from 'contexts';

const questionIds = [0, 1, 2, 3, 4, 5];

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
  const [questionObj, setQuestionObj] = useState({
    0: {
      id: 0,
      objective:
        'Choose the word or phrase that correctly completes the sentence',
      question: 'What year did you _____ university?',
      choices: [
        { label: 'graduate by', checked: false },
        { label: 'graduate from', checked: false },
        { label: 'graduating', checked: false },
        { label: 'graduating from', checked: false }
      ],
      passMessage: `Correct!`,
      failMessage: `Wrong. Correct sentence is "What year did you *graduate* *from* university?"`,
      answerIndex: 1,
      selectedChoiceIndex: null
    },
    1: {
      id: 1,
      objective:
        'Choose the word or phrase that correctly completes the sentence',
      question:
        'It seems to be getting worse. You had better _____ a specialist.',
      choices: [
        { label: 'consult', checked: false },
        { label: 'consult to', checked: false },
        { label: 'consult for', checked: false },
        { label: 'consult by', checked: false }
      ],
      passMessage: `Correct!`,
      failMessage: `Wrong. Correct sentence is "It seems to be getting worse. You had better *consult* a specialist."`,
      answerIndex: 0,
      selectedChoiceIndex: null
    },
    2: {
      id: 2,
      objective:
        'Choose the word or phrase that correctly completes the sentence',
      question: 'Chicago is a large city, _____?',
      choices: [
        { label: `aren't it`, checked: false },
        { label: `doesn't it`, checked: false },
        { label: `won't it`, checked: false },
        { label: `isn't it`, checked: false }
      ],
      passMessage: `Correct!`,
      failMessage: `Wrong. Correct sentence is "Chicago is a large city, *isn't* *it*."`,
      answerIndex: 3,
      selectedChoiceIndex: null
    },
    3: {
      id: 3,
      objective:
        'Choose the word or phrase that correctly completes the sentence',
      question: `Don't leave your books near the open fire. They might easily _____.`,
      choices: [
        { label: 'catch to fire', checked: false },
        { label: 'catch the fire', checked: false },
        { label: 'catch on fire', checked: false },
        { label: 'catch with fire', checked: false }
      ],
      passMessage: `Correct!`,
      failMessage: `Wrong. Correct sentence is "Don't leave your books near the open fire. They might easily catch on fire."`,
      answerIndex: 2,
      selectedChoiceIndex: null
    },
    4: {
      id: 4,
      objective:
        'Choose the word or phrase that correctly completes the sentence',
      question: 'Do you enjoy _____?',
      choices: [
        { label: 'to swim', checked: false },
        { label: 'swimming', checked: false },
        { label: 'swim', checked: false },
        { label: 'to swimming', checked: false }
      ],
      passMessage: `Correct!`,
      failMessage: `Wrong. Correct sentence is "Do you enjoy *swimming*?"`,
      answerIndex: 1,
      selectedChoiceIndex: null
    },
    5: {
      id: 5,
      objective:
        'Choose the word or phrase that correctly completes the sentence',
      question: 'I have trouble _____.',
      choices: [
        { label: 'to remember my password', checked: false },
        { label: 'to remembering my password', checked: false },
        { label: 'remember my password', checked: false },
        { label: 'remembering my password', checked: false }
      ],
      passMessage: `Correct!`,
      failMessage: `Wrong. Correct sentence is "I have trouble *remembering* *my* *password*."`,
      answerIndex: 3,
      selectedChoiceIndex: null
    }
  });
  const QuestionsRef = useRef(null);
  const selectedAnswerIndex = useRef(null);
  const statusRef = useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [conditionPassStatus, setConditionPassStatus] = useState('');
  useEffect(() => {
    scrollElementToCenter(QuestionsRef.current, -200);
  }, []);

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
            <h2>{questionObj[currentSlideIndex].objective}</h2>
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
