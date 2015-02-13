jQuery(document).ready(function($) {

	var openModal = null;

	$(".modalOption").click(function (event) {
		event.preventDefault();
		var href = $(this).attr("href");

		if (href === openModal) {
			closeModal();
		} else {
			closeModal();

			var id = $(this).attr("id");
		
			$('#modal').toggleClass('open');
			$(href).toggleClass('open');
			openModal = href;

			//Switches function to call depending on the id of the chosen menu link.
			//Needs cases for switching between cube and eraser.
			switch(id) {
				case "perspective":
					cb.renderPerspectives();
					perspective();
					break;
				case "base":
					//cb.setBaseSize(send in base-size here!);
					break;
				case "settings":
					settings();
					break;
				case "colors":
					colors();
					break;
				default:
			};
			cb.enableOrDisableOrbit(false);
		}
	});

	function closeModal() {
		$(openModal).removeClass('open');
		$('#modal').removeClass('open');
		openModal = null;
		cb.enableOrDisableOrbit(true);
	}

	/**
	 * Function for handling users choice of perspective.
	 */
	function perspective() {
		$(".perspective").click(function (event) {
			event.preventDefault();
			var perspective = $(this).attr("href");
			cb.perspective(perspective);
			closeModal();
		});
	}

	/**
	 * Function for handling users choice of color.
	 */
	function colors() {
		$(".color").click(function (event) {
			event.preventDefault();
			var colorHex = $(this).attr("href");
			cb.setColor(colorHex);
			closeModal();
		});
	}

	/**
	 * Function for handling different settings options.
	 */
	function settings() {

	}
});