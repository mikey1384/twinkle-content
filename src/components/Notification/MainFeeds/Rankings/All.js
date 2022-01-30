import React from 'react';
import PropTypes from 'prop-types';
import RoundList from 'components/RoundList';
import RankingsListItem from 'components/RankingsListItem';
import localize from 'constants/localize';
import { Color, borderRadius } from 'constants/css';

const notRankedDescriptionLabel = localize('notRankedDescription');

All.propTypes = {
  allRanks: PropTypes.array,
  myId: PropTypes.number
};

export default function All({ allRanks, myId }) {
  const loggedIn = !!myId;
  return allRanks.length === 0 ? (
    loggedIn ? (
      <div
        style={{
          background: '#fff',
          borderRadius,
          padding: '1rem',
          border: `1px solid ${Color.borderGray()}`
        }}
      >
        {notRankedDescriptionLabel}
      </div>
    ) : null
  ) : (
    <RoundList style={{ marginTop: 0 }}>
      {allRanks.map((user) => (
        <RankingsListItem key={user.id} user={user} myId={myId} />
      ))}
    </RoundList>
  );
}
