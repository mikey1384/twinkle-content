import React from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';
import Frame from './Frame';

Pictures.propTypes = {
  selectedTheme: PropTypes.string
};

export default function Pictures({ selectedTheme }) {
  return (
    <SectionPanel customColorTheme={selectedTheme} loaded title="Pictures">
      <Frame />
      <Frame />
      <Frame />
      <Frame />
    </SectionPanel>
  );
}
