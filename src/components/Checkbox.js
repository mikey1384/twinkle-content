import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { innerBorderRadius, Color, Theme, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { useMyState } from 'helpers/hooks';

Checkbox.propTypes = {
  className: PropTypes.string,
  backgroundColor: PropTypes.string,
  checked: PropTypes.bool,
  label: PropTypes.string,
  onClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  textIsClickable: PropTypes.bool
};

export default function Checkbox({
  backgroundColor = Color.inputGray(),
  className,
  checked,
  label,
  onClick,
  style,
  textIsClickable
}) {
  const { profileTheme } = useMyState();
  const switchColor = useMemo(
    () => Color[Theme(profileTheme).switch.color](),
    [profileTheme]
  );

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        postion: 'relative',
        width: '100%',
        fontSize: '1.2rem',
        ...style
      }}
    >
      {label && (
        <p
          style={{
            color: Color.darkerGray(),
            cursor: textIsClickable ? 'pointer' : 'default'
          }}
          onClick={textIsClickable ? onClick : () => {}}
        >
          {label}
          &nbsp;&nbsp;
        </p>
      )}
      <div
        onClick={onClick}
        style={{
          borderRadius: innerBorderRadius,
          border: `1px solid ${Color.borderGray()}`,
          width: '2rem',
          height: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          background: checked ? switchColor : backgroundColor
        }}
      >
        {checked && (
          <div
            className={css`
              display: inline-block;
              width: 0.6rem;
              height: 1rem;
              margin-top: 2%;
              border: solid #fff;
              border-width: 0 3px 3px 0;
              transform: rotate(45deg);
              @media (max-width: ${mobileMaxWidth}) {
                border-width: 0 2px 2px 0;
              }
            `}
          />
        )}
      </div>
    </div>
  );
}
