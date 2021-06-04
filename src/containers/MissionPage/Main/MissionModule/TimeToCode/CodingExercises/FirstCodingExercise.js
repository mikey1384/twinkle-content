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
import { useAppContext, useContentContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

FirstCodingExercise.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired,
  passed: PropTypes.bool.isRequired,
  style: PropTypes.object
};

export default function FirstCodingExercise({
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
  const { userId, status = {} } = useMyState();
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const initialCode = `function HomePage() {
  return (
    <div>
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
}`;

  return (
    <ErrorBoundary>
      <p>
        1. Make it blue
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
        Change the color of the <b style={{ color: 'red' }}>red</b> button below
        to <b style={{ color: 'blue' }}>blue</b> and tap the{' '}
        <b style={{ color: Color.green() }}>check</b> button
      </div>
      <div
        style={style}
        className={css`
          width: 80%;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
      >
        <CodeSandbox
          code={code || initialCode}
          onSetCode={onSetCode}
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
                status: {
                  ...status,
                  missions: {
                    ...status.missions,
                    'time-to-code': {
                      ...status?.missions?.['time-to-code'],
                      changeButtonColor: 'pass'
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
