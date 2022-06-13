import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  limitBrs,
  processMentionLink,
  processedStringWithURL
} from 'helpers/stringHelpers';
import { Color } from 'constants/css';
import { useContentState } from 'helpers/hooks';
import { useContentContext } from 'contexts';
import localize from 'constants/localize';

const readMoreLabel = localize('readMore');
const lineHeight = 1.7;

LongText.propTypes = {
  children: PropTypes.string,
  className: PropTypes.string,
  cleanString: PropTypes.bool,
  contentId: PropTypes.number,
  contentType: PropTypes.string,
  isPreview: PropTypes.bool,
  maxLines: PropTypes.number,
  section: PropTypes.string,
  style: PropTypes.object,
  readMoreHeightFixed: PropTypes.bool,
  readMoreColor: PropTypes.string
};

export default function LongText({
  style,
  className,
  cleanString,
  children: text,
  contentId,
  contentType,
  isPreview,
  section,
  maxLines = 10,
  readMoreHeightFixed,
  readMoreColor = Color.blue()
}) {
  const onSetFullTextState = useContentContext(
    (v) => v.actions.onSetFullTextState
  );
  const ContainerRef = useRef(null);
  const contentState =
    contentType && section ? useContentState({ contentType, contentId }) : {};
  const { fullTextState = {} } = contentState;
  const fullTextRef = useRef(fullTextState[section]);
  const [fullText, setFullText] = useState(
    isPreview ? false : fullTextState[section]
  );
  const [isOverflown, setIsOverflown] = useState(null);
  useEffect(() => {
    setFullText(false);
    setIsOverflown(
      ContainerRef.current?.scrollHeight >
        ContainerRef.current?.clientHeight + 2
    );
  }, [text]);

  useEffect(() => {
    if (fullTextState[section] && !isPreview) {
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

  const innerHTML = useMemo(() => {
    if (cleanString) {
      return limitBrs(text);
    }
    let processedText = processedStringWithURL(text);
    if (!fullText && processedText && isOverflown) {
      const splitText = processedText?.split('</');
      if (splitText[splitText.length - 1] === 'a>') {
        let finalTextArray = processedText?.split('<a');
        finalTextArray = finalTextArray.filter(
          (word, index) => index !== finalTextArray.length - 1
        );
        processedText = finalTextArray.join('<a') + '...';
      }
    }
    const finalText = processMentionLink(limitBrs(processedText));
    return finalText;
  }, [cleanString, fullText, text, isOverflown]);

  return (
    <div style={style} className={className}>
      <span
        ref={ContainerRef}
        style={{
          lineHeight,
          ...(fullText
            ? {}
            : {
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: maxLines,
                WebkitBoxOrient: 'vertical'
              })
        }}
      >
        {innerHTML}
      </span>
      <div
        style={{
          height: readMoreHeightFixed ? '2rem' : 'auto',
          display: 'flex',
          width: '100%',
          alignItems: 'center'
        }}
      >
        {!fullText && isOverflown && (
          <a
            style={{
              fontWeight: 'bold',
              cursor: 'pointer',
              color: readMoreColor,
              display: 'inline',
              paddingTop: '1rem'
            }}
            onClick={() => {
              setFullText(true);
              fullTextRef.current = true;
            }}
          >
            {readMoreLabel}
          </a>
        )}
      </div>
    </div>
  );
}
