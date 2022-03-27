import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'components/Modal';
import Button from 'components/Button';
import Daily from './Daily';
import FilterBar from 'components/FilterBar';

WordleModal.propTypes = {
  channelId: PropTypes.number,
  nextWordTimeStamp: PropTypes.number,
  wordleSolution: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired
};

export default function WordleModal({
  channelId,
  nextWordTimeStamp,
  wordleSolution,
  onHide
}) {
  return (
    <Modal onHide={onHide}>
      <header>Wordle</header>
      <main>
        <FilterBar
          style={{
            marginTop: '-2rem',
            fontSize: '1.5rem',
            height: '5rem'
          }}
        >
          <nav>Earn XP</nav>
          <nav className="active">{`Today's Wordle`}</nav>
          <nav>Rankings</nav>
        </FilterBar>
        <Daily
          channelId={channelId}
          nextWordTimeStamp={nextWordTimeStamp}
          wordleSolution={wordleSolution}
        />
      </main>
      <footer>
        <Button transparent style={{ marginRight: '0.7rem' }} onClick={onHide}>
          Close
        </Button>
      </footer>
    </Modal>
  );
}
