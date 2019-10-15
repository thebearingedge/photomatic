import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import http from '../lib/http';
import AppContext from '../lib/context';

export default class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      comments: [],
      content: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ content: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { content } = this.state;
    const { photoId } = this.props.match.params;
    http
      .post('/api/comments', { photoId, content })
      .then(comment => {
        this.setState({
          content: '',
          comments: this.state.comments.concat(comment)
        });
      });
  }

  componentDidMount() {
    if (!this.context.isLoggedIn()) {
      return this.props.history.push('/login');
    }
    const { photoId } = this.props.match.params;
    http
      .get(`/api/comments?photoId=${photoId}`)
      .then(comments => this.setState({ comments }));
  }

  render() {
    const { content, comments } = this.state;
    const { handleChange, handleSubmit } = this;
    return (
      <div className="w-100 pt-1">
        <header className="navbar d-flex justify-content-between fixed-top navbar-light border-bottom py-0 bg-white">
          <Link to="/" className="navbar-brand brand-sm m-0">
            <i className="fas fa-chevron-left text-dark" />
          </Link>
          <h5 className="mb-0">Comments</h5>
          <Link to="/login">
            <i className="fas fa-user nav-icon text-dark" />
          </Link>
        </header>
        <div>
          <form onSubmit={handleSubmit} className="bg-light p-4">
            <div className="input-group">
              <input
                required
                type="text"
                name="content"
                value={content}
                onChange={handleChange}
                className="form-control"
                placeholder="Add a comment..." />
              <div className="input-group-append">
                <button className="btn btn-primary" type="submit">
                  Post
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="bg-white border-top border-bottom p-4">
          { comments.length === 0 &&
            <div className="text-muted">Be the first to comment.</div>
          }
          {
            comments.map(comment => {
              const { commentId, content, createdAt, user } = comment;
              const timeAgo = formatDistance(
                new Date(createdAt),
                new Date()
              ).toUpperCase() + ' AGO';
              return (
                <div key={commentId} className="comment mb-2">
                  <strong>{ user.username }</strong> { content }<br/>
                  <small className="text-muted">{ timeAgo }</small>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}

Comments.contextType = AppContext;
