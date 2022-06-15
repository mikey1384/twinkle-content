import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import RoundList from 'components/RoundList';
import Loading from 'components/Loading';
import { useAppContext } from 'contexts';

Streaks.propTypes = {
  channelId: PropTypes.number.isRequired
};

export default function Streaks({ channelId }) {
  const loadWordleStreaks = useAppContext(
    (v) => v.requestHelpers.loadWordleStreaks
  );
  const [loading, setLoading] = useState(true);
  const [streakObj, setStreakObj] = useState({});
  const [streaks, setStreaks] = useState([]);
  useEffect(() => {
    init();
    async function init() {
      const { bestStreaks, bestStreakObj } = await loadWordleStreaks(channelId);
      setStreakObj(bestStreakObj);
      setStreaks(bestStreaks);
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
          {streaks.map((streak) => (
            <div key={streak}>
              {streak} {streakObj[streak][0].username}
            </div>
          ))}
        </RoundList>
        <div style={{ width: '100%', padding: '1rem' }} />
      </div>
    </div>
  );
}
