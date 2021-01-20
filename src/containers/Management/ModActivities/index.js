import React, { useEffect, useState } from 'react';
import { useAppContext } from 'contexts';
import DeletedContent from './DeletedContent';

export default function ModActivities() {
  const [deletedPosts, setDeletedPosts] = useState([]);
  const {
    requestHelpers: { loadDeletedPosts }
  } = useAppContext();
  useEffect(() => {
    init();
    async function init() {
      const data = await loadDeletedPosts();
      setDeletedPosts(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2 style={{ marginTop: '1rem' }}>Deleted Posts</h2>
      <div style={{ marginTop: '2rem' }}>
        {deletedPosts.map((post, index) => (
          <DeletedContent
            key={post.id}
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
