import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import FirstCodingExercise from './FirstCodingExercise';
import Icon from 'components/Icon';
import { mobileMaxWidth, Color } from 'constants/css';
import { css } from '@emotion/css';
import { useMyState } from 'helpers/hooks';

CodingTasks.propTypes = {
  code: PropTypes.string,
  onSetCode: PropTypes.func.isRequired,
  style: PropTypes.object
};

export default function CodingTasks({ code, onSetCode, style }) {
  const { status } = useMyState();
  const codingStatus = useMemo(() => {
    return status?.missions?.['building-a-website'];
  }, [status?.missions]);
  const { changeButtonColor } = codingStatus;

  return (
    <ErrorBoundary
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        ...style
      }}
    >
      <p>
        1. Make it blue
        {changeButtonColor?.status === 'pass' && (
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
      <FirstCodingExercise
        style={{ marginTop: '3rem' }}
        code={code}
        onSetCode={onSetCode}
      />
    </ErrorBoundary>
  );
}
