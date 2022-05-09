import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { css } from '@emotion/css';
import { SELECTED_LANGUAGE } from 'constants/defaultValues';

WordleResult.propTypes = {
  myId: PropTypes.number,
  userId: PropTypes.number,
  username: PropTypes.string
};

export default function WordleResult({ username, userId, myId }) {
  const displayedUserLabel = useMemo(() => {
    if (userId === myId) {
      if (SELECTED_LANGUAGE === 'kr') {
        return '회원';
      }
      return 'You';
    }
    return username;
  }, [myId, userId, username]);

  return (
    <div
      className={css`
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 2.5rem 1rem 1.5rem 1rem;
        position: relative;
      `}
    >
      {displayedUserLabel}
    </div>
  );
}
