import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FilterBar from 'components/FilterBar';
import Loading from 'components/Loading';
import { useAppContext } from 'contexts';
import { useMyState } from 'helpers/hooks';

SubmittedQuestions.propTypes = {
  style: PropTypes.object,
  mission: PropTypes.object.isRequired,
  onSetMissionState: PropTypes.func.isRequired
};

export default function SubmittedQuestions({
  style,
  mission,
  onSetMissionState
}) {
  const { canEdit } = useMyState();
  const { managementTab: activeTab = 'pending' } = mission;
  const {
    requestHelpers: { loadGrammarQuestions }
  } = useAppContext();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (canEdit) {
      init();
    }
    async function init() {
      setLoading(true);
      const {
        questionObj,
        [`${activeTab}QuestionIds`]: questionIds,
        loadMoreButton
      } = await loadGrammarQuestions(activeTab);
      onSetMissionState({
        missionId: mission.id,
        newState: {
          [`${activeTab}QuestionIds`]: questionIds,
          questionObj: { ...mission.questionObj, ...questionObj },
          loadMoreButton
        }
      });
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, canEdit]);

  return (
    <div style={style}>
      <FilterBar
        bordered
        style={{
          fontSize: '1.6rem',
          height: '5rem'
        }}
      >
        <nav
          className={activeTab === 'pending' ? 'active' : null}
          onClick={() => {
            onSetMissionState({
              missionId: mission.id,
              newState: { managementTab: 'pending' }
            });
          }}
        >
          Pending
        </nav>
        <nav
          className={activeTab === 'pass' ? 'active' : null}
          onClick={() => {
            onSetMissionState({
              missionId: mission.id,
              newState: { managementTab: 'pass' }
            });
          }}
        >
          Approved
        </nav>
      </FilterBar>
      {loading ? (
        <Loading />
      ) : (
        <>
          {mission[`${activeTab}QuestionIds`]?.map((questionId) => {
            const question = mission.questionObj[questionId];
            return <div key={questionId}>{question.content}</div>;
          })}
        </>
      )}
    </div>
  );
}
