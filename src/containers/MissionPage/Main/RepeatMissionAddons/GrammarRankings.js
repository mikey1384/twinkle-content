import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAppContext } from 'contexts';

GrammarRankings.propTypes = {
  missionId: PropTypes.number.isRequired
};

export default function GrammarRankings({ missionId }) {
  const {
    requestHelpers: { loadMissionRankings }
  } = useAppContext();
  useEffect(() => {
    loadMissionRankings(missionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div>this is grammar rankings component</div>
    </div>
  );
}
