const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getOwnedVideos', mid.requiresLogin, controllers.Video.getOwnedVideos);
  app.get('/getVideo', controllers.Video.getVideo);
  app.get('/viewer', controllers.Video.getVideoPage);
  app.get('/player', controllers.Video.getPlayer);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/uploader', mid.requiresLogin, controllers.Video.uploaderPage);
  app.post('/uploader', mid.requiresLogin, controllers.Video.uploadVideo);

  app.post('/delete', mid.requiresLogin, controllers.Video.deleteVideo);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
