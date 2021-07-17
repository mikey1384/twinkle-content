import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { Color, borderRadius } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { css } from '@emotion/css';

GoBackToMissionItem.propTypes = {
  style: PropTypes.object,
  selected: PropTypes.bool
};

export default function GoBackToMissionItem({ style, selected }) {
  const { profileTheme } = useMyState();

  return (
    <div
      style={{
        ...style,
        boxShadow: selected ? `0 0 3px ${Color[profileTheme](0.5)}` : null,
        border: selected ? `0.5rem solid ${Color[profileTheme](0.5)}` : null
      }}
      className={css`
        width: 100%;
        cursor: pointer;
        padding: 1rem;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        background: #fff;
        .label {
          color: ${Color.black()};
          transition: color 1s;
        }
        transition: background 0.5s, border 0.5s;
        &:hover {
          border-color: ${Color.darkerBorderGray()};
          .label {
            color: ${Color.black()};
          }
          background: ${Color.highlightGray()};
        }
      `}
    >
      <p style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
        <Icon icon="home" />
        <span style={{ marginLeft: '0.7rem' }}>Back to Mission</span>
      </p>
    </div>
  );
}
