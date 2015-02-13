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
					break;
				case "base":
					baseSize();
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
	 * Function for handling users choice of baseSize.
	 */
	function baseSize() {
		$("#reset").click(function (event) {
			event.preventDefault();
			cb.reset();
			closeModal();
		});

		$(".sizeControl").click(function (event) {
			event.preventDefault();
			var href = $(this).attr("href");
			var currentSize = $('#sizePreview').text();

			switch(href) {
				case "#up":
					if (currentSize != 20) {
						currentSize = parseInt(currentSize) + 2;
					}
					break;
				case "#down":
					if (currentSize != 2) {
						currentSize = parseInt(currentSize) - 2;
					}
					break;
				default:
			};

			$('#sizePreview').text(currentSize);
			cb.setBaseSize(currentSize);
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