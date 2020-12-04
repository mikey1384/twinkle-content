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

  return (
    <Button filled color={buttonColor} onClick={handleClick}>
      {conditionPassStatus ? 'Continue' : 'Check'}
    </Button>
  );

  function handleClick() {
    if (conditionPassStatus === 'pass') {
      return onNext();
    }
    return onCheckNavCondition();
  }
}
