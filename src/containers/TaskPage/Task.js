import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Color, borderRadius } from 'constants/css';

Task.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  style: PropTypes.object
};
export default function Task({ title, subtitle, description, style }) {
  return (
    <div
      className={css`
        padding: 1rem;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
      `}
      style={style}
    >
      <h1>{title}</h1>
      <p style={{ fontSize: '1.7rem' }}>{subtitle}</p>
      {description && <div>{description}</div>}
    </div>
  );
}
