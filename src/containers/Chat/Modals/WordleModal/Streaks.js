import React, { useMemo, useEffect, useState } from 'react';
import RoundList from 'components/RoundList';
import RankingsListItem from 'components/RankingsListItem';
import Loading from 'components/Loading';
import { useMyState } from 'helpers/hooks';

export default function Streaks() {
  const [loading, setLoading] = useState(true);
  const users = useMemo(() => [], []);
  const { userId: myId } = useMyState();
  useEffect(() => {
    init();
    async function init() {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return loading ? (
    <Loading style={{ height: 'CALC(100vh - 30rem)' }} />
  ) : (
    <div
      style={{
        height: 'CALC(100vh - 30rem)',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column'
      }}
    >
      <div
        style={{
          height: '100%',
          overflow: 'scroll',
          width: '100%',
          paddingTop: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <RoundList style={{ marginTop: 0 }} width="35rem" mobileWidth="100%">
          {users.map((user) => (
            <RankingsListItem
              small
              key={user.id}
              user={user}
              myId={myId}
              target="xpEarned"
            />
          ))}
        </RoundList>
        <div style={{ width: '100%', padding: '1rem' }} />
      </div>
    </div>
  );
}
