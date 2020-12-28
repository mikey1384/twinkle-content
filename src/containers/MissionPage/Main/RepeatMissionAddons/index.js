import React from 'react';
import PropTypes from 'prop-types';
import GrammarReview from './GrammarReview';

RepeatMissionAddon.propTypes = {
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired
};

export default function RepeatMissionAddon({ mission, onSetMissionState }) {
  return (
    <div style={{ width: '100%' }}>
      {(!mission.started || mission.failed) && (
        <GrammarReview
          mission={mission}
          onSetMissionState={onSetMissionState}
          style={{ marginTop: '1.5rem' }}
        />
      )}
    </div>
  );
}
