import { useMemo, useState } from 'react';
import { BUTTON_LABEL, ALERT_MSG } from './constants';
import exercises from './exercises';

export default function useExercises({
  codeObj,
  exerciseKey,
  prevExerciseKey,
  state = {},
  onUpdateProfileInfo,
  onSetCode,
  userId,
  updateMissionStatus
} = {}) {
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState();
  const firstExercisePassed = useMemo(
    () => state?.missions?.['time-to-code']?.changeButtonColor === 'pass',
    [state?.missions]
  );
  const secondExercisePassed = useMemo(
    () => state?.missions?.['time-to-code']?.changeButtonLabel === 'pass',
    [state?.missions]
  );
  const thirdExercisePassed = useMemo(
    () => state?.missions?.['time-to-code']?.changeAlertMsg === 'pass',
    [state?.missions]
  );

  const passObj = useMemo(
    () => ({
      changeButtonColor: firstExercisePassed,
      changeButtonLabel: secondExercisePassed,
      changeAlertMsg: thirdExercisePassed
    }),
    [firstExercisePassed, secondExercisePassed, thirdExercisePassed]
  );

  const passed = useMemo(() => {
    return passObj[exerciseKey];
  }, [exerciseKey, passObj]);

  const prevPassed = useMemo(() => {
    if (!prevExerciseKey) {
      return true;
    }
    return passObj[prevExerciseKey];
  }, [passObj, prevExerciseKey]);

  const exercise = useMemo(() => {
    const exerciseObj = {
      changeButtonColor: {
        title: exercises[exerciseKey].title,
        code: codeObj?.[exerciseKey],
        initialCode: exercises[exerciseKey].initialCode,
        instruction: exercises[exerciseKey].instruction,
        onNextClick: handleNextClick,
        onSetCode: handleSetCode,
        onRunCode: (ast) =>
          exercises[exerciseKey].onRunCode({
            ast,
            onSetErrorMsg: setErrorMsg,
            onUpdateMissionStatus: handleUpdateMissionStatus
          })
      },
      changeButtonLabel: {
        BUTTON_LABEL,
        title: exercises[exerciseKey].title,
        code: codeObj?.[exerciseKey],
        initialCode: exercises[exerciseKey].initialCode,
        instruction: exercises[exerciseKey].instruction,
        onNextClick: handleNextClick,
        onSetCode: handleSetCode,
        onRunCode: (ast) =>
          exercises[exerciseKey].onRunCode({
            ast,
            onSetErrorMsg: setErrorMsg,
            onUpdateMissionStatus: handleUpdateMissionStatus
          })
      },
      changeAlertMsg: {
        ALERT_MSG,
        title: exercises[exerciseKey].title,
        code: codeObj?.[exerciseKey],
        initialCode: exercises[exerciseKey].initialCode,
        instruction: exercises[exerciseKey].instruction,
        onNextClick: handleNextClick,
        onSetCode: handleSetCode,
        onRunCode: (ast) =>
          exercises[exerciseKey].onRunCode({
            ast,
            onSetErrorMsg: setErrorMsg,
            onUpdateMissionStatus: handleUpdateMissionStatus
          })
      }
    };
    return exerciseObj[exerciseKey];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [codeObj, exerciseKey, userId]);

  return {
    passed,
    prevPassed,
    errorMsg,
    setErrorMsg,
    exercise,
    success
  };

  function handleNextClick() {
    onUpdateProfileInfo({
      userId,
      state: {
        ...state,
        missions: {
          ...state.missions,
          'time-to-code': {
            ...state.missions?.['time-to-code'],
            [exerciseKey]: 'pass'
          }
        }
      }
    });
  }

  function handleSetCode(code) {
    onSetCode({ code, exerciseLabel: exerciseKey });
  }

  async function handleUpdateMissionStatus() {
    await updateMissionStatus({
      missionType: 'time-to-code',
      newStatus: { [exerciseKey]: 'pass' }
    });
    setSuccess(true);
  }
}
