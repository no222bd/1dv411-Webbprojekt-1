jQuery(document).ready(function($) {

	var oldhref = "";

	$(".modalOption").click(function (event) {
		event.preventDefault(); //Isn't this still NOT working and unnecessary?
		
		var href = $(this).attr("href");
		var id = $(this).attr("id");
		
		if (oldhref === href || oldhref === "") {
			
			$('#modal').toggleClass('open');
			$(href).toggleClass('open');

			//Switches function to call depending on the id of the chosen menu link.
			switch(id) {
				case "perspective":
					cb.renderPerspectives();
					break;
				case "base":
					//cb function for base.
					break;
				case "settings":
					//cb function for settings.
					break;
				case "colors":
					//cb function that changes color.
					break;
				default:
			};
			
			//make sure user can't rotate model if popup is open
			cb.enableOrDisableOrbit();

			if (oldhref === "") {
				oldhref = href;
			} else {
				oldhref = "";
			}
		}else{
			$(oldhref).removeClass('open');
			$('#modal').removeClass('open');
			oldhref = "";
			$(this).trigger('click');
		}
	});

});