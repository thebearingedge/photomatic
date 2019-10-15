import React from 'react';
import Feed from './feed';
import Login from './login';
import Upload from './upload';
import Comments from './comments';
import http from '../lib/http';
import AppContext from '../lib/context';
import { BrowserRouter as Router, Route } from 'react-router-dom';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: null,
      isAuthorizing: true
    };
    this.contextValue = {
      onLogin: this.onLogin.bind(this),
      userLikes: this.userLikes.bind(this),
      userSaved: this.userSaved.bind(this),
      isLoggedIn: this.isLoggedIn.bind(this),
      toggleLiked: this.toggleLiked.bind(this),
      toggleSaved: this.toggleSaved.bind(this)
    };
  }

  componentDidMount() {
    http
      .get('/api/auth')
      .then(result => this.setState({
        isAuthorizing: false,
        currentUser: result.user
      }));
  }

  likePhoto(photoId) {
    http
      .post('/api/likes', { photoId })
      .then(() => {
        const { likedPhotos } = this.state.currentUser;
        const updatedLikes = likedPhotos.concat(photoId);
        this.setState({
          currentUser: {
            ...this.state.currentUser,
            likedPhotos: updatedLikes
          }
        });
      });
  }

  unlikePhoto(photoId) {
    http
      .delete(`/api/likes?photoId=${photoId}`)
      .then(() => {
        const { likedPhotos } = this.state.currentUser;
        const updatedLikes = likedPhotos.filter(liked => liked !== photoId);
        this.setState({
          currentUser: {
            ...this.state.currentUser,
            likedPhotos: updatedLikes
          }
        });
      });
  }

  savePhoto(photoId) {
    http
      .post('/api/bookmarks', { photoId })
      .then(() => {
        const { savedPhotos } = this.state.currentUser;
        const updatedSaves = savedPhotos.concat(photoId);
        this.setState({
          currentUser: {
            ...this.state.currentUser,
            savedPhotos: updatedSaves
          }
        });
      });
  }

  unsavePhoto(photoId) {
    http
      .delete(`/api/bookmarks?photoId=${photoId}`)
      .then(() => {
        const { savedPhotos } = this.state.currentUser;
        const updatedSaves = savedPhotos.filter(saved => saved !== photoId);
        this.setState({
          currentUser: {
            ...this.state.currentUser,
            savedPhotos: updatedSaves
          }
        });
      });
  }

  onLogin(user) {
    this.setState({ currentUser: user });
  }

  isLoggedIn() {
    return this.state.currentUser !== null;
  }

  userLikes(photoId) {
    return this.isLoggedIn() &&
           this.state.currentUser.likedPhotos.includes(photoId);
  }

  userSaved(photoId) {
    return this.isLoggedIn() &&
           this.state.currentUser.savedPhotos.includes(photoId);
  }

  toggleLiked(photoId) {
    this.userLikes(photoId)
      ? this.unlikePhoto(photoId)
      : this.likePhoto(photoId);
  }

  toggleSaved(photoId) {
    this.userSaved(photoId)
      ? this.unsavePhoto(photoId)
      : this.savePhoto(photoId);
  }

  render() {
    if (this.state.isAuthorizing) return null;
    return (
      <div className="min-vh-100 d-flex pt-5">
        <AppContext.Provider value={this.contextValue}>
          <Router>
            <Route exact path="/" component={Feed} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/upload" component={Upload} />
            <Route exact path="/p/:photoId/comments" component={Comments} />
          </Router>
        </AppContext.Provider>
      </div>
    );
  }
}
