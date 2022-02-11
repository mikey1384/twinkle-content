import React, { useMemo, useState } from 'react';
import { css } from '@emotion/css';
import { Color, borderRadius, mobileMaxWidth } from 'constants/css';
import { useNotiContext } from 'contexts';
import TopRanker from './TopRanker';
import moment from 'moment';
import Top30Modal from './Top30Modal';

const monthLabel = moment().format('MMMM');
const yearLabel = moment().format('YYYY');

export default function MonthItem() {
  const [top30ModalShown, setTop30ModalShown] = useState(false);
  const top30sMonthly = useNotiContext((v) => v.state.top30sMonthly);
  const top3 = useMemo(() => {
    return top30sMonthly.slice(0, 3);
  }, [top30sMonthly]);

  return (
    <div
      className={css`
        background: #fff;
        padding: 1rem;
        border: 1px solid ${Color.borderGray()};
        border-radius: ${borderRadius};
      `}
    >
      <p
        className={css`
          font-size: 2rem;
          font-weight: bold;
          @media (max-width: ${mobileMaxWidth}) {
            font-size: 1.7rem;
          }
        `}
      >
        {monthLabel}
      </p>
      <div
        style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}
      >
        {top3.map((user, index) => (
          <TopRanker
            key={user.id}
            style={{ marginLeft: index === 0 ? 0 : '1rem' }}
            username={user.username}
            profilePicUrl={user.profilePicUrl}
            userId={user.id}
            rank={user.rank}
          />
        ))}
      </div>
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a
          style={{ fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => setTop30ModalShown(true)}
        >
          Show Top 30
        </a>
      </div>
      {top30ModalShown && (
        <Top30Modal
          month={monthLabel}
          year={yearLabel}
          users={top30sMonthly}
          onHide={() => setTop30ModalShown(false)}
        />
      )}
    </div>
  );
}
