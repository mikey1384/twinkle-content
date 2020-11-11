import React from 'react';
import PropTypes from 'prop-types';
import SectionPanel from 'components/SectionPanel';

Pictures.propTypes = {
  selectedTheme: PropTypes.string
};

export default function Pictures({ selectedTheme }) {
  return (
    <SectionPanel customColorTheme={selectedTheme} loaded title="Pictures">
      <div>Some pics</div>
    </SectionPanel>
  );
}
