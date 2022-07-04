import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Color, Theme } from 'constants/css';
import { useMyState } from 'helpers/hooks';
import { css } from '@emotion/css';

TwinkleLogo.propTypes = {
  style: PropTypes.object
};

export default function TwinkleLogo({ style }) {
  const { profileTheme } = useMyState();
  const twinColor = useMemo(
    () => Color[Theme(profileTheme).logoTwin.color](),
    [profileTheme]
  );
  const kleColor = useMemo(
    () => Color[Theme(profileTheme).logoKle.color](),
    [profileTheme]
  );

  return (
    <div
      style={style}
      className={`desktop ${css`
        cursor: pointer;
        position: relative;
        width: 10rem;
        height: 2rem;
      `}`}
      onClick={() => {
        window.location.href = '/';
      }}
    >
      <div
        onClick={() => (document.getElementById('App').scrollTop = 0)}
        className={css`
          font-size: 2rem;
          font-weight: bold;
          font-family: 'Ubuntu', sans-serif, Arial, Helvetica;
          line-height: 0.9;
          color: ${Color.gray()};
          > .logo {
            line-height: 1;
          }
          > .logo-twin {
            color: ${twinColor};
          }
          > .logo-kle {
            color: ${kleColor};
          }
        `}
      >
        <span className="logo logo-twin">Twin</span>
        <span className="logo logo-kle">kle</span>
      </div>
    </div>
  );
}
