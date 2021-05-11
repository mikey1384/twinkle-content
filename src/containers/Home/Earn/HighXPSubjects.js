import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { panel } from './Styles';
import { useAppContext } from 'contexts';
import Icon from 'components/Icon';
import ContentListItem from 'components/ContentListItem';
import Button from 'components/Button';

HighXPSubjects.propTypes = {
  style: PropTypes.object
};

export default function HighXPSubjects({ style }) {
  const [subjects, setSubjects] = useState([]);
  const {
    requestHelpers: { loadHighXPSubjects }
  } = useAppContext();
  useEffect(() => {
    handleLoadHighXPSubjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={style} className={panel}>
      <p>{`Random High XP Subject`}</p>
      <div style={{ marginTop: '1.5rem' }}>
        {subjects.map((subject) => (
          <ContentListItem key={subject.id} contentObj={subject} />
        ))}
        <div
          style={{
            marginTop: '1rem',
            width: '100%',
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <Button skeuomorphic color="green" onClick={handleLoadHighXPSubjects}>
            <Icon icon="redo" />
            <span style={{ marginLeft: '0.7rem' }}>
              Show me another subject
            </span>
          </Button>
        </div>
      </div>
    </div>
  );

  async function handleLoadHighXPSubjects() {
    const data = await loadHighXPSubjects();
    setSubjects(data);
  }
}
