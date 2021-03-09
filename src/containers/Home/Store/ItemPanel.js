import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Button from 'components/Button';
import ProgressBar from 'components/ProgressBar';
import { useMyState } from 'helpers/hooks';
import { css } from '@emotion/css';
import { addCommasToNumber, stringIsEmpty } from 'helpers/stringHelpers';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';

ItemPanel.propTypes = {
  children: PropTypes.node,
  currentLvl: PropTypes.number,
  itemName: PropTypes.string,
  itemDescription: PropTypes.string,
  isLeveled: PropTypes.bool,
  maxLvl: PropTypes.number,
  karmaPoints: PropTypes.number,
  locked: PropTypes.bool,
  requiredKarmaPoints: PropTypes.number,
  onUnlock: PropTypes.func,
  style: PropTypes.object,
  upgradeIcon: PropTypes.node
};

export default function ItemPanel({
  children,
  currentLvl,
  itemName,
  itemDescription,
  isLeveled,
  locked: notUnlocked,
  maxLvl,
  style,
  karmaPoints,
  onUnlock,
  requiredKarmaPoints,
  upgradeIcon
}) {
  const [highlighted, setHighlighted] = useState(false);
  const { profileTheme, userId } = useMyState();
  const unlockProgress = useMemo(() => {
    return Math.floor(Math.min((karmaPoints * 100) / requiredKarmaPoints, 100));
  }, [karmaPoints, requiredKarmaPoints]);
  const locked = useMemo(() => {
    return notUnlocked || (isLeveled && currentLvl < maxLvl);
  }, [currentLvl, notUnlocked, isLeveled, maxLvl]);
  const notUpgraded = useMemo(() => {
    return !notUnlocked && isLeveled && currentLvl < maxLvl;
  }, [currentLvl, isLeveled, maxLvl, notUnlocked]);

  return (
    <div
      className={css`
        border-radius: ${borderRadius};
        @media (max-width: ${mobileMaxWidth}) {
          border-radius: 0;
        }
      `}
      style={{
        ...(highlighted
          ? {
              boxShadow: `0 0 10px ${Color.gold(0.8)}`,
              border: `1px solid ${Color.gold(0.8)}`
            }
          : { border: `1px solid ${Color.borderGray()}` }),
        background: '#fff',
        transition: 'border 0.2s, box-shadow 0.2s',
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
                {upgradeIcon && notUpgraded ? (
                  upgradeIcon
                ) : (
                  <Icon size="3x" icon="lock" />
                )}
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
                    onClick={() => {
                      onUnlock();
                      setHighlighted(true);
                      setTimeout(() => setHighlighted(false), 500);
                    }}
                  >
                    <Icon icon={notUpgraded ? 'level-up' : 'unlock'} />
                    <span style={{ marginLeft: '0.7rem' }}>
                      {notUpgraded ? 'Upgrade' : 'Unlock'}
                    </span>
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
              <b>{addCommasToNumber(requiredKarmaPoints)} karma points</b> to{' '}
              {notUpgraded ? 'upgrade' : 'unlock'} this item. You have{' '}
              <b>{addCommasToNumber(karmaPoints)} karma points</b>
            </p>
          </>
        ) : (
          children
        ))}
    </div>
  );
}
