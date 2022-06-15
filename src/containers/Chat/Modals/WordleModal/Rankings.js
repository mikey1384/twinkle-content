import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import FilterBar from 'components/FilterBar';
import localize from 'constants/localize';
import RoundList from 'components/RoundList';
import RankingsListItem from 'components/RankingsListItem';
import { useMyState } from 'helpers/hooks';
import { useAppContext } from 'contexts';

const myRankingLabel = localize('myRanking');
const top30Label = localize('top30');

Rankings.propTypes = {
  channelId: PropTypes.number,
  onSetRankingsTab: PropTypes.func.isRequired,
  rankingsTab: PropTypes.string.isRequired
};

export default function Rankings({ channelId, rankingsTab, onSetRankingsTab }) {
  const loadWordleRankings = useAppContext(
    (v) => v.requestHelpers.loadWordleRankings
  );
  const [allRanks, setAllRanks] = useState([]);
  const [top30s, setTop30s] = useState([]);
  const { userId: myId } = useMyState();
  const users = useMemo(
    () => (rankingsTab === 'all' ? allRanks : top30s),
    [allRanks, rankingsTab, top30s]
  );
  useEffect(() => {
    init();
    async function init() {
      const { all, top30s } = await loadWordleRankings(channelId);
      setAllRanks(all);
      setTop30s(top30s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          <RankingsListItem
            key={user.id}
            user={user}
            myId={myId}
            target="xpEarned"
          />
        ))}
      </RoundList>
    </div>
  );
}
