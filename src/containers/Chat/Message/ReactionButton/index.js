import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import Emojis from './emojis.png';
import ErrorBoundary from 'components/ErrorBoundary';
import { Color } from 'constants/css';
import { css } from '@emotion/css';

ReactionButton.propTypes = {
  style: PropTypes.object
};

const reactions = [
  {
    label: 'thumb',
    position: '84% 82.5%'
  },
  {
    label: 'heart',
    position: '84% 72.5%'
  },
  {
    label: 'laughing',
    position: '82% 7.5%'
  },
  {
    label: 'surprised',
    position: '84% 20%'
  },
  {
    label: 'crying',
    position: '84% 2.5%'
  },
  {
    label: 'angry',
    position: '84% 5%'
  }
];

export default function ReactionButton({ style }) {
  const [mouseEntered, setMouseEntered] = useState(false);

  return (
    <ErrorBoundary>
      <div
        style={{ display: 'flex', ...style }}
        onMouseEnter={() => setMouseEntered(true)}
        onMouseLeave={() => setMouseEntered(false)}
      >
        {mouseEntered && (
          <div
            style={{
              width: '20rem',
              background: 'rgb(255, 255, 255)',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              marginRight: '0.5rem',
              boxShadow: `0 0 1px ${Color.black()}`,
              outline: 0
            }}
          >
            {reactions.map((reaction) => (
              <div
                key={reaction.label}
                style={{
                  cursor: 'pointer',
                  width: '2rem',
                  height: '2rem',
                  background: `url(${Emojis}) ${reaction.position} / 5100%`
                }}
              />
            ))}
          </div>
        )}
        <Button
          className={`menu-button ${css`
            padding: 0.3rem 0.5rem;
            opacity: 0.8;
            &:hover {
              opacity: 1;
            }
          `}`}
          skeuomorphic
        >
          <div
            style={{
              width: '2rem',
              height: '2rem',
              background: `url(${Emojis}) 84% 82.5% / 5100%`
            }}
          />
        </Button>
      </div>
    </ErrorBoundary>
  );
}

// 84% 82.5% thumbs
// 84% 2.5% crying
// 84% 20% surprised
// 84% 5% angry
// 82% 7.5% laughing
// 84% 72.5% heart
/*

<div class="emoji-list-wrapper"><div class="reaction-emoji-list "><div class="reaction-emoji-icon"><span class="emoji-sizer emoji-outer " style="background: url(&quot;assets/emoji.1e7786c93c8a0c1773f165e2de2fd129.png?v=20180604&quot;) 84% 82.5% / 5100%; -webkit-user-drag: none; margin: -1px; position: relative; top: 2px;">/-strong</span></div><div class="reaction-emoji-icon"><span class="emoji-sizer emoji-outer " style="background: url(&quot;assets/emoji.1e7786c93c8a0c1773f165e2de2fd129.png?v=20180604&quot;) 84% 72.5% / 5100%; -webkit-user-drag: none; margin: -1px; position: relative; top: 2px;">/-heart</span></div><div class="reaction-emoji-icon"><span class="emoji-sizer emoji-outer " style="background: url(&quot;assets/emoji.1e7786c93c8a0c1773f165e2de2fd129.png?v=20180604&quot;) 82% 7.5% / 5100%; -webkit-user-drag: none; margin: -1px; position: relative; top: 2px;">:&gt;</span></div><div class="reaction-emoji-icon"><span class="emoji-sizer emoji-outer " style="background: url(&quot;assets/emoji.1e7786c93c8a0c1773f165e2de2fd129.png?v=20180604&quot;) 84% 20% / 5100%; -webkit-user-drag: none; margin: -1px; position: relative; top: 2px;">:o</span></div><div class="reaction-emoji-icon"><span class="emoji-sizer emoji-outer " style="background: url(&quot;assets/emoji.1e7786c93c8a0c1773f165e2de2fd129.png?v=20180604&quot;) 84% 2.5% / 5100%; -webkit-user-drag: none; margin: -1px; position: relative; top: 2px;">:-((</span></div><div class="reaction-emoji-icon"><span class="emoji-sizer emoji-outer " style="background: url(&quot;assets/emoji.1e7786c93c8a0c1773f165e2de2fd129.png?v=20180604&quot;) 84% 5% / 5100%; -webkit-user-drag: none; margin: -1px; position: relative; top: 2px;">:-h</span></div><i class="fa fa-close clear-react"></i></div></div>

*/
