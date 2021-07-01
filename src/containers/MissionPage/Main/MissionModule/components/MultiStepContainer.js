import React, { Children, useMemo, useState } from 'react';
import Button from 'components/Button';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';

MultiStepContainer.propTypes = {
  children: PropTypes.node
};

export default function MultiStepContainer({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const childrenArray = useMemo(() => Children.toArray(children), [children]);

  return (
    <ErrorBoundary style={{ width: '100%' }}>
      <div style={{ width: '100%' }}>
        {childrenArray.filter((child, index) => index === selectedIndex)}
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Button
          skeuomorphic
          color="logoBlue"
          onClick={() => setSelectedIndex(1)}
        >
          I created a github account
        </Button>
      </div>
    </ErrorBoundary>
  );
}
