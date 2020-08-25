import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Color, borderRadius } from 'constants/css';
import { gifTable } from 'constants/defaultValues';

Task.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  style: PropTypes.object,
  taskId: PropTypes.number
};
export default function Task({ title, subtitle, description, style, taskId }) {
  return (
    <div
      className={css`
        padding: 1rem;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
      `}
      style={style}
    >
      <div>
        <h1>{title}</h1>
        <p style={{ fontSize: '1.7rem' }}>{subtitle}</p>
      </div>
      <div
        style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}
      >
        <img src={gifTable[taskId]} />
      </div>
      {description && <div>{description}</div>}
    </div>
  );
}
