var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();	

			} else { 
				next(new Error('No existe quizId=' +  quizId));

			}

		}

	).catch(function(error) { next(error); });

};

// GET /quizes/:search
exports.index = function(req, res) {
	var buscar = req.query.search || '';

	// No nos pasan nigun filtro
	if (buscar === '') {
		models.Quiz.findAll().then(function(quizes) {
			res.render('quizes/index', {quizes: quizes, errors: []});

		});

	} else {
		// Reemplazamos los espacions por %
		// De esta forma, si busca "uno dos" ("%uno%dos%"),
		// mostrará todas las preguntas que tengan "uno" seguido de "dos",
		// independientemente de lo que haya entre "uno" y "dos".
		buscar = buscar.replace(/ /g, '%');

		models.Quiz.findAll({where: ["pregunta like ?", '%' + buscar + '%'], order: 'pregunta'}).then(function(quizes) {
			res.render('quizes/index', {quizes: quizes, errors: []});

		});		

	}

};

// GET /quizes/:id
exports.show = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', {quiz: quiz, errors: []});

	});

};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
	models.Quiz.find(req.params.quizId).then(function(quiz) {
		if (req.query.respuesta === quiz.respuesta) {
			res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto', errors: []});

		} else {
			res.render('quizes/answer', {quiz: quiz, respuesta: 'Incorrecto', errors: []});

		}

	});
	
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build( // crea objeto quiz
		{pregunta: 'Pregunta', respuesta: 'Respuesta'}
	);

	res.render('quizes/new', {quiz: quiz, errors: []});

};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );

	console.log('**1');
	console.log(req.body.quiz);
	console.log('**2');

	quiz.validate().then(
		function(err) {
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});

			} else {
				// guarda en DB los campos pregunta y respuesta de quiz
				quiz.save({fields: ["pregunta", "respuesta"]}).
					then( function() { res.redirect('/quizes'); }); // Redirección HTTP (URL relativo) lista de preguntas

			}

		}

	);

};

exports.author = function(req, res) {
	res.render('author', {errors: []});

};