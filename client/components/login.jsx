import React from 'react';
import http from '../lib/http';
import AppContext from '../lib/context';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      selectedId: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    http
      .get('/api/users')
      .then(users => this.setState({ users }));
  }

  handleChange(event) {
    this.setState({
      selectedId: parseInt(event.target.value, 10) || 0
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { selectedId } = this.state;
    if (!selectedId) {
      this.context.onLogin(null);
      this.props.history.push('/');
    } else {
      http
        .post('/api/auth', { userId: selectedId })
        .then(user => {
          this.context.onLogin(user);
          this.props.history.push('/');
        });
    }
  }

  render() {
    const isDisabled = !this.state.users.length;
    return (
      <div className="w-100 d-flex flex-column">
        <div className="p-5">
          <h1 className="text-center my-5 brand brand-lg">
            Photomatic
          </h1>
          <form onSubmit={this.handleSubmit}>
            <select
              disabled={isDisabled}
              onChange={this.handleChange}
              value={this.state.selectedId}
              className="form-control mb-4 text-muted">
              <option value="">Select User</option>
              {
                this.state.users.map(user => {
                  return (
                    <option
                      key={user.userId}
                      value={user.userId}>
                      { user.username }
                    </option>
                  );
                })
              }
            </select>
            <button type="submit" className="btn btn-block btn-primary">
              <strong>Log In</strong>
            </button>
          </form>
        </div>
      </div>
    );
  }
}

Login.contextType = AppContext;
