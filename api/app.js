const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const adminAuthMiddleware = require('./middlewares/admin-auth');
require('dotenv').config();

const indexRouter = require('./routes/index');
const categoriesRouter = require('./routes/categories');
const coursesRouter = require('./routes/courses');
const chaptersRouter = require('./routes/chapters');

const usersRouter = require( './routes/users' );

// 后台路由文件
const adminArticlesRouter = require('./routes/admin/articles');
const adminCategoriesRouter = require('./routes/admin/categories');
const adminSettingsRouter = require('./routes/admin/settings');
const adminUsersRouter = require('./routes/admin/users');
const adminCoursesRouter = require('./routes/admin/courses');
const adminChaptersRouter = require('./routes/admin/chapters');
const adminChartsRouter = require('./routes/admin/charts');
const adminAuthRouter = require('./routes/admin/auth');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/categories', categoriesRouter);
app.use('/courses', coursesRouter);
app.use('/chapters', chaptersRouter);

app.use('/users', usersRouter);

app.use('/admin/articles', adminAuthMiddleware, adminArticlesRouter);
app.use('/admin/categories', adminAuthMiddleware, adminCategoriesRouter);
app.use('/admin/settings', adminAuthMiddleware, adminSettingsRouter);
app.use('/admin/users', adminAuthMiddleware, adminUsersRouter);
app.use('/admin/courses', adminAuthMiddleware, adminCoursesRouter);
app.use('/admin/chapters', adminAuthMiddleware, adminChaptersRouter);
app.use('/admin/charts', adminAuthMiddleware, adminChartsRouter);

app.use('/admin/auth', adminAuthRouter);

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
  res.render('error');
});

module.exports = app;
