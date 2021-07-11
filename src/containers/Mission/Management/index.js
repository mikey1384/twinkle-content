import React from 'react';
import PropTypes from 'prop-types';
import Attempts from './Attempts';
import ErrorBoundary from 'components/ErrorBoundary';

Management.propTypes = {
  attemptObj: PropTypes.object,
  managementObj: PropTypes.object,
  selectedTab: PropTypes.string,
  onSelectTab: PropTypes.func.isRequired,
  onSetAttemptObj: PropTypes.func.isRequired,
  onSetManagementObj: PropTypes.func.isRequired
};

export default function Management({
  attemptObj,
  managementObj,
  selectedTab,
  onSelectTab,
  onSetAttemptObj,
  onSetManagementObj
}) {
  return (
    <ErrorBoundary style={{ width: '100%', marginBottom: '10rem' }}>
      <Attempts
        attemptObj={attemptObj}
        managementObj={managementObj}
        selectedTab={selectedTab}
        onSelectTab={onSelectTab}
        onSetAttemptObj={onSetAttemptObj}
        onSetManagementObj={onSetManagementObj}
      />
    </ErrorBoundary>
  );
}
