import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import Like from './like';
import Save from './save';
import AppContext from '../lib/context';

export default class Photo extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      likes: props.photo.likes,
      isLikedByUser: context.userLikes(props.photo.photoId),
      isSavedByUser: context.userSaved(props.photo.photoId)
    };
    this.handleLikeClick = this.handleLikeClick.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
  }

  handleLikeClick() {
    if (!this.context.isLoggedIn()) return;
    this.context.toggleLiked(this.props.photo.photoId);
    const { likes, isLikedByUser } = this.state;
    const newLikes = isLikedByUser ? likes - 1 : likes + 1;
    this.setState({
      likes: newLikes,
      isLikedByUser: !isLikedByUser
    });
  }

  handleSaveClick() {
    if (!this.context.isLoggedIn()) return;
    const { isSavedByUser } = this.state;
    this.context.toggleSaved(this.props.photo.photoId);
    this.setState({ isSavedByUser: !isSavedByUser });
  }

  render() {
    const { handleLikeClick, handleSaveClick } = this;
    const { likes, isLikedByUser, isSavedByUser } = this.state;
    const {
      photoId, filename, user, comments, location, createdAt
    } = this.props.photo;
    const likesText = likes === 1 ? '1 like' : `${this.state.likes} likes`;
    const timeAgo = formatDistance(
      new Date(createdAt),
      new Date()
    ).toUpperCase() + ' AGO';
    return (
      <div className="photo bg-white">
        <div className="container">
          <p className="mb-0 py-2 py-md-3">
            <strong>{ user.username }</strong><br/>
            <small>{ location }</small>
          </p>
        </div>
        <img className="photo-img" src={`/photos/${filename}`} />
        <div className="container py-3 py-md-4">
          <div className="row pb-2">
            <div className="col-6">
              <Like onClick={handleLikeClick} isLikedByUser={isLikedByUser} />
              <Link to={`/p/${photoId}/comments`}>
                <i className="far fa-comment photo-control ml-3 text-dark" />
              </Link>
            </div>
            <div className="col-6 text-right">
              <Save onClick={handleSaveClick} isSavedByUser={isSavedByUser} />
            </div>
          </div>
          <div className={comments.length ? 'mb-3' : ''}>
            <strong>{ likesText }</strong>
          </div>
          {
            comments.map(comment => (
              <div key={comment.commentId} className="comment">
                <strong>{ comment.user.username }</strong> { comment.content }
              </div>
            ))
          }
          <div className="text-muted">
            <small>{ timeAgo }</small>
          </div>
        </div>
      </div>
    );
  }
}

Photo.contextType = AppContext;
