import React, { useMemo, useState } from 'react';
import { Color } from 'constants/css';
import { getAstProps } from 'helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';

const BUTTON_LABEL = 'Tap me';
const ALERT_MSG = 'Hello World';

export default function useExercises({
  index,
  state = {},
  onUpdateProfileInfo,
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

  const passed = useMemo(() => {
    const passArray = [
      firstExercisePassed,
      secondExercisePassed,
      thirdExercisePassed
    ];
    return passArray[index];
  }, [firstExercisePassed, index, secondExercisePassed, thirdExercisePassed]);

  const exercise = useMemo(() => {
    const exerciseArray = [
      {
        title: '1. Make It Blue',
        initialCode: `function HomePage() {
      return (
        <div
          style={{
            width: '100%',
            height: "100%",
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <button
            style={{
              color: "white",
              background: "red",
              border: "none",
              fontSize: "2rem",
              padding: "1rem",
              cursor: "pointer"
            }}
            onClick={() => alert('I am a button')}
          >
            Change me
          </button>
        </div>
      );
    }`,
        instruction: (
          <>
            Change the color of the <b style={{ color: 'red' }}>red</b> button
            below to <b style={{ color: 'blue' }}>blue</b> and tap the{' '}
            <b style={{ color: Color.green() }}>check</b> button
          </>
        ),
        onNextClick: () =>
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
          }),
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
      {
        BUTTON_LABEL,
        title: '2. Tap Me',
        initialCode: `function HomePage() {
      return (
        <div
          style={{
            width: '100%',
            height: "100%",
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <button
            style={{
              color: "white",
              background: "blue",
              border: "none",
              fontSize: "2rem",
              padding: "1rem",
              cursor: "pointer"
            }}
            onClick={() => alert('I am a button')}
          >
            Change me
          </button>
        </div>
      );
    }`,
        instruction: (
          <>
            Change the label of the button from {`"Change me"`} to{' '}
            {`"${BUTTON_LABEL}"`} and tap the{' '}
            <b style={{ color: Color.green() }}>check</b> button
          </>
        ),
        onNextClick: () =>
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
          }),
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
      {
        ALERT_MSG,
        title: '3. Hello World',
        initialCode: `function HomePage() {
      return (
        <div
          style={{
            width: '100%',
            height: "100%",
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <button
            style={{
              color: "white",
              background: "blue",
              border: "none",
              fontSize: "2rem",
              padding: "1rem",
              cursor: "pointer"
            }}
            onClick={() => alert('I am a button')}
          >
            Tap me
          </button>
        </div>
      );
    }`,
        instruction: `Make it so that when you tap the "Tap me" button you get an alert
    message that says "${ALERT_MSG}"`,
        onNextClick: () =>
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
          }),
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
    ];
    return exerciseArray[index];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, userId]);

  return {
    passed,
    errorMsg,
    setErrorMsg,
    exercise,
    success
  };
}
