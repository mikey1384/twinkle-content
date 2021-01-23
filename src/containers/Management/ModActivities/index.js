import React, { useEffect, useState } from 'react';
import { useAppContext } from 'contexts';
import DeletedContent from './DeletedContent';

export default function ModActivities() {
  const [loaded, setLoaded] = useState(false);
  const [deletedPosts, setDeletedPosts] = useState([]);
  const {
    requestHelpers: { loadDeletedPosts }
  } = useAppContext();
  useEffect(() => {
    init();
    async function init() {
      const data = await loadDeletedPosts();
      setDeletedPosts(data);
      setLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Deleted Posts</h2>
      <div style={{ marginTop: '2rem' }}>
        {loaded && deletedPosts.length === 0 && (
          <div
            style={{
              width: '100%',
              height: '25rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              fontSize: '2rem'
            }}
          >
            There are no newly deleted posts
          </div>
        )}
        {deletedPosts.map((post, index) => (
          <DeletedContent
            key={post.id}
            onDeletePermanently={() =>
              setDeletedPosts((deletedPosts) =>
                deletedPosts.filter((deletedPost) => deletedPost.id !== post.id)
              )
            }
            postId={post.id}
            contentId={post.contentId}
            contentType={post.type}
            style={{ marginTop: index === 0 ? 0 : '1rem' }}
          />
        ))}
      </div>
      <div style={{ height: '10rem' }} />
    </div>
  );
}
