import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { stringIsEmpty } from 'helpers/stringHelpers';
import { css } from '@emotion/css';
import TopFilter from './TopFilter';
import Results from './Results';
import SearchBox from './SearchBox';
import { getSectionFromPathname } from 'helpers';
import { useExploreContext } from 'contexts';

Search.propTypes = {
  navigate: PropTypes.func,
  innerRef: PropTypes.object,
  pathname: PropTypes.string.isRequired,
  style: PropTypes.object
};

export default function Search({ navigate, innerRef, pathname, style }) {
  const searchText = useExploreContext((v) => v.state.search.searchText);
  const onLoadSearchResults = useExploreContext(
    (v) => v.actions.onLoadSearchResults
  );
  const category = getSectionFromPathname(pathname)?.section;
  const prevSearchText = useRef(searchText);

  useEffect(() => {
    if (
      !stringIsEmpty(prevSearchText.current) &&
      prevSearchText.current.length >= 2 &&
      (stringIsEmpty(searchText) || searchText.length < 2)
    ) {
      onLoadSearchResults({ results: [], loadMoreButton: false });
    }
    prevSearchText.current = searchText;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return (
    <div style={style}>
      <SearchBox
        style={{
          width: '50%',
          marginTop: '2rem',
          height: '5rem'
        }}
        category={category}
        className={css`
          svg,
          input {
            font-size: 2.3rem;
          }
        `}
        innerRef={innerRef}
      />
      {!stringIsEmpty(searchText) && (
        <>
          <TopFilter
            className={css`
              width: 100%;
              margin-top: 2rem;
            `}
            navigate={navigate}
            selectedFilter={category}
          />
          <Results searchText={searchText} filter={category} />
        </>
      )}
    </div>
  );
}
