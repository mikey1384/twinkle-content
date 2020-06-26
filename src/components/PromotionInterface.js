import React from 'react';
import PropTypes from 'prop-types';
import ErrorBoundary from 'components/ErrorBoundary';
import Button from 'components/Button';
import Icon from 'components/Icon';
import { Color } from 'constants/css';

PromotionInterface.propTypes = {
  contentType: PropTypes.string.isRequired,
  onHide: PropTypes.func.isRequired
};

export default function PromotionInterface({ contentType, onHide }) {
  return (
    <ErrorBoundary
      style={{
        background: Color.brownOrange(),
        color: '#fff',
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem'
      }}
    >
      <div>
        <div>
          <span style={{ fontWeight: 'bold' }}>
            <span style={{ marginRight: '0.7rem' }}>
              Promote this {contentType}?
            </span>
            (
            <Icon icon={['far', 'badge-dollar']} />
            <span style={{ marginLeft: '0.3rem' }}>2</span>)
          </span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Button color="darkBlue" skeuomorphic>
          Yes
        </Button>
        <Button
          onClick={onHide}
          style={{ marginLeft: '0.7rem' }}
          color="rose"
          skeuomorphic
        >
          No
        </Button>
      </div>
    </ErrorBoundary>
  );
}
