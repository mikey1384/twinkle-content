import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import FilterBar from 'components/FilterBar';
import localize from 'constants/localize';
import RoundList from 'components/RoundList';
import RankingsListItem from 'components/RankingsListItem';
import { useMyState } from 'helpers/hooks';

const myRankingLabel = localize('myRanking');
const top30Label = localize('top30');

Rankings.propTypes = {
  onSetRankingsTab: PropTypes.func.isRequired,
  rankingsTab: PropTypes.string.isRequired,
  allRanks: PropTypes.array,
  top30s: PropTypes.array
};

export default function Rankings({
  allRanks = [],
  top30s = [],
  rankingsTab,
  onSetRankingsTab
}) {
  const { userId: myId } = useMyState();
  const users = useMemo(
    () => (rankingsTab === 'all' ? allRanks : top30s),
    [allRanks, rankingsTab, top30s]
  );

  return (
    <div style={{ width: '35rem' }}>
      <FilterBar
        bordered
        style={{
          width: '100%',
          height: '4.5rem',
          fontSize: '1.6rem'
        }}
      >
        <nav
          className={rankingsTab === 'all' ? 'active' : ''}
          onClick={() => onSetRankingsTab('all')}
        >
          {myRankingLabel}
        </nav>
        <nav
          className={rankingsTab === 'top30' ? 'active' : ''}
          onClick={() => onSetRankingsTab('top30')}
        >
          {top30Label}
        </nav>
      </FilterBar>
      <RoundList style={{ marginTop: 0 }}>
        {users.map((user) => (
          <RankingsListItem key={user.id} user={user} myId={myId} />
        ))}
      </RoundList>
    </div>
  );
}
