import React, { Children, useMemo } from 'react';
import Button from 'components/Button';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Icon from 'components/Icon';

MultiStepContainer.propTypes = {
  children: PropTypes.node,
  buttons: PropTypes.array,
  taskId: PropTypes.number.isRequired,
  onSetMissionState: PropTypes.func.isRequired,
  selectedIndex: PropTypes.number
};

export default function MultiStepContainer({
  children,
  buttons,
  taskId,
  onSetMissionState,
  selectedIndex = 0
}) {
  const childrenArray = useMemo(() => Children.toArray(children), [children]);
  const NextButton = useMemo(() => {
    const CustomButton = buttons
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
          onClick={
            buttonObj.onClick
              ? () => buttonObj.onClick(handleGoNext)
              : handleGoNext
          }
        >
          {buttonObj.label}
        </Button>
      ));
    if (CustomButton) {
      return CustomButton;
    }
    if (selectedIndex < childrenArray.length - 1) {
      return (
        <Button filled color="logoBlue" onClick={handleGoNext}>
          Next
        </Button>
      );
    }

    function handleGoNext() {
      onSetMissionState({
        missionId: taskId,
        newState: {
          selectedIndex: selectedIndex + 1
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttons, selectedIndex, childrenArray.length, taskId]);

  return (
    <ErrorBoundary style={{ width: '100%' }}>
      <div style={{ width: '100%' }}>
        {childrenArray.filter((child, index) => index === selectedIndex)}
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          marginTop: '2rem'
        }}
      >
        {NextButton}
        {selectedIndex > 0 && (
          <Button
            filled
            marginTop={NextButton ? '1rem' : 0}
            color="darkGray"
            onClick={() =>
              onSetMissionState({
                missionId: taskId,
                newState: {
                  selectedIndex: Math.max(selectedIndex - 1, 0)
                }
              })
            }
          >
            <Icon icon="arrow-left" />
            <span style={{ marginLeft: '0.7rem' }}>Back</span>
          </Button>
        )}
      </div>
    </ErrorBoundary>
  );
}
