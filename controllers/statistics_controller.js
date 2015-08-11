
exports.calcular = function(callback) {
	// Estadísticas que tenemos que calcular
	var stats = [
		{name: 'Número de preguntas', result: 0},
		{name: 'Número de comentarios totales', result: 0},
		{name: 'Número medio de comentarios por pregunta', result: 0},
		{name: 'Número de preguntas sin comentarios', result: 0},
		{name: 'Número de preguntas con comentarios', result: 0}

	];

	callback(stats, []);

};

