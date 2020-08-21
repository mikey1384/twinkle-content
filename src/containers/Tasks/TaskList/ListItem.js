import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Color, borderRadius } from 'constants/css';
import { useHistory } from 'react-router-dom';

ListItem.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  taskId: PropTypes.number
};
export default function ListItem({ children, style, taskId }) {
  const history = useHistory();
  return (
    <div
      onClick={() => history.push(`/tasks/${taskId}`)}
      style={style}
      className={css`
        padding: 1rem;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
        cursor: pointer;
        &:hover {
          background: ${Color.highlightGray()};
        }
      `}
    >
      {children}
    </div>
  );
}
