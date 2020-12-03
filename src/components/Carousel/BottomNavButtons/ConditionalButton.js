import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';

ConditionalButton.propTypes = {
  conditionPassStatus: PropTypes.string.isRequired,
  onCheckNavCondition: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
};

export default function ConditionalButton({
  conditionPassStatus,
  onCheckNavCondition,
  onNext
}) {
  const buttonColor = useMemo(() => {
    if (conditionPassStatus === 'fail') {
      return 'rose';
    }
    return 'green';
  }, [conditionPassStatus]);
  const onClick = useMemo(() => {
    if (conditionPassStatus) {
      return onNext;
    }
    return onCheckNavCondition;
  }, [conditionPassStatus, onCheckNavCondition, onNext]);

  return (
    <Button filled color={buttonColor} onClick={onClick}>
      {conditionPassStatus ? 'Continue' : 'Check'}
    </Button>
  );
}
