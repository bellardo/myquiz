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

// GET /quizes
exports.index = function(req, res, next) {
	var buscar = req.query.search || '';

	// No nos pasan nigun filtro
	if (buscar === '') {
		models.Quiz.findAll().then(
			function(quizes) {
				res.render('quizes/index', {quizes: quizes, errors: []});

			}

		).catch(function(error) { next(error); });

	} else {
		// Reemplazamos los espacions por %
		// De esta forma, si busca "uno dos" ("%uno%dos%"),
		// mostrará todas las preguntas que tengan "uno" seguido de "dos",
		// independientemente de lo que haya entre "uno" y "dos".
		buscar = buscar.replace(/ /g, '%');

		models.Quiz.findAll({where: ["pregunta like ?", '%' + buscar + '%'], order: 'pregunta'}).then(
			function(quizes) {
				res.render('quizes/index', {quizes: quizes, errors: []});

			}

		).catch(function(error) { next(error); });		

	}

};

// GET /quizes/:id
exports.show = function(req, res, next) {
	models.Quiz.find(req.params.quizId).then(
		function(quiz) {
			res.render('quizes/show', {quiz: quiz, errors: []});

		}

	).catch(function(error) { next(error); });

};

// GET /quizes/:id/answer
exports.answer = function(req, res, next) {
	models.Quiz.find(req.params.quizId).then(
		function(quiz) {
			if (req.query.respuesta === quiz.respuesta) {
				res.render('quizes/answer', {quiz: quiz, respuesta: 'Correcto', errors: []});

			} else {
				res.render('quizes/answer', {quiz: quiz, respuesta: 'Incorrecto', errors: []});

			}
		}

	).catch(function(error) { next(error); });
	
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build( // crea objeto quiz
		{pregunta: 'Pregunta', respuesta: 'Respuesta', tema: 'otro'}
	);

	res.render('quizes/new', {quiz: quiz, errors: []});

};

// POST /quizes/create
exports.create = function(req, res, next) {
	var quiz = models.Quiz.build( req.body.quiz );

	var hay_error = quiz.validate();

	if (hay_error) {
		// Los errores són devueltos con el formato:
 		// { pregunta: [ '-> Falta Pregunta' ], respuesta: [ '-> Falta Respuesta' ] }

		// Recuperamos los errores
		var errs = [];
		for (var i in hay_error) {
			errs = errs.concat(hay_error[i]);

		}

		res.render('quizes/new', {quiz: quiz, errors: errs});

	} else {
		// guarda en DB los campos pregunta y respuesta de quiz
		quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(
			function() {
				res.redirect('/quizes'); // Redirección HTTP (URL relativo) lista de preguntas

			}

		).catch(function(error) { next(error); }); 

	}

};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; // autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});

};

// PUT /quizes/:id
exports.update = function(req, res, next) {
	// Una vez pre-cargado el objeto quiz (autoload: :quizId)
	// lo actualizamos con los valores enviados desde el formulario
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	var hay_error = req.quiz.validate();

	if (hay_error) {
		// Recuperamos los errores
		var errs = [];
		for (var i in hay_error) {
			errs = errs.concat(hay_error[i]);

		}

		res.render('quizes/edit', {quiz: req.quiz, errors: errs});

	} else {
		// save: guarda los campos pregunta y respuesta en DB
		req.quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(
			// Redirección HTTP lista de preguntas (URL relativo)
			function() { res.redirect('/quizes'); }

		).catch(function(error) { next(error); }); 

	}

};

// DELETE /quizes/:id
exports.destroy = function(req, res, next) {
	req.quiz.destroy().then(
		function() { res.redirect('/quizes'); }

	).catch(function(error) { next(error); });

};

exports.author = function(req, res) {
	res.render('author', {errors: []});

};