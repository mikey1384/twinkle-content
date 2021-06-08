import React, { useState } from 'react';
import PropTypes from 'prop-types';
import CodeSandbox from 'components/Forms/CodeSandbox';
import Icon from 'components/Icon';
import ErrorBoundary from 'components/ErrorBoundary';
import FailMessage from './FailMessage';
import SuccessMessage from './SuccessMessage';
import { Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { getAstProps } from 'helpers';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { useAppContext, useContentContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

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
  const BUTTON_LABEL = 'Tap me';
  const {
    requestHelpers: { updateMissionStatus }
  } = useAppContext();
  const {
    actions: { onUpdateProfileInfo }
  } = useContentContext();
  const { userId, state = {} } = useMyState();
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const initialCode = `function HomePage() {
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
}`;

  return (
    <ErrorBoundary
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        ...style
      }}
    >
      <p>
        2. Tap Me
        {passed && (
          <Icon
            style={{ marginLeft: '1rem' }}
            icon="check"
            color={Color.green()}
          />
        )}
      </p>
      <div
        className={css`
          width: 80%;
          font-size: 1.7rem;
          line-height: 2;
          text-align: center;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
        style={{ marginTop: '2rem' }}
      >
        Change the label of the button from {`"Change me"`} to{' '}
        {`"${BUTTON_LABEL}"`} and tap the{' '}
        <b style={{ color: Color.green() }}>check</b> button
      </div>
      <div
        className={css`
          margin-top: 2rem;
          width: 80%;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
      >
        <CodeSandbox
          code={code || initialCode}
          onSetCode={(code) =>
            onSetCode({ code, exerciseLabel: 'changeButtonLabel' })
          }
          onRunCode={handleRunCode}
          onSetErrorMsg={setErrorMsg}
          hasError={!!errorMsg}
          passed={passed || success}
          runButtonLabel="check"
        />
        {success && !passed && (
          <SuccessMessage
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
        )}
        {errorMsg && <FailMessage message={errorMsg} />}
      </div>
    </ErrorBoundary>
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
    if (buttonText.trim().toLowerCase() === BUTTON_LABEL.toLowerCase()) {
      return handleSuccess();
    }
    if (stringIsEmpty(buttonText)) {
      return setErrorMsg(`Hmmm... The button doesn't seem to have any label`);
    }
    setErrorMsg(
      `The button's label needs to be "${BUTTON_LABEL}," not "${buttonText.trim()}"`
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
