import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import RoundList from 'components/RoundList';
import RankingsListItem from 'components/RankingsListItem';
import FilterBar from 'components/FilterBar';
import localize from 'constants/localize';
import moment from 'moment';

const monthLabel = moment().format('MMMM');
const allTimeLabel = localize('allTime');

Top30.propTypes = {
  top30s: PropTypes.array,
  top30sMonthly: PropTypes.array,
  myId: PropTypes.number
};

export default function Top30({ top30s, top30sMonthly, myId }) {
  const [thisMonthSelected, setThisMonthSelected] = useState(true);
  const users = useMemo(() => {
    if (thisMonthSelected && !!myId) {
      return top30sMonthly;
    }
    return top30s;
  }, [myId, thisMonthSelected, top30s, top30sMonthly]);

  if (top30s.length === 0) return null;
  return (
    <>
      {!!myId && (
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
      )}
      <RoundList style={{ marginTop: 0 }}>
        {users.map((user) => (
          <RankingsListItem key={user.id} user={user} myId={myId} />
        ))}
      </RoundList>
    </>
  );
}
