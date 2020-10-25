import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';

ForkButtons.propTypes = {
  forkButtonIds: PropTypes.array.isRequired,
  forkButtonsObj: PropTypes.object.isRequired,
  onForkButtonClick: PropTypes.func.isRequired,
  selectedForkButtonId: PropTypes.number
};

export default function ForkButtons({
  forkButtonIds,
  forkButtonsObj,
  onForkButtonClick,
  selectedForkButtonId
}) {
  return (
    <div
      className={css`
        margin-top: 5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        @media (max-width: ${mobileMaxWidth}) {
          margin-top: 3rem;
        }
      `}
    >
      {forkButtonIds.map((buttonId, index) => {
        const button = forkButtonsObj[buttonId];
        return (
          <Button
            key={button.id}
            skeuomorphic
            style={{ marginTop: index === 0 ? 0 : '1rem' }}
            onClick={() => onForkButtonClick(button.id)}
          >
            {button.icon && <Icon icon={button.icon} />}
            <span style={{ marginLeft: button.icon ? '0.7rem' : 0 }}>
              {button.label}
            </span>
            {selectedForkButtonId === button.id ? (
              <Icon
                icon="check"
                style={{ marginLeft: '0.7rem', color: Color.green() }}
              />
            ) : null}
          </Button>
        );
      })}
    </div>
  );
}
