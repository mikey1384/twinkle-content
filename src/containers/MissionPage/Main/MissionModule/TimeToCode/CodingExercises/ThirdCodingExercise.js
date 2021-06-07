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
  const ALERT_MSG = 'Hello World';
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
        Tap me
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
        3. Hello World!
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
        Make it so that when you tap the {`"Tap me"`} button you get an alert
        message that says {`"${ALERT_MSG}"`}
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
            onSetCode({ code, exerciseLabel: 'changeAlertMsg' })
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
                      changeAlertMsg: 'pass'
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