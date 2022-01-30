import React from 'react';
import PropTypes from 'prop-types';
import RoundList from 'components/RoundList';
import RankingsListItem from 'components/RankingsListItem';

All.propTypes = {
  users: PropTypes.array,
  myId: PropTypes.number
};

export default function All({ users, myId }) {
  return (
    <RoundList style={{ marginTop: 0 }}>
      {users.map((user) => (
        <RankingsListItem key={user.id} user={user} myId={myId} />
      ))}
    </RoundList>
  );
}
