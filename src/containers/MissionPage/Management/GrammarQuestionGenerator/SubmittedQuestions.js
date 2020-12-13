import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import FilterBar from 'components/FilterBar';
import Loading from 'components/Loading';
import QuestionListItem from './QuestionListItem';
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
          className={activeTab === 'approved' ? 'active' : null}
          onClick={() => {
            onSetMissionState({
              missionId: mission.id,
              newState: { managementTab: 'approved' }
            });
          }}
        >
          Approved
        </nav>
      </FilterBar>
      {loading ? (
        <Loading />
      ) : mission[`${activeTab}QuestionIds`]?.length === 0 ? (
        <div
          style={{
            marginTop: '10rem',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            width: '100%',
            textAlign: 'center'
          }}
        >
          {`There are no ${activeTab} questions`}
        </div>
      ) : (
        <>
          {mission[`${activeTab}QuestionIds`]?.map((questionId, index) => {
            const question = mission.questionObj[questionId];
            return (
              <QuestionListItem
                key={questionId}
                question={question}
                onApproveQuestion={() =>
                  onSetMissionState({
                    missionId: mission.id,
                    newState: {
                      pendingQuestionIds: mission.pendingQuestionIds.filter(
                        (id) => id !== questionId
                      ),
                      questionObj: {
                        ...mission.questionObj,
                        [questionId]: {
                          ...mission.questionObj[questionId],
                          isApproved: true
                        }
                      }
                    }
                  })
                }
                style={{ marginTop: index === 0 ? 0 : '1rem' }}
              />
            );
          })}
        </>
      )}
    </div>
  );
}
