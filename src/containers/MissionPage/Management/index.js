import React from 'react';
import PropTypes from 'prop-types';
import Attempts from './Attempts';
import InvalidPage from 'components/InvalidPage';
import ErrorBoundary from 'components/ErrorBoundary';
import { useMyState } from 'helpers/hooks';

Management.propTypes = {
  mission: PropTypes.object,
  missionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onSetMissionState: PropTypes.func.isRequired
};

export default function Management({ mission, missionId, onSetMissionState }) {
  const { canEdit } = useMyState();
  if (!canEdit) {
    return (
      <InvalidPage
        title="For moderators only"
        text="You are not authorized to view this page"
      />
    );
  }

  return (
    <ErrorBoundary style={{ width: '100%', marginBottom: '10rem' }}>
      <Attempts
        mission={mission}
        missionId={missionId}
        onSetMissionState={onSetMissionState}
      />
    </ErrorBoundary>
  );
}
