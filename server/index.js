const path = require('path');
const express = require('express');
const upload = require('./upload');
const sessions = require('./sessions');
const database = require('./database');
const authorize = require('./authorize');
const { ClientError, errorHandler } = require('./errors');

const app = express();

app.use(sessions);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/users', (req, res, next) => {
  const sql = `
    select "userId",
           "username"
      from "users"
  `;
  database
    .query(sql)
    .then(result => {
      const users = result.rows;
      res.json(users);
    })
    .catch(err => next(err));
});

app.post('/api/auth', (req, res, next) => {
  const userId = parseInt(req.body.userId, 10);
  if (!userId) {
    return next(new ClientError(400, 'Invalid userId.'));
  }
  const sql = `
    select "u"."userId",
           "u"."username",
           array_remove(array_agg(distinct "l"."photoId"), null) as "likedPhotos",
           array_remove(array_agg(distinct "b"."photoId"), null) as "savedPhotos"
      from "users" as "u"
      left join "likes" as "l" using ("userId")
      left join "bookmarks" as "b" using ("userId")
     where "u"."userId" = $1
     group by "u"."userId"
     limit 1
  `;
  const params = [userId];
  database
    .query(sql, params)
    .then(result => {
      const user = result.rows[0];
      if (!user) {
        return next(new ClientError(401, 'User does not exist.'));
      }
      req.session.regenerate(err => {
        if (err) return next(err);
        req.session.userId = user.userId;
        res.status(201).json(user);
      });
    })
    .catch(err => next(err));
});

app.get('/api/auth', (req, res, next) => {
  if (!req.session.userId) {
    return res.json({ user: null });
  }
  const sql = `
    select "u"."userId",
           "u"."username",
           array_remove(array_agg(distinct "l"."photoId"), null) as "likedPhotos",
           array_remove(array_agg(distinct "b"."photoId"), null) as "savedPhotos"
      from "users" as "u"
      left join "likes" as "l" using ("userId")
      left join "bookmarks" as "b" using ("userId")
     where "u"."userId" = $1
     group by "u"."userId"
     limit 1
  `;
  const params = [req.session.userId];
  database
    .query(sql, params)
    .then(result => {
      const user = result.rows[0];
      req.session.userId = user.userId;
      res.json({ user });
    })
    .catch(err => next(err));
});

app.get('/api/photos', (req, res, next) => {
  const sql = `
    select "p"."photoId",
           "p"."filename",
           "p"."location",
           "p"."createdAt",
           count(distinct "l".*)::integer as "likes",
           to_json(("u"."userId", "u"."username")::"users") as "user",
           to_json(array(
             select "photoComments"
               from (
                 select "c".*,
                        ("u"."userId", "u"."username")::"users" as "user"
                   from "comments" as "c"
                   join "users" as "u" using ("userId")
                  where "c"."photoId" = "p"."photoId"
                  order by "c"."createdAt"
               ) as "photoComments"
           )) as "comments"
      from "photos" as "p"
      join "users" as "u" using ("userId")
      left join "likes" as "l" using ("photoId")
     group by "p"."photoId",
              "u"."userId"
     order by "p"."createdAt" desc
  `;
  database
    .query(sql)
    .then(result => {
      const photos = result.rows;
      res.json(photos);
    })
    .catch(err => next(err));
});

app.post('/api/photos', authorize, upload.single('photo'), (req, res, next) => {
  const location = String(req.body.location).trim() || null;
  if (!req.file) {
    return next(new ClientError(400, 'A photo is required.'));
  }
  const sql = `
    insert into "photos" ("userId", "filename", "location")
    values ($1, $2, $3)
    returning *
  `;
  const params = [req.session.userId, req.file.filename, location];
  database
    .query(sql, params)
    .then(result => {
      const photo = result.rows[0];
      res.status(201).json(photo);
    })
    .catch(err => next(err));
});

app.get('/api/comments', (req, res, next) => {
  const photoId = parseInt(req.query.photoId, 10);
  if (!photoId) {
    return next(new ClientError(400, 'Invalid photoId.'));
  }
  const sql = `
    select "c".*,
           to_json(("u"."userId", "u"."username")::"users") as "user"
      from "comments" as "c"
      join "users" as "u" using ("userId")
     where "c"."photoId" = $1
     order by "c"."createdAt"
  `;
  const params = [photoId];
  database
    .query(sql, params)
    .then(result => {
      const comments = result.rows;
      res.json(comments);
    })
    .catch(err => next(err));
});

app.post('/api/comments', authorize, (req, res, next) => {
  const photoId = parseInt(req.body.photoId, 10);
  if (!photoId) {
    return next(new ClientError(400, 'Invalid photoId.'));
  }
  const content = req.body.content;
  if (!content || !content.toString().trim()) {
    return next(new ClientError(400, 'Comments cannot be empty.'));
  }
  const sql = `
    with "comment" as (
      insert into "comments" ("userId", "photoId", "content")
      values ($1, $2, $3)
      returning *
    )
    select "c".*,
           to_json(("u"."userId", "u"."username")::"users") as "user"
      from "comment" as "c"
      join "users" as "u" using ("userId")
  `;
  const params = [req.session.userId, photoId, content];
  database
    .query(sql, params)
    .then(result => {
      const comment = result.rows[0];
      res.status(201).json(comment);
    })
    .catch(err => next(err));
});

app.post('/api/likes', authorize, (req, res, next) => {
  const photoId = parseInt(req.body.photoId, 10);
  if (!photoId) {
    return next(new ClientError(400, 'A photoId is required.'));
  }
  const sql = `
    insert into "likes" ("userId", "photoId")
    values ($1, $2)
    returning *
  `;
  const params = [req.session.userId, photoId];
  database
    .query(sql, params)
    .then(result => {
      const like = result.rows[0];
      res.status(201).json(like);
    })
    .catch(err => next(err));
});

app.delete('/api/likes', authorize, (req, res, next) => {
  const likeId = parseInt(req.query.photoId, 10);
  if (!likeId) {
    return next(new ClientError(400, 'Invalid photoId.'));
  }
  const sql = `
    delete from "likes"
     where "userId" = $1
       and "photoId" = $2
  `;
  const params = [req.session.userId, likeId];
  database
    .query(sql, params)
    .then(() => {
      res.status(204).json({});
    })
    .catch(err => next(err));
});

app.post('/api/bookmarks', authorize, (req, res, next) => {
  const photoId = parseInt(req.body.photoId, 10);
  if (!photoId) {
    return next(new ClientError(400, 'Invalid photoId.'));
  }
  const sql = `
    insert into "bookmarks" ("userId", "photoId")
    values ($1, $2)
    returning *
  `;
  const params = [req.session.userId, photoId];
  database
    .query(sql, params)
    .then(result => {
      const bookmark = result.rows[0];
      res.status(201).json(bookmark);
    })
    .catch(err => next(err));
});

app.delete('/api/bookmarks', authorize, (req, res, next) => {
  const photoId = parseInt(req.query.photoId, 10);
  if (!photoId) {
    return next(new ClientError(400, 'Invalid photoId.'));
  }
  const sql = `
    delete from "bookmarks"
     where "userId" = $1
       and "photoId" = $2
  `;
  const params = [req.session.userId, photoId];
  database
    .query(sql, params)
    .then(() => {
      res.status(204).json({});
    })
    .catch(err => next(err));
});

app.use('/api/*', (req, res, next) => {
  next(new ClientError(404, `Cannot ${req.method} ${req.originalUrl}.`));
});

app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.use(errorHandler);

app.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${process.env.PORT}`);
});
