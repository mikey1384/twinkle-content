import React from 'react';
import PropTypes from 'prop-types';
import FilterBar from 'components/FilterBar';
import localize from 'constants/localize';

const myRankingLabel = localize('myRanking');
const top30Label = localize('top30');

Rankings.propTypes = {
  onSetRankingsTab: PropTypes.func.isRequired,
  rankingsTab: PropTypes.string.isRequired
};

export default function Rankings({ rankingsTab, onSetRankingsTab }) {
  return (
    <div>
      <FilterBar
        bordered
        style={{
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
    </div>
  );
}
