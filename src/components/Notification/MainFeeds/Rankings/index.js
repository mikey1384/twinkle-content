import React, { useEffect, useRef, useState } from 'react';
import Loading from 'components/Loading';
import ErrorBoundary from 'components/ErrorBoundary';
import FilterBar from 'components/FilterBar';
import Top30 from './Top30';
import All from './All';
import { useMyState } from 'helpers/hooks';
import { useNotiContext } from 'contexts';
import localize from 'constants/localize';

const myRankingLabel = localize('myRanking');
const top30Label = localize('top30');

export default function Rankings() {
  const [allSelected, setAllSelected] = useState(true);
  const { rank, twinkleXP, userId } = useMyState();
  const allRanks = useNotiContext((v) => v.state.allRanks);
  const top30s = useNotiContext((v) => v.state.top30s);
  const rankingsLoaded = useNotiContext((v) => v.state.rankingsLoaded);
  const userChangedTab = useRef(false);
  const mounted = useRef(true);
  const prevId = useRef(userId);

  useEffect(() => {
    userChangedTab.current = false;
    if (!rankingsLoaded && mounted.current) {
      setAllSelected(!!userId);
    }
    prevId.current = userId;
  }, [userId, rankingsLoaded]);

  useEffect(() => {
    setAllSelected(!!userId);
  }, [userId]);

  return (
    <ErrorBoundary>
      {!!userId && (
        <FilterBar
          bordered
          style={{
            height: '4.5rem',
            fontSize: '1.6rem'
          }}
        >
          <nav
            className={allSelected ? 'active' : ''}
            onClick={() => {
              userChangedTab.current = true;
              setAllSelected(true);
            }}
          >
            {myRankingLabel}
          </nav>
          <nav
            className={allSelected ? '' : 'active'}
            onClick={() => {
              userChangedTab.current = true;
              setAllSelected(false);
            }}
          >
            {top30Label}
          </nav>
        </FilterBar>
      )}
      {rankingsLoaded === false && <Loading />}
      {rankingsLoaded && (
        <>
          {allSelected ? (
            <All
              rank={rank}
              twinkleXP={twinkleXP}
              allRanks={allRanks}
              myId={userId}
            />
          ) : (
            <Top30 top30s={top30s} myId={userId} />
          )}
        </>
      )}
    </ErrorBoundary>
  );
}
