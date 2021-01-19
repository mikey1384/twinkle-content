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
      {deletedPosts.map((post) => (
        <DeletedContent
          key={post.id}
          contentId={post.contentId}
          contentType={post.type}
        />
      ))}
    </div>
  );
}
