import React from 'react';
import ShopPanel from './ShopPanel';
import Icon from 'components/Icon';

export default function Shop() {
  return (
    <div>
      <ShopPanel title="Tier 1" style={{ marginBottom: '1rem' }} loaded>
        <div>This is my section</div>
      </ShopPanel>
      <ShopPanel loaded title="Tier 2">
        <div>
          <Icon icon="lock" />
        </div>
      </ShopPanel>
    </div>
  );
}
