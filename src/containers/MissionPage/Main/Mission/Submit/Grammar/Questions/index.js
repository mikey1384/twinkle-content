import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import QuestionSlide from './QuestionSlide';
import Carousel from 'components/Carousel';
import StatusMessage from './StatusMessage';
import Loading from 'components/Loading';
import { scrollElementToCenter } from 'helpers';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useMissionContext, useContentContext } from 'contexts';

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
  const [questionIds, setQuestionIds] = useState([]);
  const [questionObj, setQuestionObj] = useState({});
  useEffect(() => {
    if (!mission.questions || mission.questions.length === 0) return;
    const resultObj = mission.questions.reduce((prev, curr, index) => {
      const choices = curr.choices.map((choice) => ({
        label: choice,
        checked: false
      }));
      return {
        ...prev,
        [index]: {
          ...curr,
          choices,
          failMessage: renderFailMessage(),
          selectedChoiceIndex: null
        }
      };

      function renderFailMessage() {
        const answer = curr.choices[curr.answerIndex];
        const answerInBold = answer
          .split(' ')
          .map((word) => `*${word}*`)
          .join(' ');
        return `Wrong. Correct sentence is "${curr.question.replace(
          '_____',
          answerInBold
        )}"`;
      }
    }, {});
    setQuestionObj(resultObj);
    setQuestionIds([...Array(mission.questions.length).keys()]);
  }, [mission.questions]);

  const QuestionsRef = useRef(null);
  const selectedAnswerIndex = useRef(null);
  const statusRef = useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [conditionPassStatus, setConditionPassStatus] = useState('');
  useEffect(() => {
    scrollElementToCenter(QuestionsRef.current, -200);
  }, []);
  const objectiveMessage = useMemo(() => {
    if (questionObj[currentSlideIndex]?.type === 'fill in the blank') {
      return 'Choose the word or phrase that correctly completes the sentence';
    }
    return '';
  }, [currentSlideIndex, questionObj]);

  return (
    <div ref={QuestionsRef}>
      {questionIds.length > 0 ? (
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
      ) : (
        <Loading />
      )}
      {conditionPassStatus && (
        <StatusMessage
          status={conditionPassStatus}
          passMessage="Correct!"
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
