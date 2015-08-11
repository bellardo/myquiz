var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');
var commentController = require('../controllers/comment_controller');
var sessionController = require('../controllers/session_controller');

// Página de entrada (home page)
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
  
});

// Autoload de comandos
router.param('quizId', quizController.load);	// autoload :quizId
router.param('commentId', commentController.load);	// autoload :commentId

// Definición de las rutas de session
router.get('/login', sessionController.new);		// formulario de login
router.post('/login', sessionController.create);	// crear sesión
router.get('/logout', sessionController.destroy);	// destruir sesión

// Definición de las rutas de /quizes
router.get('/quizes', quizController.index);	// El parametro search és opcional
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', sessionController.loginRequired, quizController.new);
router.post('/quizes/create', sessionController.loginRequired, quizController.create);
router.get('/quizes/:quizId(\\d+)/edit', sessionController.loginRequired, quizController.edit);
router.put('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.update);
router.delete('/quizes/:quizId(\\d+)', sessionController.loginRequired, quizController.destroy);

// Estadísticas
router.get('/quizes/statistics', quizController.statistics);

router.get('/quizes/:quizId(\\d+)/comments/new', commentController.new);
router.post('/quizes/:quizId(\\d+)/comments', commentController.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', sessionController.loginRequired, commentController.publish);

router.get('/author', quizController.author);

module.exports = router;
