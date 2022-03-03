import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import SectionPanel from 'components/SectionPanel';
import localize from 'constants/localize';
import { useAppContext } from 'contexts';

const missionProgressLabel = localize('missionProgress');

MissionProgress.propTypes = {
  selectedTheme: PropTypes.string,
  style: PropTypes.object,
  userId: PropTypes.number
};

export default function MissionProgress({ selectedTheme, style, userId }) {
  const loadMissionProgress = useAppContext(
    (v) => v.requestHelpers.loadMissionProgress
  );
  const [loaded, setLoaded] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (userId) {
      handleLoadMissionProgress(userId);
    }

    async function handleLoadMissionProgress(userId) {
      const data = await loadMissionProgress(userId);
      if (mounted.current) {
        console.log(data);
      }
      if (mounted.current) {
        setLoaded(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <ErrorBoundary>
      <SectionPanel
        customColorTheme={selectedTheme}
        title={missionProgressLabel}
        loaded={loaded}
        style={style}
      >
        <div>testing</div>
      </SectionPanel>
    </ErrorBoundary>
  );
}
