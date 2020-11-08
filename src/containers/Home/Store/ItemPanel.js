import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Button from 'components/Button';
import ProgressBar from 'components/ProgressBar';
import { useMyState } from 'helpers/hooks';
import { css } from 'emotion';
import { addCommasToNumber, stringIsEmpty } from 'helpers/stringHelpers';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';

ItemPanel.propTypes = {
  children: PropTypes.node,
  currentLvl: PropTypes.number,
  itemName: PropTypes.string.isRequired,
  itemDescription: PropTypes.string,
  isLeveled: PropTypes.bool,
  maxLvl: PropTypes.number,
  karmaPoints: PropTypes.number,
  locked: PropTypes.bool,
  requiredKarmaPoints: PropTypes.number,
  onUnlock: PropTypes.func,
  style: PropTypes.object
};

export default function ItemPanel({
  children,
  currentLvl,
  itemName,
  itemDescription,
  isLeveled,
  locked: initialLocked,
  maxLvl,
  style,
  karmaPoints,
  onUnlock,
  requiredKarmaPoints
}) {
  const { profileTheme, userId } = useMyState();
  const unlockProgress = useMemo(() => {
    return Math.min((karmaPoints * 100) / requiredKarmaPoints, 100);
  }, [karmaPoints, requiredKarmaPoints]);
  const locked = useMemo(() => {
    return initialLocked || (isLeveled && currentLvl < maxLvl);
  }, [currentLvl, initialLocked, isLeveled, maxLvl]);

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
      {locked && (
        <>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
            Requires {addCommasToNumber(requiredKarmaPoints)} KP
          </p>
          {!stringIsEmpty(itemDescription) && (
            <p style={{ fontSize: '1.3rem', marginTop: '0.5rem' }}>
              {itemDescription}
            </p>
          )}
        </>
      )}
      {userId &&
        (locked ? (
          <>
            {onUnlock ? (
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
                    onClick={onUnlock}
                  >
                    <Icon icon="unlock" />
                    <span style={{ marginLeft: '0.7rem' }}>Unlock</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div
                style={{
                  marginTop: '2rem',
                  marginBottom: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  width: '100%',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.7rem'
                }}
              >
                <Icon size="3x" icon="question" />
              </div>
            )}
            <ProgressBar
              color={
                unlockProgress === 100 ? Color.green() : Color[profileTheme]()
              }
              progress={unlockProgress}
            />
            <p style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
              You need{' '}
              <b>{addCommasToNumber(requiredKarmaPoints)} karma points</b> to
              unlock this item. You have{' '}
              <b>{addCommasToNumber(karmaPoints)} karma points</b>
            </p>
          </>
        ) : (
          children
        ))}
    </div>
  );
}
