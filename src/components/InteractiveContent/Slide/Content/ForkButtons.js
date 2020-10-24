import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { css } from 'emotion';
import { Color, mobileMaxWidth } from 'constants/css';

ForkButtons.propTypes = {
  optionIds: PropTypes.array.isRequired,
  optionsObj: PropTypes.object.isRequired,
  onOptionClick: PropTypes.func.isRequired,
  selectedOptionId: PropTypes.number
};

export default function ForkButtons({
  optionIds,
  optionsObj,
  onOptionClick,
  selectedOptionId
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
      {optionIds.map((optionId, index) => {
        const option = optionsObj[optionId];
        return (
          <Button
            key={option.id}
            skeuomorphic
            style={{ marginTop: index === 0 ? 0 : '1rem' }}
            onClick={() => onOptionClick(option.id)}
          >
            {option.icon && <Icon icon={option.icon} />}
            <span style={{ marginLeft: option.icon ? '0.7rem' : 0 }}>
              {option.label}
            </span>
            {selectedOptionId === option.id ? (
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
