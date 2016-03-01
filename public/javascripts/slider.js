$(function () {
	var color = "#fff",
	slides = [
		{ src : '/assets/main3.jpg', t : '#000', b : '#000' },
		{ src : '/assets/main8.jpg', t : '#fff', b : '#fff' },
		{ src : '/assets/main2.jpg', t : '#fff', b : '#fff' },
		{ src : '/assets/main9.jpg', t : '#fff', b : '#fff' },
		{ src : '/assets/main1.jpg', t : '#000', b : '#000' },
		{ src : '/assets/main12.jpg', t : '#fff', b : '#fff' },
		{ src : '/assets/main5.jpg', t : '#000', b : '#000' },
		{ src : '/assets/main15.jpg', t : '#fff', b : '#fff' },
		{ src : '/assets/main6.jpg', t : '#fff', b : '#fff' },
		{ src : '/assets/main7.jpg', t : '#fff', b : '#fff' },
		{ src : '/assets/main13.jpg', t : '#fff', b : '#fff' },
		{ src : '/assets/main14.jpg', t : '#fff', b : '#fff' },
		{ src : '/assets/main16.jpg', t : '#fff', b : '#fff' },
		{ src : '/assets/main17.jpg', t : '#fff', b : '#fff' }
	];

	$(".header").vegas({
		walk : function (n) {
			$(".vegas-timer-progress").css("backgroundColor", color);
			$('.header .title').css('color', slides[n].t);
			$('.header .desc').css('color', slides[n].b);

		},
		delay : 3000,
		slides: slides
		// overlay: '/libs/vegas/dist/overlays/07.png'
	});
})