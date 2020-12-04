import React from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { Color } from 'constants/css';

StatusMessage.propTypes = {
  status: PropTypes.string
};

export default function StatusMessage({ status }) {
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
        style={{ color: status === 'fail' ? Color.rose() : Color.green() }}
        icon={status === 'fail' ? 'times' : 'check'}
      />
      <p style={{ marginLeft: '2rem', fontSize: '1.7rem' }}>
        this is a status message {status}
      </p>
    </div>
  );
}
