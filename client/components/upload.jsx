import React from 'react';
import { Link } from 'react-router-dom';
import http from '../lib/http';
import AppContext from '../lib/context';

export default class Upload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      preview: null,
      isSubmitting: false
    };
    this.fileInputRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
  }

  componentDidMount() {
    if (!this.context.isLoggedIn()) {
      return this.props.history.replace('/login');
    }
    this.fileInputRef.current.click();
  }

  handleFileChange(event) {
    const [file] = event.target.files;
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.addEventListener('loadend', () => {
      this.setState({ preview: reader.result });
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.state.preview) return;
    const formData = new FormData(event.target);
    this.setState({ isSubmitting: true }, () => {
      http
        .upload('/api/photos', formData)
        .then(() => this.props.history.push('/'));
    });

  }

  render() {
    const { preview, isSubmitting } = this.state;
    const { handleSubmit, handleFileChange, fileInputRef } = this;
    const iconClass = isSubmitting
      ? 'text-muted fa-3x fas fa-sync-alt loading-spinner'
      : 'text-muted fa-3x fas fa-camera';
    return (
      <>
        <header className="navbar d-flex justify-content-between fixed-top navbar-light border-bottom py-0 bg-white">
          <Link to="/" className="navbar-brand brand-sm m-0">
            <i className="fas fa-chevron-left text-dark" />
          </Link>
          <h5 className="mb-0">Upload</h5>
          <Link to="/login">
            <i className="fas fa-user nav-icon text-dark" />
          </Link>
        </header>
        <div className="w-100 d-flex flex-column justify-content-center">
          { preview &&
            <img className="photo-img" src={preview} />
          }
          <div className="w-100 mb-5 p-4 text-center">
            <form onSubmit={handleSubmit}>
              <label htmlFor="photoInput" className="mb-4">
                <i className={iconClass} />
              </label>
              <input
                required
                type="file"
                name="photo"
                id="photoInput"
                className="d-none"
                ref={fileInputRef}
                onChange={handleFileChange} />
              <div className="form-group">
                <div className="input-group">
                  <input
                    type="text"
                    name="location"
                    id="locationInput"
                    className="form-control"
                    placeholder="Where are you right now?" />
                  <div className="input-group-append">
                    <button className="btn btn-primary" type="submit">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </>
    );
  }
}

Upload.contextType = AppContext;
