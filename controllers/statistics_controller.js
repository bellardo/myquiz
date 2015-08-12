
var models = require('../models/models.js');

exports.calcular = function(callback) {
	// Estadísticas que tenemos que calcular
	var stats = [
		{name: 'Número de preguntas', result: 0},
		{name: 'Número de comentarios totales', result: 0},
		{name: 'Número medio de comentarios por pregunta', result: 0},
		{name: 'Número de preguntas sin comentarios', result: 0},
		{name: 'Número de preguntas con comentarios', result: 0}

	];

	models.Quiz.findAll().then(
		function(quizes) {
			stats[0].result = quizes.length; 

			models.Comment.findAll().then(
				function(comments) {
					stats[1].result = comments.length; 
					stats[2].result = round(stats[1].result / stats[0].result, 2);

					models.Quiz.findAll( { include: [{model: models.Comment}] }).then(
						function (quizes) {
							var com = 0, nocom = 0;
							
							for (var i = 0; i < quizes.length; i++) {
								if (quizes[i].Comments.length > 0)
									com++;
								else nocom++;

							}

							stats[3].result = nocom;
							stats[4].result = com;

							callback(stats);

						}

					);	

				}					

			);	

		}

	);

};

// Number(Math.round(1.005 + 'e2') + 'e-2'); // 1.01
function round(value, decimals) {
	return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);

}