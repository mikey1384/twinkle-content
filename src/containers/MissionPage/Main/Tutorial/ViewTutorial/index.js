import React from 'react';
import PropTypes from 'prop-types';
import { panel } from '../../../Styles';
import UserView from './UserView';

ViewTutorial.propTypes = {
  isCreator: PropTypes.bool,
  onStartClick: PropTypes.func.isRequired,
  style: PropTypes.object,
  tutorialPrompt: PropTypes.string,
  tutorialButtonLabel: PropTypes.string
};

export default function ViewTutorial({
  isCreator,
  onStartClick,
  style,
  tutorialPrompt,
  tutorialButtonLabel
}) {
  return (
    <div className={panel} style={{ padding: '2rem', width: '100%', ...style }}>
      {isCreator ? (
        <div>Author view</div>
      ) : (
        <UserView
          tutorialPrompt={tutorialPrompt}
          tutorialButtonLabel={tutorialButtonLabel}
          onStartClick={onStartClick}
        />
      )}
    </div>
  );
}
