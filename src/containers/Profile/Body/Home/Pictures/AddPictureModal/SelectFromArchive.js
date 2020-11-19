import React, { useEffect, useRef, useState } from 'react';
import { useAppContext } from 'contexts';
import Loading from 'components/Loading';
import Picture from './Picture';

export default function SelectFromArchive() {
  const {
    requestHelpers: { loadAllPictures }
  } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [pictures, setPictures] = useState([]);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    init();
    async function init() {
      setLoading(true);
      const pics = await loadAllPictures();
      if (mounted.current) {
        setPictures(pics);
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
        <Loading />
      ) : (
        pictures.map((picture) => (
          <Picture
            key={picture.id}
            picture={picture}
            style={{ margin: '0.5rem' }}
          />
        ))
      )}
    </div>
  );
}
