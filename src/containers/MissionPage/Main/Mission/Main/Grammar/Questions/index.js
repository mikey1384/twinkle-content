import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import StatusMessage from './StatusMessage';
import Loading from 'components/Loading';
import QuestionCarousel from './QuestionCarousel';
import { useMyState } from 'helpers/hooks';
import { useAppContext, useMissionContext, useContentContext } from 'contexts';

Questions.propTypes = {
  isRepeating: PropTypes.bool,
  mission: PropTypes.object.isRequired,
  onFail: PropTypes.func.isRequired
};

export default function Questions({ isRepeating, mission, onFail }) {
  const mounted = useRef(true);
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const { userId } = useMyState();
  const [repeatMissionComplete, setRepeatMissionComplete] = useState(false);
  const {
    requestHelpers: {
      updateUserCoins,
      updateUserXP,
      uploadMissionAttempt,
      uploadGrammarAttempt
    }
  } = useAppContext();
  const {
    actions: { onUpdateMissionAttempt, onSetMissionState }
  } = useMissionContext();
  const {
    actions: { onChangeUserXP, onUpdateUserCoins }
  } = useContentContext();
  const [questionIds, setQuestionIds] = useState([]);
  const [questionObj, setQuestionObj] = useState({});
  useEffect(() => {
    mounted.current = true;
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

  const selectedAnswerIndex = useRef(null);
  const statusRef = useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [conditionPassStatus, setConditionPassStatus] = useState('');
  const objectiveMessage = useMemo(() => {
    if (questionObj[currentSlideIndex]?.type === 'fill in the blank') {
      return 'Choose the word or phrase that correctly completes the sentence';
    }
    return '';
  }, [currentSlideIndex, questionObj]);

  useEffect(() => {
    return function onDismount() {
      mounted.current = false;
    };
  }, []);

  return (
    <div>
      {questionIds.length > 0 ? (
        <QuestionCarousel
          conditionPassStatus={
            repeatMissionComplete ? 'complete' : conditionPassStatus
          }
          currentSlideIndex={currentSlideIndex}
          onAfterSlide={(index) => {
            statusRef.current = null;
            setConditionPassStatus('');
            setCurrentSlideIndex(index);
          }}
          onCheckNavCondition={handleCheckNavCondition}
          objectiveMessage={objectiveMessage}
          questionIds={questionIds}
          questionObj={questionObj}
          onSelectChoice={handleSelectChoice}
          submitDisabled={submitDisabled}
        />
      ) : (
        <Loading />
      )}
      {conditionPassStatus && (
        <StatusMessage
          mission={mission}
          missionComplete={repeatMissionComplete}
          status={conditionPassStatus}
          passMessage="Correct!"
          failMessage={questionObj[currentSlideIndex].failMessage}
          onBackToStart={() =>
            onSetMissionState({
              missionId: mission.id,
              newState: { started: false }
            })
          }
        />
      )}
    </div>
  );

  function handleSelectChoice({ selectedIndex, questionId }) {
    if (!statusRef.current) {
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
    uploadGrammarAttempt({
      result: statusRef.current,
      questionId: questionObj[currentSlideIndex].id
    });
    setConditionPassStatus(statusRef.current);
  }

  async function handleSuccess() {
    setSubmitDisabled(true);
    if (isRepeating) {
      const coins = await updateUserCoins({
        action: 'repeat',
        target: 'mission',
        amount: mission.repeatCoinReward,
        targetId: mission.id,
        type: 'increase'
      });
      const { xp, rank } = await updateUserXP({
        amount: mission.repeatXpReward,
        action: 'repeat',
        target: 'mission',
        targetId: mission.id,
        type: 'increase'
      });
      if (mounted.current) {
        onUpdateUserCoins({ coins, userId });
        onChangeUserXP({ xp, rank, userId });
        setRepeatMissionComplete(true);
      }
    } else {
      const { success, newXpAndRank, newCoins } = await uploadMissionAttempt({
        missionId: mission.id,
        attempt: { status: 'pass' }
      });
      if (success && mounted.current) {
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
        onSetMissionState({
          missionId: mission.id,
          newState: { started: false }
        });
      }
    }
    if (mounted.current) {
      setSubmitDisabled(false);
    }
  }
}
