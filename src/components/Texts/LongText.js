import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { limitBrs, processedStringWithURL } from 'helpers/stringHelpers';
import { Color } from 'constants/css';
import { useContentState } from 'helpers/hooks';
import { useContentContext } from 'contexts';

LongText.propTypes = {
  children: PropTypes.string,
  className: PropTypes.string,
  cleanString: PropTypes.bool,
  contentId: PropTypes.number,
  contentType: PropTypes.string,
  maxLines: PropTypes.number,
  section: PropTypes.string,
  style: PropTypes.object,
  readMoreColor: PropTypes.string
};

export default function LongText({
  style,
  className,
  cleanString,
  children: text,
  contentId,
  contentType,
  section,
  maxLines = 10,
  readMoreColor = Color.blue()
}) {
  const {
    actions: { onSetFullTextState }
  } = useContentContext();
  const ContainerRef = useRef(null);
  const contentState =
    contentType && section ? useContentState({ contentType, contentId }) : {};
  const { fullTextState = {} } = contentState;
  const fullTextRef = useRef(fullTextState[section]);
  const [fullText, setFullText] = useState(fullTextState[section]);
  const [isOverflown, setIsOverflown] = useState(false);

  useEffect(() => {
    if (
      ContainerRef.current?.scrollHeight > ContainerRef.current?.clientHeight
    ) {
      setIsOverflown(true);
    }
  }, []);

  useEffect(() => {
    if (fullTextState[section]) {
      fullTextRef.current = true;
      setFullText(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return function saveFullTextStateBeforeUnmount() {
      if (contentType && section && fullTextRef.current) {
        onSetFullTextState({
          contentId,
          contentType,
          section,
          fullTextShown: fullTextRef.current
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const innerHTML = useMemo(
    () => limitBrs(cleanString ? text : processedStringWithURL(text)),
    [cleanString, text]
  );

  return (
    <div style={style} className={className}>
      <p>
        {fullText ? (
          <span
            dangerouslySetInnerHTML={{
              __html: innerHTML
            }}
          />
        ) : (
          <>
            <span
              ref={ContainerRef}
              style={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: maxLines,
                WebkitBoxOrient: 'vertical'
              }}
              dangerouslySetInnerHTML={{
                __html: innerHTML
              }}
            />
            <>
              {isOverflown && (
                <>
                  <a
                    style={{
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      color: readMoreColor,
                      display: 'inline-block',
                      paddingTop: '1.5rem'
                    }}
                    onClick={() => {
                      setFullText(true);
                      fullTextRef.current = true;
                    }}
                  >
                    Read More
                  </a>
                </>
              )}
            </>
          </>
        )}
      </p>
    </div>
  );
}
