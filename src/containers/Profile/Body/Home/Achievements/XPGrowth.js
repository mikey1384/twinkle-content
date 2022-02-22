import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import MonthlyXPBarChart from './MonthlyXPBarChart';
import CompositionPieChart from './CompositionPieChart';
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
  const loadXpComposition = useAppContext(
    (v) => v.requestHelpers.loadXpComposition
  );
  const [monthlyXPData, setMonthlyXPData] = useState([]);
  const [xpCompositionData, setXpCompositionData] = useState([]);
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
      if (userId) {
        await Promise.all([handleLoadXpComposition(), handleLoadMonthlyXP()]);
        if (mounted.current) {
          setLoaded(true);
        }
      }
    }
    async function handleLoadXpComposition() {
      const data = await loadXpComposition(userId);
      if (mounted.current) {
        setXpCompositionData(data);
      }
      return Promise.resolve();
    }
    async function handleLoadMonthlyXP() {
      const data = await loadMonthlyXp(userId);
      if (mounted.current) {
        setMonthlyXPData(data);
      }
      return Promise.resolve();
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
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent:
              xpCompositionData.length > 0 ? 'space-between' : 'center'
          }}
        >
          <MonthlyXPBarChart data={monthlyXPData} colorTheme={selectedTheme} />
          {xpCompositionData.length > 0 && (
            <CompositionPieChart data={xpCompositionData} />
          )}
        </div>
      </SectionPanel>
    </ErrorBoundary>
  );
}
