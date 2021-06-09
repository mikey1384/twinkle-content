import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getAstProps } from 'helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useAppContext, useContentContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import exercises from './exercises';
import ExerciseContainer from './ExerciseContainer';

ThirdCodingExercise.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired,
  passed: PropTypes.bool.isRequired,
  style: PropTypes.object
};

export default function ThirdCodingExercise({
  code,
  onSetCode,
  passed,
  style
}) {
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
      title={exercises[2].title}
      instruction={exercises[2].instruction}
      code={code}
      errorMsg={errorMsg}
      initialCode={exercises[2].initialCode}
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
                changeAlertMsg: 'pass'
              }
            }
          }
        })
      }
    />
  );

  function handleRunCode(ast) {
    const jsxElements = getAstProps({ ast, propType: 'JSXOpeningElement' });
    let alertText = '';
    for (let element of jsxElements) {
      if (element.attributes?.length > 0 && element?.name?.name === 'button') {
        for (let attribute of element.attributes) {
          if (
            attribute.name?.name === 'onClick' &&
            attribute?.value?.expression?.body?.callee?.name === 'alert'
          ) {
            alertText =
              attribute?.value?.expression?.body?.arguments?.[0]?.value;
          }
        }
      }
    }
    if (alertText.trim().toLowerCase() === 'Hello world'.toLowerCase()) {
      return handleSuccess();
    }
    if (stringIsEmpty(alertText)) {
      return setErrorMsg(
        `Hmmm... The alert popup does not seem to have any message in it`
      );
    }
    setErrorMsg(
      `The alert message should say, "Hello world," not "${alertText.trim()}"`
    );
  }

  async function handleSuccess() {
    await updateMissionStatus({
      missionType: 'time-to-code',
      newStatus: { changeAlertMsg: 'pass' }
    });
    setSuccess(true);
  }
}
