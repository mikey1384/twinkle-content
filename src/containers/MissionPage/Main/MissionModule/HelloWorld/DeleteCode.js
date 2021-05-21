import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Button from 'components/Button';
import { css } from '@emotion/css';
import { cloudFrontURL } from 'constants/defaultValues';
import { mobileMaxWidth } from 'constants/css';

DeleteCode.propTypes = {
  onSetDeletedCode: PropTypes.func.isRequired
};

export default function DeleteCode({ onSetDeletedCode }) {
  const [okayPressed, setOkayPressed] = useState(false);
  return (
    <ErrorBoundary>
      <p>
        1. Go back to the index.js file inside your pages folder and delete all
        the codes in that file
      </p>
      <img
        className={css`
          margin-top: 2rem;
          width: 80%;
          @media (max-width: ${mobileMaxWidth}) {
            width: 100%;
          }
        `}
        src={`${cloudFrontURL}/missions/hello-world/${
          okayPressed ? 'code-deleted' : 'starting-point'
        }.png`}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          width: '100%',
          marginTop: '2rem'
        }}
      >
        {!okayPressed && (
          <Button filled color="logoBlue" onClick={() => setOkayPressed(true)}>
            Okay
          </Button>
        )}
        {okayPressed && (
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column'
            }}
          >
            <p>Did you delete the codes?</p>
            <Button
              style={{ marginTop: '1.5rem' }}
              filled
              color="green"
              onClick={() => onSetDeletedCode(true)}
            >
              Yes
            </Button>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
