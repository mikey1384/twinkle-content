import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import { useOutsideClick } from 'helpers/hooks';

Content.propTypes = {
  closeWhenClickedOutside: PropTypes.bool,
  onHide: PropTypes.func,
  className: PropTypes.string,
  children: PropTypes.node,
  style: PropTypes.object
};

export default function Content({
  closeWhenClickedOutside,
  children,
  className,
  onHide,
  style
}) {
  const ContentRef = useRef(null);
  useOutsideClick(ContentRef, () =>
    closeWhenClickedOutside ? onHide?.() : null
  );
  return (
    <div style={style} className={className} ref={ContentRef}>
      <button className="close" onClick={onHide}>
        <Icon icon="times" />
      </button>
      {children}
    </div>
  );
}
