export const settings = {
	dots: false,
	infinite: false,
	centerMode: false,
	speed: 500,
	slidesToShow: 4.2,
	slidesToScroll: 2,
	arrows: false,
	draggable: false,
	responsive: [
		{
			breakpoint: 1200,
			settings: {
				slidesToShow: 4.2,
				slidesToScroll: 2,
			},
		},
		{
			breakpoint: 900,
			settings: {
				slidesToShow: 2.2,
				slidesToScroll: 1,
			},
		},
		{
			breakpoint: 600,
			settings: {
				slidesToShow: 1.2,
				slidesToScroll: 1,
			},
		},
	],
};
