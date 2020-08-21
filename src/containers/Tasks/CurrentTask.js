import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'emotion';
import { borderRadius, Color } from 'constants/css';
import Screenshot from './takingscreenshot.gif';
import { useHistory } from 'react-router-dom';

CurrentTask.propTypes = {
  style: PropTypes.object,
  className: PropTypes.string,
  taskId: PropTypes.number
};

export default function CurrentTask({ style, className, taskId }) {
  const history = useHistory();
  return (
    <div style={style} className={className}>
      <p
        className={css`
          font-size: 2.5rem;
          font-weight: bold;
        `}
      >
        Current Task
      </p>
      <div
        onClick={() => history.push(`/tasks/${taskId}`)}
        className={css`
          display: flex;
          flex-direction: column;
          font-size: 3rem;
          margin-top: 1rem;
          border: 1px solid ${Color.borderGray()};
          padding: 1rem 1rem 3rem 1rem;
          border-radius: ${borderRadius};
          cursor: pointer;
          &:hover {
            background: ${Color.highlightGray()};
          }
        `}
      >
        <div style={{ fontWeight: 'bold' }}>Take a Screen Shot</div>
        <div style={{ marginTop: '2rem', display: 'flex', width: '100%' }}>
          <img
            className={css`
              width: 60%;
            `}
            src={Screenshot}
          />
          <div
            className={css`
              width: 40%;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 2rem;
            `}
          >
            progress: 60%
          </div>
        </div>
      </div>
    </div>
  );
}
