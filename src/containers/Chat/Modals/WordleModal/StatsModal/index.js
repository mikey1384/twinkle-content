import React from 'react';
import PropTypes from 'prop-types';
import StatBar from './StatBar';
import Modal from 'components/Modal';
import Button from 'components/Button';
import { STATISTICS_TITLE } from '../constants/strings';

StatsModal.propTypes = {
  onHide: PropTypes.func
};

const gameStats = {
  totalGames: 3,
  successRate: 100,
  currentStreak: 3,
  bestStreak: 3
};

export default function StatsModal({ onHide }) {
  return (
    <Modal small modalOverModal onHide={onHide}>
      <header>{STATISTICS_TITLE}</header>
      <main>
        <StatBar gameStats={gameStats} />
      </main>
      <footer>
        <Button transparent onClick={onHide}>
          Close
        </Button>
      </footer>
    </Modal>
  );
}
