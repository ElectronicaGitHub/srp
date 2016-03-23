$(function () {
	
	$('.js-init-place').on('click', function (e) {
		if ($(window).width() >= 768) {
			e.preventDefault();
			var place;
			for (var i in window.places) {
				if ($(this).attr('data-id') == window.places[i]._id) {
					place = window.places[i];

					console.log('find', place);

					$('#placesModal .title').text(place.title);
					$('#placesModal .description').text(place.description_full);
					$('#placesModal .image').css({
						'background-image' : 'url(' + place.images[0].path + ')'
					});
					$('#placesModal').modal('show');
				}
			}
		} 
	});
});