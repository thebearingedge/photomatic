const path = require('path');
const session = require('express-session');
const sessionFileStore = require('session-file-store');

const FileStore = sessionFileStore(session);

const store = new FileStore({
  ttl: 28800,
  retries: 0,
  path: path.join(__dirname, 'sessions/')
});

const sessions = session({
  cookie: {
    sameSite: true
  },
  store: store,
  resave: false,
  rolling: true,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET
});

module.exports = sessions;
