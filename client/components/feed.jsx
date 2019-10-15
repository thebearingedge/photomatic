import React from 'react';
import Photo from './photo';
import Header from './header';
import http from '../lib/http';

export default class Feed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: []
    };
  }

  componentDidMount() {
    http
      .get('/api/photos')
      .then(photos => this.setState({ photos }));
  }

  render() {
    return (
      <>
        <Header />
        <div className="feed mx-auto mb-5 pt-1 mt-sm-3 mt-md-5">
          {
            this.state.photos.map(photo => (
              <Photo key={photo.photoId} photo={photo} />
            ))
          }
        </div>
      </>
    );
  }
}
