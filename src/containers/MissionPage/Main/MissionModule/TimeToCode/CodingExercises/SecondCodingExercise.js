import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getAstProps } from 'helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useAppContext, useContentContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import useExercises from './useExercises';
import ExerciseContainer from './ExerciseContainer';

SecondCodingExercise.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired,
  passed: PropTypes.bool.isRequired,
  style: PropTypes.object
};

export default function SecondCodingExercise({
  code,
  onSetCode,
  passed,
  style
}) {
  const exercises = useExercises();
  const {
    requestHelpers: { updateMissionStatus }
  } = useAppContext();
  const {
    actions: { onUpdateProfileInfo }
  } = useContentContext();
  const { userId, state = {} } = useMyState();
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  return (
    <ExerciseContainer
      passed={passed}
      index={1}
      code={code}
      errorMsg={errorMsg}
      onSetCode={onSetCode}
      onSetErrorMsg={setErrorMsg}
      onRunCode={handleRunCode}
      success={success}
      style={style}
      onNextClick={() =>
        onUpdateProfileInfo({
          userId,
          state: {
            ...state,
            missions: {
              ...state.missions,
              'time-to-code': {
                ...state.missions?.['time-to-code'],
                changeButtonLabel: 'pass'
              }
            }
          }
        })
      }
    />
  );

  function handleRunCode(ast) {
    const jsxElements = getAstProps({ ast, propType: 'JSXElement' });
    let buttonText = '';
    for (let element of jsxElements) {
      if (
        element.openingElement?.name?.name === 'button' &&
        element?.children
      ) {
        for (let child of element?.children) {
          buttonText = child?.value || '';
        }
      }
    }
    if (
      buttonText.trim().toLowerCase() ===
      exercises[1].BUTTON_LABEL.toLowerCase()
    ) {
      return handleSuccess();
    }
    if (stringIsEmpty(buttonText)) {
      return setErrorMsg(`Hmmm... The button doesn't seem to have any label`);
    }
    setErrorMsg(
      `The button's label needs to be "${
        exercises[1].BUTTON_LABEL
      }," not "${buttonText.trim()}"`
    );
  }

  async function handleSuccess() {
    await updateMissionStatus({
      missionType: 'time-to-code',
      newStatus: { changeButtonLabel: 'pass' }
    });
    setSuccess(true);
  }
}
