import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import Button from 'components/Button';
import Input from 'components/Texts/Input';
import { exceedsCharLimit } from 'helpers/stringHelpers';
import { Color } from 'constants/css';
import { css } from 'emotion';

OptionItem.propTypes = {
  onSetInputState: PropTypes.func.isRequired,
  option: PropTypes.object,
  style: PropTypes.object,
  editedOptionIds: PropTypes.array,
  editedOptionsObj: PropTypes.object
};

export default function OptionItem({
  editedOptionIds,
  editedOptionsObj,
  option,
  style,
  onSetInputState
}) {
  const headingExceedsCharLimit = useMemo(
    () =>
      exceedsCharLimit({
        contentType: 'interactive',
        inputType: 'heading',
        text: option.label
      }),
    [option.label]
  );

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        ...style
      }}
    >
      <div style={{ padding: '1rem 1.5rem 1rem 0' }}>
        <Button skeuomorphic color={option.icon ? 'black' : 'blue'}>
          {option.icon ? (
            <Icon icon={option.icon} />
          ) : (
            <Icon icon="plus" style={{ color: Color.blue() }} />
          )}
        </Button>
      </div>
      <div
        key={option.id}
        style={{
          fontSize: '1.5rem',
          padding: '1rem 2rem',
          display: 'flex',
          flexGrow: 1,
          border: `1px solid ${Color.borderGray()}`
        }}
      >
        <Input
          onChange={(text) => {
            onSetInputState({
              editedOptionsObj: {
                ...editedOptionsObj,
                [option.id]: {
                  ...option,
                  label: text
                }
              }
            });
          }}
          placeholder="Enter option label..."
          value={option.label}
          style={{ width: '100%', ...headingExceedsCharLimit?.style }}
        />
      </div>
      <div
        style={{
          fontSize: '1.7rem',
          width: '2.5rem',
          display: 'flex',
          justifyContent: 'flex-end'
        }}
      >
        {option.id > 2 && (
          <Icon
            className={css`
              color: ${Color.darkerGray()};
              &:hover {
                color: ${Color.black()};
              }
            `}
            style={{ cursor: 'pointer' }}
            onClick={() =>
              onSetInputState({
                editedOptionIds: editedOptionIds.filter(
                  (optionId) => optionId !== option.id
                )
              })
            }
            icon="times"
          />
        )}
      </div>
    </div>
  );
}
