import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { Color, borderRadius } from 'constants/css';
import { useHistory } from 'react-router-dom';
import { useAppContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

ListItem.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
  taskId: PropTypes.number
};
export default function ListItem({ children, style, taskId }) {
  const history = useHistory();
  const { userId } = useMyState();
  const {
    user: {
      actions: { onOpenSigninModal }
    }
  } = useAppContext();
  return (
    <div
      onClick={handleLinkClick}
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

  function handleLinkClick() {
    if (userId) {
      history.push(`/tasks/${taskId}`);
    } else {
      onOpenSigninModal();
    }
  }
}
