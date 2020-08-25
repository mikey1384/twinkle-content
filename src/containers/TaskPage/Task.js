import React from 'react';
import PropTypes from 'prop-types';

Task.propTypes = {
  taskId: PropTypes.number,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string
};
export default function Task({ taskId, title, subtitle, description }) {
  return (
    <div>
      <div>{title}</div>
      <div>{subtitle}</div>
      <div>{taskId}</div>
      {description && <div>{description}</div>}
    </div>
  );
}
