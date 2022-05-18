import React, { useState } from 'react';
import Playlist from 'components/Playlist';
import { useParams } from 'react-router-dom';

export default function Content() {
  const { contentId } = useParams();
  const [background, setBackground] = useState();
  const [title, setTitle] = useState('');
  return (
    <div
      style={{
        background,
        padding: '1rem'
      }}
    >
      {title && <p style={{ fontSize: '3rem', fontWeight: 'bold' }}>{title}</p>}
      <div style={{ marginTop: '1rem' }}>
        <Playlist
          playlistId={Number(contentId)}
          onLoad={({ exists, title }) => {
            setTitle(title);
            setBackground(exists ? '#fff' : null);
          }}
        />
      </div>
    </div>
  );
}
