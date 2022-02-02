import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import RoundList from 'components/RoundList';
import RankingsListItem from 'components/RankingsListItem';
import localize from 'constants/localize';
import FilterBar from 'components/FilterBar';
import MyRank from 'components/MyRank';
import moment from 'moment';
import { Color, borderRadius } from 'constants/css';

const monthLabel = moment().format('MMMM');
const allTimeLabel = localize('allTime');
const notRankedDescriptionLabel = localize('notRankedDescription');

All.propTypes = {
  allMonthly: PropTypes.array,
  allRanks: PropTypes.array,
  myId: PropTypes.number,
  rank: PropTypes.number,
  twinkleXP: PropTypes.number
};

export default function All({ allRanks, allMonthly, myId, rank, twinkleXP }) {
  const [thisMonthSelected, setThisMonthSelected] = useState(true);
  const users = useMemo(() => {
    if (thisMonthSelected) {
      return allMonthly;
    }
    return allRanks;
  }, [allMonthly, allRanks, thisMonthSelected]);
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
    <>
      <FilterBar
        bordered
        style={{
          height: '4.5rem',
          fontSize: '1.6rem'
        }}
      >
        <nav
          className={thisMonthSelected ? 'active' : ''}
          onClick={() => {
            setThisMonthSelected(true);
          }}
        >
          {monthLabel}
        </nav>
        <nav
          className={thisMonthSelected ? '' : 'active'}
          onClick={() => {
            setThisMonthSelected(false);
          }}
        >
          {allTimeLabel}
        </nav>
      </FilterBar>
      {loggedIn && <MyRank myId={myId} rank={rank} twinkleXP={twinkleXP} />}
      <RoundList style={{ marginTop: 0 }}>
        {users.map((user) => (
          <RankingsListItem key={user.id} user={user} myId={myId} />
        ))}
      </RoundList>
    </>
  );
}
