import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getAstProps } from 'helpers';
import { useAppContext, useContentContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import ExerciseContainer from './ExerciseContainer';

FirstCodingExercise.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired,
  passed: PropTypes.bool.isRequired
};

export default function FirstCodingExercise({ code, onSetCode, passed }) {
  const {
    requestHelpers: { updateMissionStatus }
  } = useAppContext();
  const {
    actions: { onUpdateProfileInfo }
  } = useContentContext();
  const { userId, state = {} } = useMyState();
  const [success, setSuccess] = useState();
  const [errorMsg, setErrorMsg] = useState('');

  return (
    <ExerciseContainer
      passed={passed}
      index={0}
      code={code}
      errorMsg={errorMsg}
      onSetCode={onSetCode}
      onSetErrorMsg={setErrorMsg}
      onRunCode={handleRunCode}
      success={success}
      onNextClick={() =>
        onUpdateProfileInfo({
          userId,
          state: {
            ...state,
            missions: {
              ...state.missions,
              'time-to-code': {
                ...state.missions?.['time-to-code'],
                changeButtonColor: 'pass'
              }
            }
          }
        })
      }
    />
  );

  function handleRunCode(ast) {
    const jsxElements = getAstProps({ ast, propType: 'JSXOpeningElement' });
    let buttonColor = '';
    for (let element of jsxElements) {
      if (element.attributes?.length > 0 && element?.name?.name === 'button') {
        for (let attribute of element.attributes) {
          if (attribute?.name?.name === 'style') {
            const styleProps = attribute?.value?.expression?.properties;
            for (let prop of styleProps) {
              if (
                prop?.key?.name === 'background' ||
                prop?.key?.name === 'backgroundColor'
              ) {
                buttonColor = prop?.value?.value;
                break;
              }
            }
          }
        }
      }
    }
    if (
      buttonColor === 'blue' ||
      buttonColor.toLowerCase() === '#0000ff' ||
      buttonColor === 'rgb(0, 0, 255)'
    ) {
      return handleSuccess();
    }
    if (!buttonColor) {
      return setErrorMsg(
        <>
          Please change the color of the button to{' '}
          <span style={{ color: 'blue' }}>blue</span>
        </>
      );
    }
    setErrorMsg(
      <>
        The {`button's`} color needs to be{' '}
        <span style={{ color: 'blue' }}>blue,</span> not {buttonColor}
      </>
    );
  }

  async function handleSuccess() {
    await updateMissionStatus({
      missionType: 'time-to-code',
      newStatus: { changeButtonColor: 'pass' }
    });
    setSuccess(true);
  }
}
