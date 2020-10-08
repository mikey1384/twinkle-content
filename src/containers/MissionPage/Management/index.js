import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAppContext } from 'contexts';

Management.propTypes = {
  missionId: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default function Management({ missionId }) {
  const {
    requestHelpers: { loadMissionAttempts }
  } = useAppContext();
  useEffect(() => {
    init();

    async function init() {
      const data = await loadMissionAttempts(missionId);
      console.log(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div>this is where you manage students submissions</div>
    </div>
  );
}
