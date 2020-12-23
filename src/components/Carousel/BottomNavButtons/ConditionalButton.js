import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';

ConditionalButton.propTypes = {
  conditionPassStatus: PropTypes.string.isRequired,
  onCheckNavCondition: PropTypes.func.isRequired,
  nextButtonDisabled: PropTypes.bool
};

export default function ConditionalButton({
  conditionPassStatus,
  onCheckNavCondition,
  nextButtonDisabled
}) {
  const buttonColor = useMemo(() => {
    if (conditionPassStatus === 'fail') {
      return 'rose';
    }
    return 'green';
  }, [conditionPassStatus]);

  return (
    <Button
      disabled={nextButtonDisabled}
      filled
      color={buttonColor}
      onClick={onCheckNavCondition}
    >
      {conditionPassStatus ? 'Continue' : 'Check'}
    </Button>
  );
}
