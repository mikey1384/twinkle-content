import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';
import localize from 'constants/localize';

const missionProgressLabel = localize('missionProgress');

MissionProgress.propTypes = {
  selectedTheme: PropTypes.string,
  style: PropTypes.object
};

export default function MissionProgress({ selectedTheme, style }) {
  return (
    <ErrorBoundary>
      <SectionPanel
        customColorTheme={selectedTheme}
        title={missionProgressLabel}
        loaded={false}
        style={style}
      >
        <div>testing</div>
      </SectionPanel>
    </ErrorBoundary>
  );
}
