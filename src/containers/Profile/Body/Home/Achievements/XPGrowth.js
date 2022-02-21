import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import MonthlyXPBarChart from './MonthlyXPBarChart';
import ErrorBoundary from 'components/ErrorBoundary';
import { useAppContext } from 'contexts';
import localize from 'constants/localize';

const xpAnalysisLabel = localize('xpAnalysis');

XPGrowth.propTypes = {
  selectedTheme: PropTypes.string,
  userId: PropTypes.number.isRequired,
  style: PropTypes.object
};

export default function XPGrowth({ selectedTheme, userId, style }) {
  const loadMonthlyXp = useAppContext((v) => v.requestHelpers.loadMonthlyXp);
  const [monthlyXPData, setMonthlyXPData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return function cleanUp() {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    init();
    async function init() {
      const data = await loadMonthlyXp(userId);
      if (mounted.current) {
        setMonthlyXPData(data);
        setLoaded(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return (
    <ErrorBoundary>
      <SectionPanel
        customColorTheme={selectedTheme}
        title={xpAnalysisLabel}
        loaded={loaded}
        style={style}
      >
        <MonthlyXPBarChart data={monthlyXPData} colorTheme={selectedTheme} />
      </SectionPanel>
    </ErrorBoundary>
  );
}
