import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from 'contexts';
import Loading from 'components/Loading';
import ArchivedPicture from './ArchivedPicture';
import Button from 'components/Button';

export default function SelectFromArchive() {
  const {
    requestHelpers: { loadUserPictures }
  } = useAppContext();
  const [loadMoreButtonShown, setLoadMoreButtonShown] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pictures, setPictures] = useState([]);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    init();
    async function init() {
      setLoading(true);
      const { pictures: pics, loadMoreShown } = await loadUserPictures();
      if (mounted.current) {
        setPictures(pics);
        setLoadMoreButtonShown(loadMoreShown);
        setLoading(false);
      }
    }

    return function onUnmount() {
      mounted.current = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: '-1rem'
      }}
    >
      {loading ? (
        <Loading style={{ height: '10rem' }} />
      ) : (
        pictures.map((picture) => (
          <ArchivedPicture
            key={picture.id}
            picture={picture}
            style={{ margin: '0.5rem', cursor: 'pointer' }}
          />
        ))
      )}
      {loadMoreButtonShown && (
        <Button
          style={{ marginTop: '2rem', width: '100%', fontSize: '2rem' }}
          transparent
          onClick={handleLoadMore}
          disabled={loadingMore}
        >
          Load More
        </Button>
      )}
    </div>
  );

  async function handleLoadMore() {
    setLoadingMore(true);
    const { pictures: pics, loadMoreShown } = await loadUserPictures(
      pictures[pictures.length - 1].id
    );
    setPictures((pictures) => pictures.concat(pics));
    setLoadMoreButtonShown(loadMoreShown);
    setLoadingMore(false);
  }
}
