var models = require('../models/models.js');

// Autoload :id de comentarios
exports.load = function(req, res, next, commentId) {
	models.Comment.find(
			{ where: {id: Number(commentId)} }
		).then(
			function(comment) {
				if (comment) {
					req.comment = comment;
					next();	

				} else { 
					next(new Error('No existe commentId=' +  commentId));

				}

			}

		).catch(function(error) { next(error); });

};


// GET /quizes/:quizId/comments/new
exports.new = function(req, res) {
	res.render('comments/new', {quizid: req.params.quizId, errors: []});

};

// POST /quizes/:quizId/comments/create
exports.create = function(req, res) {
	var comment = models.Comment.build(
			{texto: req.body.comment.texto, QuizId: req.params.quizId}
		);

	// var hay_error = comment.validate();

	// if (hay_error) {
	// 	// Los errores són devueltos con el formato:
	// 	// { pregunta: [ '-> Falta Pregunta' ], respuesta: [ '-> Falta Respuesta' ] }

	// 	// Recuperamos los errores
	// 	var errs = [];
	// 	for (var i in hay_error) {
	// 		errs = errs.concat(hay_error[i]);

	// 	}

	// 	res.render('comments/new', {comment: comment, quizid: req.params.quizId, errors: errs});

	// } else {
	// 	// guarda en DB los campos pregunta y respuesta de quiz
	// 	comment.save().then(
	// 		function() {
	// 			res.redirect('/quizes/' + req.params.quizId);

	// 		}

	// 	); 

	// }

	comment.validate().then(
		function(err) {
			if (err) {
				res.render('comments/new', {comment: comment, quizid: req.params.quizId, errors: errs});

			} else {
				// guarda en DB los campos pregunta y respuesta de quiz
				comment.save().then(
					function() {
						res.redirect('/quizes/' + req.params.quizId);

					}

				); 

			}

		}

	);

};

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
	req.comment.publicado = true;

	req.comment.save( {fields: ["publicado"]} ).then(
			function() {
				res.redirect('/quizes/' + req.params.quizId);
			}
		);

};
