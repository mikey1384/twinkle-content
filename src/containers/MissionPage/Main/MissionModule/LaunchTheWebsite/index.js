import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import MultiStepContainer from '../components/MultiStepContainer';
import WebsiteVerfier from './WebsiteVerifier';

LaunchTheWebsite.propTypes = {
  style: PropTypes.object,
  task: PropTypes.object
};

export default function LaunchTheWebsite({ style, task }) {
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return function onDismount() {
      mounted.current = false;
    };
  }, []);

  return (
    <ErrorBoundary style={style}>
      <MultiStepContainer taskId={task.id} taskType={task.missionType}>
        <WebsiteVerfier />
      </MultiStepContainer>
    </ErrorBoundary>
  );
}
