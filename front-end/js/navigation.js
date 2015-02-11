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
			switch(id) {
				case "perspective":
					cb.renderPerspectives();
					break;
				case "base":
					//cb.setBaseSize(send in base-size here!);
					break;
				case "settings":
					//Should be able to handle different cases since settings-modal 
					//should have multiple choices and functions.
					break;
				case "colors":
					//cb.setColor(send in the color here!);
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