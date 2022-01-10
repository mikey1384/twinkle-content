import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/Button';
import { css } from '@emotion/css';

ReactionButton.propTypes = {
  style: PropTypes.object
};

export default function ReactionButton({ style }) {
  return (
    <Button
      className={`menu-button ${css`
        opacity: 0.8;
        &:hover {
          opacity: 1;
        }
      `}`}
      style={style}
      skeuomorphic
    >
      B
    </Button>
  );
}

/*

<div class="emoji-list-wrapper"><div class="reaction-emoji-list "><div class="reaction-emoji-icon"><span class="emoji-sizer emoji-outer " style="background: url(&quot;assets/emoji.1e7786c93c8a0c1773f165e2de2fd129.png?v=20180604&quot;) 84% 82.5% / 5100%; -webkit-user-drag: none; margin: -1px; position: relative; top: 2px;">/-strong</span></div><div class="reaction-emoji-icon"><span class="emoji-sizer emoji-outer " style="background: url(&quot;assets/emoji.1e7786c93c8a0c1773f165e2de2fd129.png?v=20180604&quot;) 84% 72.5% / 5100%; -webkit-user-drag: none; margin: -1px; position: relative; top: 2px;">/-heart</span></div><div class="reaction-emoji-icon"><span class="emoji-sizer emoji-outer " style="background: url(&quot;assets/emoji.1e7786c93c8a0c1773f165e2de2fd129.png?v=20180604&quot;) 82% 7.5% / 5100%; -webkit-user-drag: none; margin: -1px; position: relative; top: 2px;">:&gt;</span></div><div class="reaction-emoji-icon"><span class="emoji-sizer emoji-outer " style="background: url(&quot;assets/emoji.1e7786c93c8a0c1773f165e2de2fd129.png?v=20180604&quot;) 84% 20% / 5100%; -webkit-user-drag: none; margin: -1px; position: relative; top: 2px;">:o</span></div><div class="reaction-emoji-icon"><span class="emoji-sizer emoji-outer " style="background: url(&quot;assets/emoji.1e7786c93c8a0c1773f165e2de2fd129.png?v=20180604&quot;) 84% 2.5% / 5100%; -webkit-user-drag: none; margin: -1px; position: relative; top: 2px;">:-((</span></div><div class="reaction-emoji-icon"><span class="emoji-sizer emoji-outer " style="background: url(&quot;assets/emoji.1e7786c93c8a0c1773f165e2de2fd129.png?v=20180604&quot;) 84% 5% / 5100%; -webkit-user-drag: none; margin: -1px; position: relative; top: 2px;">:-h</span></div><i class="fa fa-close clear-react"></i></div></div>

*/
