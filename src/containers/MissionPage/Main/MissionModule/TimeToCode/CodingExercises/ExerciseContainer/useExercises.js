import { useMemo, useState } from 'react';
import exercises from '../exercises';

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
  const passObj = useMemo(() => {
    const result = {};
    for (let key of Object.keys(exercises)) {
      result[key] = state?.missions?.['time-to-code']?.[key] === 'pass';
    }
    return result;
  }, [state?.missions]);

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
    return {
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
    };
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
