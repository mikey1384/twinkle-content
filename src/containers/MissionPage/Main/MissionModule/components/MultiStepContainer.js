import React, { Children, useEffect, useMemo, useState } from 'react';
import Button from 'components/Button';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import { useAppContext, useContentContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

MultiStepContainer.propTypes = {
  children: PropTypes.node,
  buttons: PropTypes.array,
  taskId: PropTypes.number.isRequired,
  taskType: PropTypes.string.isRequired
};

export default function MultiStepContainer({
  children,
  buttons = [],
  taskId,
  taskType
}) {
  const { userId, state } = useMyState();
  const {
    requestHelpers: { updateMissionStatus }
  } = useAppContext();
  const {
    actions: { onUpdateMissionState }
  } = useContentContext();
  const selectedIndex = useMemo(
    () => state?.missions?.[taskType]?.selectedIndex || 0,
    [state?.missions, taskType]
  );
  const [helpButtonPressed, setHelpButtonPressed] = useState(false);
  useEffect(() => {
    setHelpButtonPressed(false);
  }, [selectedIndex]);
  const childrenArray = useMemo(() => Children.toArray(children), [children]);
  const NextButton = useMemo(() => {
    const DefaultButton = (
      <Button skeuomorphic filled color="logoBlue" onClick={handleGoNext}>
        Next
      </Button>
    );
    const CustomButton = buttons
      .filter(
        (buttonObj, index) =>
          index === selectedIndex && index < childrenArray.length - 1
      )
      .map((buttonObj, index) =>
        buttonObj ? (
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
        ) : (
          DefaultButton
        )
      )?.[0];
    if (CustomButton) {
      return CustomButton;
    }
    if (selectedIndex < childrenArray.length - 1) {
      return DefaultButton;
    }

    async function handleGoNext() {
      await handleUpdateSelectedIndex(selectedIndex + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buttons, selectedIndex, childrenArray.length, taskId]);

  return (
    <ErrorBoundary style={{ width: '100%' }}>
      <div style={{ width: '100%', minHeight: '7rem' }}>
        {childrenArray.filter((child, index) => index === selectedIndex)}
      </div>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginTop: '2rem'
        }}
      >
        {NextButton}
        {selectedIndex > 0 && (
          <Button
            skeuomorphic
            style={{ marginTop: NextButton ? '7rem' : '3rem' }}
            color="black"
            onClick={() =>
              handleUpdateSelectedIndex(Math.max(selectedIndex - 1, 0))
            }
          >
            <Icon icon="arrow-left" />
            <span style={{ marginLeft: '0.7rem' }}>Back</span>
          </Button>
        )}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            fontSize: '1.7rem',
            marginTop: '5rem'
          }}
        >
          {!helpButtonPressed ? (
            <Button
              skeuomorphic
              color="pink"
              onClick={() => setHelpButtonPressed(true)}
            >
              {`I don't understand what I am supposed to do`}
            </Button>
          ) : (
            <div style={{ marginTop: '3rem', marginBottom: '-1rem' }}>
              Read the <b style={{ color: Color.green() }}>tutorial</b> below{' '}
              <Icon icon="arrow-down" />
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );

  async function handleUpdateSelectedIndex(newIndex) {
    await updateMissionStatus({
      missionType: taskType,
      newStatus: { selectedIndex: newIndex }
    });
    onUpdateMissionState({
      userId,
      missionType: taskType,
      newState: { selectedIndex: newIndex }
    });
  }
}
