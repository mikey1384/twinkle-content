import React, { Children, useMemo, useState } from 'react';
import Button from 'components/Button';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';

MultiStepContainer.propTypes = {
  children: PropTypes.node,
  nextButtons: PropTypes.array
};

export default function MultiStepContainer({ children, nextButtons }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const childrenArray = useMemo(() => Children.toArray(children), [children]);

  return (
    <ErrorBoundary style={{ width: '100%' }}>
      <div style={{ width: '100%' }}>
        {childrenArray.filter((child, index) => index === selectedIndex)}
      </div>
      <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        {nextButtons
          .filter(
            (buttonObj, index) =>
              index === selectedIndex && index < childrenArray.length - 1
          )
          .map((buttonObj, index) => (
            <Button
              key={index}
              color={buttonObj.color || 'logoBlue'}
              skeuomorphic={buttonObj.skeuomorphic}
              filled={buttonObj.filled}
              onClick={() =>
                setSelectedIndex((selectedIndex) => selectedIndex + 1)
              }
            >
              {buttonObj.label}
            </Button>
          ))}
      </div>
    </ErrorBoundary>
  );
}
