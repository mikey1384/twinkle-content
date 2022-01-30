import React from 'react';
import PropTypes from 'prop-types';
import RoundList from 'components/RoundList';
import RankingsListItem from 'components/RankingsListItem';

Top30.propTypes = {
  top30s: PropTypes.array,
  myId: PropTypes.number
};

export default function Top30({ top30s, myId }) {
  if (top30s.length === 0) return null;
  return (
    <RoundList style={{ marginTop: 0 }}>
      {top30s.map((user) => (
        <RankingsListItem key={user.id} user={user} myId={myId} />
      ))}
    </RoundList>
  );
}
