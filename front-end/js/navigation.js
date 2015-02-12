jQuery(document).ready(function($) {

	var openModal = null;

	$(".modalOption").click(function (event) {
		event.preventDefault(); //Isn't this still NOT working and unnecessary?
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
});

/**
 * Function for handling users choice of color.
 */
function colors() {
	$(".color").click(function (event) { 
		console.log($(this).attr("href"));
		var colorHex = $(this).attr("href");
		cb.setColor(colorHex);
		//Success message or just close modal?
	});
}

/**
 * Function for handling different settings options.
 */
function settings() {

}