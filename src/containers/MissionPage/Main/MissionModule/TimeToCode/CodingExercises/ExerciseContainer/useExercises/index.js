import React, { useMemo, useState } from 'react';
import { getAstProps } from 'helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';
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
        async onRunCode(ast) {
          const jsxElements = getAstProps({
            ast,
            propType: 'JSXOpeningElement'
          });
          let buttonColor = '';
          for (let element of jsxElements) {
            if (
              element.attributes?.length > 0 &&
              element?.name?.name === 'button'
            ) {
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
            await updateMissionStatus({
              missionType: 'time-to-code',
              newStatus: { changeButtonColor: 'pass' }
            });
            setSuccess(true);
            return;
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
      },
      changeButtonLabel: {
        BUTTON_LABEL,
        title: exercises[exerciseKey].title,
        code: codeObj?.[exerciseKey],
        initialCode: exercises[exerciseKey].initialCode,
        instruction: exercises[exerciseKey].instruction,
        onNextClick: handleNextClick,
        onSetCode: handleSetCode,
        async onRunCode(ast) {
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
          if (buttonText.trim().toLowerCase() === BUTTON_LABEL.toLowerCase()) {
            await updateMissionStatus({
              missionType: 'time-to-code',
              newStatus: { changeButtonLabel: 'pass' }
            });
            setSuccess(true);
            return;
          }
          if (stringIsEmpty(buttonText)) {
            return setErrorMsg(
              `Hmmm... The button doesn't seem to have any label`
            );
          }
          setErrorMsg(
            `The button's label needs to be "${BUTTON_LABEL}," not "${buttonText.trim()}"`
          );
        }
      },
      changeAlertMsg: {
        ALERT_MSG,
        title: exercises[exerciseKey].title,
        code: codeObj?.[exerciseKey],
        initialCode: exercises[exerciseKey].initialCode,
        instruction: exercises[exerciseKey].instruction,
        onNextClick: handleNextClick,
        onSetCode: handleSetCode,
        async onRunCode(ast) {
          const jsxElements = getAstProps({
            ast,
            propType: 'JSXOpeningElement'
          });
          let alertText = '';
          for (let element of jsxElements) {
            if (
              element.attributes?.length > 0 &&
              element?.name?.name === 'button'
            ) {
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
            await updateMissionStatus({
              missionType: 'time-to-code',
              newStatus: { changeAlertMsg: 'pass' }
            });
            setSuccess(true);
            return;
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
}
