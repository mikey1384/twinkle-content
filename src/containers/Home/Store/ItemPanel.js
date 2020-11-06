import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Button from 'components/Button';
import ProgressBar from 'components/ProgressBar';
import { useMyState } from 'helpers/hooks';
import { css } from 'emotion';
import { addCommasToNumber } from 'helpers/stringHelpers';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';

ItemPanel.propTypes = {
  itemName: PropTypes.string.isRequired,
  itemDescription: PropTypes.string.isRequired,
  karmaPoints: PropTypes.number,
  requiredKarmaPoints: PropTypes.number,
  style: PropTypes.object
};

export default function ItemPanel({
  itemName,
  itemDescription,
  style,
  karmaPoints,
  requiredKarmaPoints
}) {
  const { profileTheme, userId } = useMyState();
  const unlockProgress = useMemo(() => {
    return Math.min((karmaPoints * 100) / requiredKarmaPoints, 100);
  }, [karmaPoints, requiredKarmaPoints]);

  return (
    <div
      className={css`
        border-radius: ${borderRadius};
        @media (max-width: ${mobileMaxWidth}) {
          border-radius: 0;
        }
      `}
      style={{
        background: '#fff',
        border: `1px solid ${Color.borderGray()}`,
        padding: '1rem',
        ...style
      }}
    >
      <div style={{ fontWeight: 'bold', fontSize: '2rem' }}>{itemName}</div>
      <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
        Requires {addCommasToNumber(requiredKarmaPoints)} KP
      </p>
      <p style={{ fontSize: '1.3rem', marginTop: '0.5rem' }}>
        {itemDescription}
      </p>
      {userId && (
        <>
          <div
            style={{
              marginTop: '2rem',
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.7rem'
            }}
          >
            <Icon size="3x" icon="lock" />
            <div
              style={{
                marginTop: '1rem',
                display: 'flex',
                width: '100%',
                justifyContent: 'center'
              }}
            >
              <Button
                disabled={unlockProgress < 100}
                skeuomorphic
                color="green"
              >
                <Icon icon="unlock" />
                <span style={{ marginLeft: '0.7rem' }}>Unlock</span>
              </Button>
            </div>
          </div>
          <ProgressBar
            color={
              unlockProgress === 100 ? Color.green() : Color[profileTheme]()
            }
            progress={unlockProgress}
          />
          <p style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
            You need{' '}
            <b>{addCommasToNumber(requiredKarmaPoints)} karma points</b> to
            unlock this item. You have <b>{karmaPoints} karma points</b>
          </p>
        </>
      )}
    </div>
  );
}
