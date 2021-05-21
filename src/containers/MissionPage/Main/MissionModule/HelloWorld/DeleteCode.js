import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { css } from '@emotion/css';
import { Color, mobileMaxWidth } from 'constants/css';
import { cloudFrontURL } from 'constants/defaultValues';

DeleteCode.propTypes = {
  deletedCode: PropTypes.bool,
  onSetDeletedCode: PropTypes.func.isRequired
};

export default function DeleteCode({ deletedCode, onSetDeletedCode }) {
  const [okayPressed, setOkayPressed] = useState(false);
  return (
    <ErrorBoundary>
      <p>
        1. Go back to the index.js file inside your pages folder and delete
        everything inside
        {deletedCode && (
          <Icon
            style={{ marginLeft: '1rem' }}
            color={Color.green()}
            icon="check"
          />
        )}
      </p>
      {!okayPressed && (
        <img
          className={css`
            margin-top: 2rem;
            width: 80%;
            @media (max-width: ${mobileMaxWidth}) {
              width: 100%;
            }
          `}
          src={`${cloudFrontURL}/missions/hello-world/starting-point.png`}
        />
      )}
      {!deletedCode && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
            marginTop: '2rem'
          }}
        >
          {!okayPressed && (
            <Button
              filled
              color="logoBlue"
              onClick={() => setOkayPressed(true)}
            >
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
              {okayPressed && (
                <img
                  className={css`
                    margin-top: 2rem;
                    width: 80%;
                    @media (max-width: ${mobileMaxWidth}) {
                      width: 100%;
                    }
                  `}
                  src={`${cloudFrontURL}/missions/hello-world/code-deleted.png`}
                />
              )}
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
      )}
    </ErrorBoundary>
  );
}
