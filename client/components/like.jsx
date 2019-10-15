import React from 'react';

export default function Like(props) {
  const { onClick, isLikedByUser } = props;
  const iconClass = isLikedByUser
    ? 'photo-control fas fa-heart text-danger'
    : 'photo-control far fa-heart';
  return (
    <i onClick={onClick} className={iconClass} />
  );
}
