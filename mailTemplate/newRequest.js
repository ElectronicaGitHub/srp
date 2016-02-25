module.exports = function (body) {
	return '<div>' +
			'<h4>Заказ на: ' + body.title + '</h4>' + 
			'<p>Имя: ' + body.name + '</p>' + 
			'<p>Количество мест: ' + body.count + '</p>' + 
			'<p>Даты: ' + body.dates + '</p>' + 
			'<p>Телефон: ' + body.phone + '</p>' + 
			'<p>Итоговая сумма: ' + body.price + '</p>' + 
		'</div>';
}