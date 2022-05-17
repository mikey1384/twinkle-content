import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import ImageEditModal from 'components/Modals/ImageEditModal';
import AlertModal from 'components/Modals/AlertModal';
import ErrorBoundary from 'components/ErrorBoundary';
import ProfileWidget from 'components/ProfileWidget';
import HomeMenuItems from 'components/HomeMenuItems';
import Notification from 'components/Notification';
import People from './People';
import Earn from './Earn';
import Store from './Store';
import Stories from './Stories';
import LocalContext from './Context';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from 'contexts';
import { useMyState } from 'helpers/hooks';
import { container, Left, Center, Right } from './Styles';

Home.propTypes = {
  onFileUpload: PropTypes.func
};

function Home({ onFileUpload }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useMyState();
  const onSetUserState = useAppContext((v) => v.user.actions.onSetUserState);
  const [alertModalShown, setAlertModalShown] = useState(false);
  const [imageEditModalShown, setImageEditModalShown] = useState(false);
  const [imageUri, setImageUri] = useState(null);

  return (
    <ErrorBoundary>
      <LocalContext.Provider
        value={{
          onFileUpload
        }}
      >
        <div className={container}>
          <div className={Left}>
            <ProfileWidget
              navigate={navigate}
              onShowAlert={() => setAlertModalShown(true)}
              onLoadImage={(upload) => {
                setImageEditModalShown(true);
                setImageUri(upload.target.result);
              }}
            />
            <HomeMenuItems
              style={{ marginTop: '1rem' }}
              navigate={navigate}
              location={location}
            />
          </div>
          <div className={Center}>
            <div style={{ maxWidth: '700px', width: '100%' }}>
              <Routes>
                <Route
                  path="/users"
                  render={({ history, location }) => (
                    <People location={location} history={history} />
                  )}
                />
                <Route
                  exact
                  path="/earn"
                  render={({ location, history }) => (
                    <Earn location={location} history={history} />
                  )}
                />
                <Route
                  exact
                  path="/store"
                  render={({ location, history }) => (
                    <Store location={location} history={history} />
                  )}
                />
                <Route path="*" element={<Stories />} />
              </Routes>
            </div>
          </div>
          <Notification trackScrollPosition className={Right} location="home" />
          {imageEditModalShown && (
            <ImageEditModal
              isProfilePic
              imageUri={imageUri}
              onEditDone={handleImageEditDone}
              onHide={() => {
                setImageUri(null);
                setImageEditModalShown(false);
              }}
            />
          )}
          {alertModalShown && (
            <AlertModal
              title="Image is too large (limit: 10mb)"
              content="Please select a smaller image"
              onHide={() => setAlertModalShown(false)}
            />
          )}
        </div>
      </LocalContext.Provider>
    </ErrorBoundary>
  );

  function handleImageEditDone({ filePath }) {
    onSetUserState({
      userId,
      newState: { profilePicUrl: `/profile/${filePath}` }
    });
    setImageEditModalShown(false);
  }
}

export default memo(Home);
