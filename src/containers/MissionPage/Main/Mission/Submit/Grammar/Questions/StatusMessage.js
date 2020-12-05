import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { Color } from 'constants/css';
import LongText from 'components/Texts/LongText';

StatusMessage.propTypes = {
  failMessage: PropTypes.string,
  passMessage: PropTypes.string,
  status: PropTypes.string
};

export default function StatusMessage({ status, passMessage, failMessage }) {
  return (
    <div
      style={{
        borderTop: `1px solid ${Color.borderGray()}`,
        borderBottom: `1px solid ${Color.borderGray()}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '2rem',
        marginLeft: '-1rem',
        marginRight: '-1rem',
        marginBottom: '-1rem',
        fontSize: '1.5rem',
        padding: '1.5rem'
      }}
    >
      <Icon
        size="2x"
        style={{ color: status === 'pass' ? Color.green() : Color.rose() }}
        icon={status === 'pass' ? 'check' : 'times'}
      />
      <LongText style={{ marginLeft: '2rem', fontSize: '1.7rem' }}>
        {status === 'pass' ? passMessage : failMessage}
      </LongText>
    </div>
  );
}
