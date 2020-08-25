import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Color, borderRadius } from 'constants/css';

Task.propTypes = {
  taskId: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  style: PropTypes.object
};
export default function Task({ taskId, title, subtitle, description, style }) {
  return (
    <div
      className={css`
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
      `}
      style={style}
    >
      <div>{title}</div>
      <div>{subtitle}</div>
      <div>{taskId}</div>
      {description && <div>{description}</div>}
    </div>
  );
}
