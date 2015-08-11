
var models = require('../models/models.js');

exports.calcular = function(callback) {
	var stats = [];
	var num_preg = 1, num_com = 0,
		prom_com_preg = 0, preg_sin_com = 0, preg_con_com = 0;

	models.Quiz.findAll().then(	function(quizes) { num_preg = 2 /*quizes.length;*/ } );

	// Estadísticas que tenemos que calcular
	stats = [
		{name: 'Número de preguntas', result: num_preg},
		{name: 'Número de comentarios totales', result: num_com},
		{name: 'Número medio de comentarios por pregunta', result: prom_com_preg},
		{name: 'Número de preguntas sin comentarios', result: preg_sin_com},
		{name: 'Número de preguntas con comentarios', result: preg_con_com}

	];

	callback(stats, []);

};

