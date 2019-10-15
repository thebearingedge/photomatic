import React from 'react';

export default function Save(props) {
  const { onClick, isSavedByUser } = props;
  const iconClass = isSavedByUser
    ? 'photo-control fas fa-bookmark'
    : 'photo-control far fa-bookmark';
  return (
    <i onClick={onClick} className={iconClass} />
  );
}
