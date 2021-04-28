import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { borderRadius, Color, mobileMaxWidth } from 'constants/css';
import { css } from '@emotion/css';
import { useHistory } from 'react-router-dom';

GoBack.propTypes = {
  bordered: PropTypes.bool,
  to: PropTypes.string,
  isMobile: PropTypes.bool,
  text: PropTypes.string
};

export default function GoBack({ bordered, isMobile, to, text }) {
  const history = useHistory();
  return (
    <div
      className={`${isMobile ? 'mobile ' : ''}${css`
        background: #fff;
        font-size: 2rem;
        font-weight: bold;
        cursor: pointer;
        width: 100%;
        height: 100%;
        display: flex;
        padding: 1rem 1rem 1rem 1rem;
        align-items: center;
        transition: background 0.4s;
        line-height: 1.7;
        ${bordered
          ? `border: 1px solid ${Color.borderGray()}; border-radius: ${borderRadius};`
          : ''}
        @media (max-width: ${mobileMaxWidth}) {
          font-size: 2rem;
          padding-bottom: 1.5rem;
          &:hover {
            background: #fff;
            color: #000;
          }
        }
      `}`}
      onClick={() => (to ? history.push(to) : history.goBack())}
    >
      <span>
        <Icon icon="arrow-left" /> {text || 'Go Back'}
      </span>
    </div>
  );
}
