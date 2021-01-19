import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAppContext } from 'contexts';

DeletedContent.propTypes = {
  contentId: PropTypes.number,
  contentType: PropTypes.string
};

export default function DeletedContent({ contentId, contentType }) {
  const {
    requestHelpers: { loadDeletedContent }
  } = useAppContext();
  useEffect(() => {
    init();
    async function init() {
      const data = await loadDeletedContent({ contentId, contentType });
      console.log(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div>deleted</div>
    </div>
  );
}
