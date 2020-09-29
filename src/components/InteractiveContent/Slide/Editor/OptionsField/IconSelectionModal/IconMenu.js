import React from 'react';
import Button from 'components/Button';
import Icon from 'components/Icon';

const availableIcons = [
  'align-justify',
  ['fab', 'android'],
  ['fab', 'apple'],
  'arrow-up',
  'arrow-down',
  'arrow-left',
  'arrow-right',
  ['far', 'badge-dollar'],
  'ban',
  'bars',
  'bolt',
  'book',
  'briefcase',
  'camera-alt',
  'caret-down',
  'certificate',
  ['far', 'certificate'],
  'chalkboard-teacher',
  'check',
  'check-circle',
  'chess',
  'chevron-up',
  'chevron-down',
  'chevron-left',
  'chevron-right',
  'clipboard-check',
  'code-branch',
  'comment',
  'comment-alt',
  'comments',
  'copy',
  'crown',
  'exchange-alt',
  'film',
  'file',
  'file-archive',
  'file-audio',
  'file-pdf',
  'file-video',
  'file-word',
  'link',
  'heart',
  'heart-square',
  'home',
  'lock',
  'minus',
  'paperclip',
  'paper-plane',
  'pencil-alt',
  'phone-volume',
  'plus',
  'reply',
  'search',
  'school',
  'shopping-bag',
  'sign-out-alt',
  'sliders-h',
  'star',
  ['far', 'star'],
  'surprise',
  'tasks',
  'thumbs-up',
  'times',
  'trash-alt',
  'trash-restore',
  'tree',
  'trophy',
  'user',
  'upload',
  'user-graduate',
  'users',
  'volume-mute',
  ['fab', 'windows']
];

export default function IconMenu() {
  return (
    <div>
      {availableIcons.map((icon) => (
        <Button
          style={{
            display: 'inline',
            marginRight: '1rem',
            marginBottom: '1rem'
          }}
          key={icon}
          skeuomorphic
        >
          <Icon icon={icon} />
        </Button>
      ))}
    </div>
  );
}
