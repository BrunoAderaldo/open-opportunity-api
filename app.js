const express      = require('express');
const createError  = require('http-errors');
const cookieParser = require('cookie-parser');
const logger       = require('morgan');

const indexRouter    = require('./routes/index');
const authRouter     = require('./routes/auth');
const usersRouter    = require('./routes/users');
const projectsRouter = require('./routes/projects');
const API_PREFIX     = 'v1';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(`/${API_PREFIX}/`, indexRouter);
app.use(`/${API_PREFIX}/auth`, authRouter);
app.use(`/${API_PREFIX}/users`, usersRouter);
app.use(`/${API_PREFIX}/projects`, projectsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  });
});

module.exports = app;
