import React from 'react';
import { useMyState } from 'helpers/hooks';

export default function MultiMissionPage() {
  const { status } = useMyState();
  console.log(status);
  return (
    <div>
      <div>This is multi mission page</div>
    </div>
  );
}
